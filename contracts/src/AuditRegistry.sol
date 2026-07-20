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
