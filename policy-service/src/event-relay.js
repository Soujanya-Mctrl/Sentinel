require('dotenv').config()
const { ethers } = require('ethers')
const axios = require('axios')

const RPC_URL = process.env.RPC_URL || 'http://localhost:8545'
const POLICY_URL = process.env.POLICY_SERVICE_URL || 'http://localhost:4000/api/proposals'
const CONTRACT_ADDRESS = process.env.SENTINEL_ADDRESS || ''

if (!CONTRACT_ADDRESS) console.warn('SENTINEL_ADDRESS not set; listening for all logs')

// Minimal ABI with TransferProposed event — adjust fields to match on-chain contract
const ABI = [
  'event TransferProposed(bytes32 indexed commitmentId, address indexed proposer, address indexed to, uint256 encryptedAmount, bytes metadata)'
]

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const iface = new ethers.Interface(ABI)
  provider.on({ address: CONTRACT_ADDRESS || undefined }, async (log) => {
    try {
      const parsed = iface.parseLog(log)
      if (parsed && parsed.name === 'TransferProposed') {
        const args = parsed.args
        const body = {
          proposer: args.proposer,
          to: args.to,
          encryptedAmount: args.encryptedAmount ? args.encryptedAmount.toString() : null,
          metadata: args.metadata ? ethers.getBytes(args.metadata) : null,
          commitmentId: args.commitmentId ? args.commitmentId : null,
        }

        console.log('Relaying proposal to policy service', body)
        await axios.post(POLICY_URL, body, { timeout: 5000 })
      }
    } catch (err) {
      // ignore non-matching logs
    }
  })

  console.log('Event relay listening on', RPC_URL)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
