// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AuditRegistry {
    struct Commitment {
        address proposer;
        bytes32 encryptedHash;
        bytes metadata;
        uint256 timestamp;
    }

    mapping(bytes32 => Commitment) public commitments;

    event CommitmentRecorded(bytes32 indexed id, address indexed proposer, bytes32 encryptedHash);

    function recordCommitment(bytes32 id, address proposer, bytes32 encryptedHash, bytes calldata metadata) external {
        commitments[id] = Commitment({proposer: proposer, encryptedHash: encryptedHash, metadata: metadata, timestamp: block.timestamp});
        emit CommitmentRecorded(id, proposer, encryptedHash);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Events.sol";
import "./Errors.sol";

contract AuditRegistry {
    bytes32 public keyCommitment;
    uint256 public eventCount;

    function setKeyCommitment(bytes32 _commitment) external {
        require(keyCommitment == bytes32(0), "Key commitment already set");
        keyCommitment = _commitment;
        emit Events.AuditKeyCommitmentSet(_commitment, block.timestamp);
        eventCount++;
    }

    function logRejection(bytes32 proposalId, bytes32 reasonCode) external {
        emit Events.TransferRejected(proposalId, reasonCode, block.timestamp);
        eventCount++;
    }

    function logSettlement(bytes32 batchId, bytes32[] calldata proposalIds, bytes32 settlementTxHash) external {
        emit Events.BatchSettled(batchId, proposalIds, settlementTxHash, block.timestamp);
        eventCount++;
    }
}
