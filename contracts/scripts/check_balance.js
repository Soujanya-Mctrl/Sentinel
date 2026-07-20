require('dotenv').config()
const hre = require('hardhat')

async function main() {
  const pk = process.env.DEPLOYER_PRIVATE_KEY
  if (!pk) {
    console.error('DEPLOYER_PRIVATE_KEY not set in .env')
    process.exit(1)
  }
  const wallet = new hre.ethers.Wallet(pk)
  const provider = hre.ethers.provider
  const address = wallet.address
  const balance = await provider.getBalance(address)
  console.log('Deployer address:', address)
  console.log('Balance (wei):', balance.toString())
  console.log('Balance (AVAX):', hre.ethers.utils.formatEther(balance))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
