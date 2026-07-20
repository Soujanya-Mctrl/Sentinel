// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PolicyEngine.sol";
import "./TreasuryManager.sol";
import "./AuditRegistry.sol";

/// @notice Minimal Sentinel module skeleton for demo and integration
contract SentinelModule {
    PolicyEngine public policyEngine;
    TreasuryManager public treasury;
    AuditRegistry public audit;

    event TransferProposed(address indexed proposer, address indexed to, bytes encryptedAmount, bytes32 proposalId);

    constructor(address _policy, address _treasury, address _audit) {
        policyEngine = PolicyEngine(_policy);
        treasury = TreasuryManager(_treasury);
        audit = AuditRegistry(_audit);
    }

    /// @notice Propose a transfer with encrypted amount payload. Emits event consumed by off-chain Policy Service.
    function proposeTransfer(address to, bytes calldata encryptedAmount, bytes calldata metadata) external returns (bytes32) {
        // create a proposal id
        bytes32 id = keccak256(abi.encodePacked(msg.sender, to, encryptedAmount, block.timestamp));

        // emit event for backend to pick up (policy checks happen off-chain against scoped view key)
        emit TransferProposed(msg.sender, to, encryptedAmount, id);

        // store audit commitment (on-chain minimal commitment)
        audit.recordCommitment(id, msg.sender, keccak256(encryptedAmount), metadata);

        return id;
    }
}
