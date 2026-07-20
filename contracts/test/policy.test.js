const { expect } = require('chai')

describe('PolicyEngine', function () {
  it('sets and records policy and settlements', async function () {
    const [deployer, user] = await ethers.getSigners()

    const PolicyEngine = await ethers.getContractFactory('PolicyEngine')
    const policy = await PolicyEngine.deploy()
    await policy.deployed()

    // set a policy for user
    const cap = ethers.BigNumber.from('1000')
    const window = 3600
    await expect(policy.setPolicy(user.address, cap, window)).to.emit(policy, 'PolicyUpdated')

    const stored = await policy.policies(user.address)
    expect(stored[0].toString()).to.equal(cap.toString())
    expect(stored[1].toNumber()).to.equal(window)

    // record a settlement and check spentInWindow increases
    await policy.recordSettlement(user.address, 100)
    const after = await policy.policies(user.address)
    expect(after[2].toString()).to.equal('100')
  })
})
