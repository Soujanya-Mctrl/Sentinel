const hre = require('hardhat')

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  console.log('Deploying contracts with', deployer.address)

  const audit = await hre.ethers.deployContract('AuditRegistry', [])
  await audit.waitForDeployment()
  const auditAddress = await audit.getAddress()
  console.log('AuditRegistry:', auditAddress)

  const policy = await hre.ethers.deployContract('PolicyEngine', [])
  await policy.waitForDeployment()
  const policyAddress = await policy.getAddress()
  console.log('PolicyEngine:', policyAddress)

  const adapter = await hre.ethers.deployContract('eERCAdapter', [])
  await adapter.waitForDeployment()
  const adapterAddress = await adapter.getAddress()
  console.log('eERCAdapter:', adapterAddress)

  const treasury = await hre.ethers.deployContract('TreasuryManager', [adapterAddress])
  await treasury.waitForDeployment()
  const treasuryAddress = await treasury.getAddress()
  console.log('TreasuryManager:', treasuryAddress)

  const sentinel = await hre.ethers.deployContract('SentinelModule', [policyAddress, treasuryAddress, auditAddress])
  await sentinel.waitForDeployment()
  const sentinelAddress = await sentinel.getAddress()
  console.log('SentinelModule:', sentinelAddress)

  console.log('\nDeployed all contracts successfully')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
