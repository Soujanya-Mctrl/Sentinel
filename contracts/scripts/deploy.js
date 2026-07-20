const hre = require('hardhat')

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  console.log('Deploying contracts with', deployer.address)

  const AuditRegistry = await hre.ethers.getContractFactory('AuditRegistry')
  const audit = await AuditRegistry.deploy()
  await audit.deployed()
  console.log('AuditRegistry:', audit.address)

  const PolicyEngine = await hre.ethers.getContractFactory('PolicyEngine')
  const policy = await PolicyEngine.deploy()
  await policy.deployed()
  console.log('PolicyEngine:', policy.address)

  const eERCAdapter = await hre.ethers.getContractFactory('eERCAdapter')
  const adapter = await eERCAdapter.deploy()
  await adapter.deployed()
  console.log('eERCAdapter:', adapter.address)

  const TreasuryManager = await hre.ethers.getContractFactory('TreasuryManager')
  const treasury = await TreasuryManager.deploy(adapter.address)
  await treasury.deployed()
  console.log('TreasuryManager:', treasury.address)

  const Sentinel = await hre.ethers.getContractFactory('SentinelModule')
  const sentinel = await Sentinel.deploy(policy.address, treasury.address, audit.address)
  await sentinel.deployed()
  console.log('SentinelModule:', sentinel.address)

  console.log('\nDeployed all contracts successfully')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
