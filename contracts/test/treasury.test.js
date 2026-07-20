const { expect } = require('chai')

describe('TreasuryManager', function () {
  it('creates batches and calls eERC adapter for encrypted transfers', async function () {
    const [deployer, other] = await ethers.getSigners()

    const Adapter = await ethers.getContractFactory('eERCAdapter')
    const adapter = await Adapter.deploy()
    await adapter.deployed()

    const Treasury = await ethers.getContractFactory('TreasuryManager')
    const treasury = await Treasury.deploy(adapter.address)
    await treasury.deployed()

    // create batch
    const txIds = [ethers.utils.keccak256(ethers.utils.toUtf8Bytes('a'))]
    await expect(treasury.createBatch(txIds)).to.emit(treasury, 'BatchCreated')

    // settle encrypted transfer should call adapter.transferEncrypted and emit EncryptedTransfer
    const encrypted = ethers.utils.toUtf8Bytes('enc:200')
    await expect(treasury.settleEncryptedTransfer(other.address, encrypted, '0x00')).to.emit(adapter, 'EncryptedTransfer')
  })
})
