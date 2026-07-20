const { expect } = require('chai')

describe('Integration: propose -> audit commitment', function () {
  it('proposeTransfer emits event and records commitment', async function () {
    const [deployer, proposer, recipient] = await ethers.getSigners()
    const deployerAddr = await deployer.getAddress()
    const recipientAddr = await recipient.getAddress()

    const AuditRegistry = await ethers.getContractFactory('AuditRegistry')
    const audit = await AuditRegistry.deploy()
    await audit.waitForDeployment()

    const PolicyEngine = await ethers.getContractFactory('PolicyEngine')
    const policy = await PolicyEngine.deploy()
    await policy.waitForDeployment()

    const eERCAdapter = await ethers.getContractFactory('eERCAdapter')
    const adapter = await eERCAdapter.deploy()
    await adapter.waitForDeployment()

    const TreasuryManager = await ethers.getContractFactory('TreasuryManager')
    const treasury = await TreasuryManager.deploy(adapter.target)
    await treasury.waitForDeployment()

    const Sentinel = await ethers.getContractFactory('SentinelModule')
    const sentinel = await Sentinel.deploy(policy.target, treasury.target, audit.target)
    await sentinel.waitForDeployment()

    const encrypted = ethers.toUtf8Bytes('encrypted:500')

    const tx = await sentinel.proposeTransfer(recipientAddr, encrypted, ethers.toUtf8Bytes('meta'))
    const rcpt = await tx.wait()
    const events = await sentinel.queryFilter(sentinel.filters.TransferProposed(), rcpt.blockNumber, rcpt.blockNumber)
    const ev = events[0]
    expect(ev).to.not.equal(undefined)

    const id = ev.args[3]
    const stored = await audit.commitments(id)
    expect(stored.proposer).to.equal(deployerAddr)
    expect(stored.encryptedHash).to.equal(ethers.keccak256(encrypted))
  })
})
