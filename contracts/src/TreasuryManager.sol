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
