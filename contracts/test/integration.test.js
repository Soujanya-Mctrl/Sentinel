const { expect } = require('chai')

describe('Integration: propose -> audit commitment', function () {
  it('proposeTransfer emits event and records commitment', async function () {
    const [deployer, proposer, recipient] = await ethers.getSigners()

    const AuditRegistry = await ethers.getContractFactory('AuditRegistry')
    const audit = await AuditRegistry.deploy()
    await audit.deployed()

    const PolicyEngine = await ethers.getContractFactory('PolicyEngine')
    const policy = await PolicyEngine.deploy()
    await policy.deployed()

    const eERCAdapter = await ethers.getContractFactory('eERCAdapter')
    const adapter = await eERCAdapter.deploy()
    await adapter.deployed()

    const TreasuryManager = await ethers.getContractFactory('TreasuryManager')
    const treasury = await TreasuryManager.deploy(adapter.address)
    await treasury.deployed()

    const Sentinel = await ethers.getContractFactory('SentinelModule')
    const sentinel = await Sentinel.deploy(policy.address, treasury.address, audit.address)
    await sentinel.deployed()

    const encrypted = ethers.utils.toUtf8Bytes('encrypted:500')

    const tx = await sentinel.proposeTransfer(recipient.address, encrypted, ethers.utils.toUtf8Bytes('meta'))
    const rcpt = await tx.wait()
    const ev = rcpt.events.find((e) => e.event === 'TransferProposed')
    expect(ev).to.not.equal(undefined)

    const id = ev.args[3]
    const stored = await audit.commitments(id)
    expect(stored.proposer).to.equal(deployer.address)
    expect(stored.encryptedHash).to.equal(ethers.utils.keccak256(encrypted))
  })
})
