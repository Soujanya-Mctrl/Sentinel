const { expect } = require('chai')

describe('PolicyEngine', function () {
  it('sets and records policy and settlements', async function () {
    const [deployer, user] = await ethers.getSigners()
    const userAddr = await user.getAddress()

    const PolicyEngine = await ethers.getContractFactory('PolicyEngine')
    const policy = await PolicyEngine.deploy()
    await policy.waitForDeployment()

    // set a policy for user
    const cap = 1000n
    const window = 3600
    await expect(policy.setPolicy(userAddr, cap, window)).to.emit(policy, 'PolicyUpdated')

    const stored = await policy.policies(userAddr)
    expect(stored[0].toString()).to.equal(cap.toString())
    expect(Number(stored[1])).to.equal(window)

    // record a settlement and check spentInWindow increases
    await policy.recordSettlement(userAddr, 100)
    const after = await policy.policies(userAddr)
    expect(after[2].toString()).to.equal('100')
  })
})
