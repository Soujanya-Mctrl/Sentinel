const { expect } = require('chai')

describe('TreasuryManager', function () {
  it('creates batches and calls eERC adapter for encrypted transfers', async function () {
    const [deployer, other] = await ethers.getSigners()
    const otherAddr = await other.getAddress()

    const Adapter = await ethers.getContractFactory('eERCAdapter')
    const adapter = await Adapter.deploy()
    await adapter.waitForDeployment()

    const Treasury = await ethers.getContractFactory('TreasuryManager')
    const treasury = await Treasury.deploy(adapter.target)
    await treasury.waitForDeployment()

    // create batch
    const txIds = [ethers.keccak256(ethers.toUtf8Bytes('a'))]
    await expect(treasury.createBatch(txIds)).to.emit(treasury, 'BatchCreated')

    // settle encrypted transfer should call adapter.transferEncrypted and emit EncryptedTransfer
    const encrypted = ethers.toUtf8Bytes('enc:200')
    await expect(treasury.settleEncryptedTransfer(otherAddr, encrypted, '0x00')).to.emit(adapter, 'EncryptedTransfer')
  })
})
