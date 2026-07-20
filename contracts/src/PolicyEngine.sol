// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PolicyEngine {
    struct Policy {
        uint256 cap; // max amount (units defined off-chain)
        uint256 windowSeconds;
        uint256 spentInWindow;
        uint256 windowStart;
    }

    mapping(address => Policy) public policies; // by Safe/module address

    event PolicyUpdated(address indexed subject, uint256 cap, uint256 windowSeconds);

    function setPolicy(address subject, uint256 cap, uint256 windowSeconds) external {
        policies[subject].cap = cap;
        policies[subject].windowSeconds = windowSeconds;
        policies[subject].windowStart = block.timestamp;
        policies[subject].spentInWindow = 0;
        emit PolicyUpdated(subject, cap, windowSeconds);
    }

    /// @notice Called by off-chain service to record a settlement amount (in atomic units aligned off-chain)
    function recordSettlement(address subject, uint256 amount) external {
        Policy storage p = policies[subject];
        if (block.timestamp > p.windowStart + p.windowSeconds) {
            p.windowStart = block.timestamp;
            p.spentInWindow = 0;
        }
        p.spentInWindow += amount;
    }

    /// @notice Simple check helper used by off-chain policy service for reference (not authoritative)
    function checkCap(address subject, uint256 amount) external view returns (bool) {
        Policy storage p = policies[subject];
        if (p.cap == 0) return true;
        uint256 spent = p.spentInWindow;
        return (spent + amount) <= p.cap;
    }
}
