const { expect } = require('chai')

describe('Sentinel basic smoke', function () {
  it('deploys and emits TransferProposed', async function () {
    const [deployer, other] = await ethers.getSigners()
    const otherAddr = await other.getAddress()

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

    const encrypted = ethers.toUtf8Bytes('encrypted:100')

    await expect(sentinel.proposeTransfer(otherAddr, encrypted, '0x00')).to.emit(sentinel, 'TransferProposed')
  })
})
