// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./eERCAdapter.sol";

contract TreasuryManager {
    address public moduleController;
    eERCAdapter public adapter;

    event BatchCreated(bytes32 indexed batchId, address indexed creator, bytes32[] txIds);
    event BatchSettled(bytes32 indexed batchId);

    constructor(address _adapter) {
        moduleController = msg.sender;
        adapter = eERCAdapter(_adapter);
    }

    modifier onlyController() {
        require(msg.sender == moduleController, "only controller");
        _;
    }

    /// @notice For demo: settle a single encrypted transfer via eERCAdapter
    function settleEncryptedTransfer(address to, bytes calldata encryptedAmount, bytes calldata proof) external onlyController {
        adapter.transferEncrypted(to, encryptedAmount, proof);
    }

    /// @notice Create a batch (demo-only placeholder)
    function createBatch(bytes32[] calldata txIds) external returns (bytes32) {
        bytes32 id = keccak256(abi.encodePacked(msg.sender, txIds, block.timestamp));
        emit BatchCreated(id, msg.sender, txIds);
        return id;
    }

    /// @notice Mark batch settled
    function settleBatch(bytes32 batchId) external onlyController {
        emit BatchSettled(batchId);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Errors.sol";
import "./Events.sol";
import "./IeERCAdapter.sol";

interface IAuditRegistry {
    function logSettlement(bytes32 batchId, bytes32[] calldata proposalIds, bytes32 settlementTxHash) external;
}

contract TreasuryManager {
    address public immutable linkedSafe;
    bytes32[] public pendingBatch;
    uint64 public batchWindow;
    uint16 public batchSizeThreshold;
    uint64 public lastSettlement;
    
    struct ProposalContext {
        address recipient;
        bytes ciphertext;
        bytes proof;
    }
    mapping(bytes32 => ProposalContext) public proposalContexts;
    mapping(address => bool) public registered;

    IeERCAdapter public eERCAdapter;
    IAuditRegistry public auditRegistry;

    constructor(address _linkedSafe, address _eERCAdapter, address _auditRegistry, uint64 _batchWindow, uint16 _batchSizeThreshold) {
        linkedSafe = _linkedSafe;
        eERCAdapter = IeERCAdapter(_eERCAdapter);
        auditRegistry = IAuditRegistry(_auditRegistry);
        batchWindow = _batchWindow;
        batchSizeThreshold = _batchSizeThreshold;
        lastSettlement = uint64(block.timestamp);
    }

    function queueTransfer(bytes32 proposalId, address recipient, bytes calldata ciphertext, bytes calldata proof) external {
        pendingBatch.push(proposalId);
        proposalContexts[proposalId] = ProposalContext(recipient, ciphertext, proof);
        emit Events.BatchQueued(proposalId, lastSettlement);
    }

    function executeBatch(bytes32 batchId) external {
        if (block.timestamp < lastSettlement + batchWindow && pendingBatch.length < batchSizeThreshold) {
            revert Errors.BatchNotReady();
        }

        bytes32[] memory currentBatch = pendingBatch;
        delete pendingBatch;
        lastSettlement = uint64(block.timestamp);

        for (uint i = 0; i < currentBatch.length; i++) {
            bytes32 pId = currentBatch[i];
            ProposalContext memory ctx = proposalContexts[pId];
            eERCAdapter.submitEncryptedTransfer(ctx.recipient, ctx.ciphertext, ctx.proof);
        }

        bytes32 txHash = bytes32(0); // Indexer will pick up actual tx hash from log
        auditRegistry.logSettlement(batchId, currentBatch, txHash);
        
        emit Events.BatchSettled(batchId, currentBatch, txHash, block.timestamp);
    }

    function getTreasurySummary() external view returns (bool isRegistered, uint256 batchSize) {
        return (registered[linkedSafe], pendingBatch.length);
    }
}
