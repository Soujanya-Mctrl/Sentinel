
Sentinel smart contracts (demo skeletons)

Layout:

- `src/` — Solidity source files (Hardhat expects sources here).
	- `SentinelModule.sol` — module entrypoint that emits `TransferProposed` and records audit commitments.
	- `PolicyEngine.sol` — simple on-chain policy storage helpers (cap + window) intended to be referenced by off-chain policy service.
	- `TreasuryManager.sol` — batch/settlement stubs that call `eERCAdapter`.
	- `eERCAdapter.sol` — adapter stub for encrypted-transfer contracts.
	- `AuditRegistry.sol` — on-chain commitments storage used for audit linking.

Commands:

Install dev deps (from `contracts/`):

```bash
cd contracts
npm install
```

Run tests:

```bash
cd contracts
npx hardhat test
```

Notes:

These contracts are intentionally minimal for demo and integration. Production requires:
- Access control (owner/roles) on sensitive functions
- Safe module registration flow & compatibility checks
- ZK verifier integration if using on-chain proof verification
- Comprehensive unit, integration, and security tests

