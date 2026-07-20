// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @notice Minimal adapter interface to an eERC-like encrypted transfer contract
contract eERCAdapter {
    event EncryptedTransfer(address indexed to, bytes encryptedAmount);

    function transferEncrypted(address to, bytes calldata encryptedAmount, bytes calldata proof) external {
        // In a real integration this would call into the eERC contract API.
        emit EncryptedTransfer(to, encryptedAmount);
        // proof parameter reserved for ZK/validation data in production.
        proof; // silence unused var
    }
}
