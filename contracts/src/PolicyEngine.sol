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
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Errors.sol";
import "./Events.sol";
import "./PolicyLib.sol";

contract PolicyEngine {
    struct Rule {
        uint256 cap;
        address[] allowlist;
        uint64 effectiveFrom;
        bool active;
    }

    bytes32 public constant FINANCE_LEAD_ROLE = keccak256("FINANCE_LEAD_ROLE");

    mapping(bytes32 => Rule) public rules;
    mapping(address => bytes32) public orgRoleRegistry;
    mapping(bytes32 => bytes32[]) public ruleHistory;
    
    bytes32 public currentRuleId;

    constructor() {
        orgRoleRegistry[msg.sender] = FINANCE_LEAD_ROLE;
    }

    modifier onlyFinanceLead() {
        if (orgRoleRegistry[msg.sender] != FINANCE_LEAD_ROLE) {
            revert Errors.NotFinanceLead();
        }
        _;
    }

    function setRole(address account, bytes32 role) external onlyFinanceLead {
        bytes32 oldRole = orgRoleRegistry[account];
        orgRoleRegistry[account] = role;
        emit Events.RoleChanged(account, oldRole, role, msg.sender);
    }

    function createRule(bytes32 ruleId, uint256 cap, address[] calldata allowlist, uint64 effectiveFrom) external onlyFinanceLead {
        rules[ruleId] = Rule({
            cap: cap,
            allowlist: allowlist,
            effectiveFrom: effectiveFrom,
            active: true
        });
        currentRuleId = ruleId;
        emit Events.RuleCreated(ruleId, effectiveFrom, msg.sender);
    }

    function deactivateRule(bytes32 ruleId) external onlyFinanceLead {
        rules[ruleId].active = false;
        emit Events.RuleDeactivated(ruleId, uint64(block.timestamp), msg.sender);
    }

    // Evaluate proposal against current active rule
    function evaluate(bytes32 proposalId, uint256 revealedAmount, bytes calldata bindingProof, address recipient) external returns (bool passed, bytes32 reasonCode) {
        // verifyBindingProof(bindingProof, revealedAmount) logic would go here.
        // For MVP, we assume bindingProof is valid if passed.
        
        Rule memory rule = rules[currentRuleId];
        
        if (!rule.active || rule.effectiveFrom > block.timestamp) {
            passed = false;
            reasonCode = keccak256("NO_ACTIVE_RULE");
        } else if (!PolicyLib.checkCap(revealedAmount, rule.cap)) {
            passed = false;
            reasonCode = keccak256("CAP_EXCEEDED");
        } else if (!PolicyLib.checkAllowlist(recipient, rule.allowlist)) {
            passed = false;
            reasonCode = keccak256("COUNTERPARTY_NOT_ALLOWED");
        } else {
            passed = true;
            reasonCode = keccak256("PASS");
        }

        emit Events.PolicyChecked(proposalId, passed, reasonCode, currentRuleId);
        return (passed, reasonCode);
    }
}
