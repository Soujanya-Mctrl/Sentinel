const { expect } = require('chai')

describe('Sentinel basic smoke', function () {
  it('deploys and emits TransferProposed', async function () {
    const [deployer, other] = await ethers.getSigners()

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

    const encrypted = ethers.utils.toUtf8Bytes('encrypted:100')

    await expect(sentinel.proposeTransfer(other.address, encrypted, '0x00'))
      .to.emit(sentinel, 'TransferProposed')
  })
})
