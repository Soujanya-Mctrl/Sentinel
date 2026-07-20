const { expect } = require('chai')

describe('AuditRegistry', function () {
  it('records commitments and stores metadata', async function () {
    const [deployer, proposer] = await ethers.getSigners()

    const Audit = await ethers.getContractFactory('AuditRegistry')
    const audit = await Audit.deploy()
    await audit.deployed()

    const id = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('commit-1'))
    const encryptedHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('enc'))
    const metadata = ethers.utils.toUtf8Bytes('reason: test')

    await expect(audit.recordCommitment(id, proposer.address, encryptedHash, metadata)).to.emit(audit, 'CommitmentRecorded')

    const stored = await audit.commitments(id)
    expect(stored.proposer).to.equal(proposer.address)
    expect(stored.encryptedHash).to.equal(encryptedHash)
  })
})
