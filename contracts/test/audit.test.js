const { expect } = require('chai')

describe('AuditRegistry', function () {
  it('records commitments and stores metadata', async function () {
    const [deployer, proposer] = await ethers.getSigners()
    const proposerAddr = await proposer.getAddress()

    const Audit = await ethers.getContractFactory('AuditRegistry')
    const audit = await Audit.deploy()
    await audit.waitForDeployment()

    const id = ethers.keccak256(ethers.toUtf8Bytes('commit-1'))
    const encryptedHash = ethers.keccak256(ethers.toUtf8Bytes('enc'))
    const metadata = ethers.toUtf8Bytes('reason: test')

    await expect(audit.recordCommitment(id, proposerAddr, encryptedHash, metadata)).to.emit(audit, 'CommitmentRecorded')

    const stored = await audit.commitments(id)
    expect(stored.proposer).to.equal(proposerAddr)
    expect(stored.encryptedHash).to.equal(encryptedHash)
  })
})
