require('dotenv').config()
const prisma = require('./db')

// Simple polling worker that locks and processes one proposal at a time.
async function processOne() {
  const client = prisma
  // Try to atomically select one pending proposal and mark it processed
  // Using a transaction with SELECT ... FOR UPDATE SKIP LOCKED via $queryRaw
  try {
    const rows = await prisma.$queryRawUnsafe(`
      WITH cte AS (
        SELECT id FROM "Proposal" WHERE status = 'PENDING' ORDER BY "createdAt" ASC FOR UPDATE SKIP LOCKED LIMIT 1
      )
      UPDATE "Proposal" p SET status = 'APPROVED', "processedAt" = now() FROM cte WHERE p.id = cte.id RETURNING p.*;
    `)

    if (rows && rows.length > 0) {
      const p = rows[0]
      console.log('Processed proposal', p.proposalId)
      // Here you'd call settlement logic, e.g., call TreasuryManager via RPC or enqueue on-chain tx
      return true
    }
    return false
  } catch (err) {
    console.error('Worker error', err)
    return false
  }
}

async function loop() {
  while (true) {
    try {
      const did = await processOne()
      if (!did) {
        // sleep
        await new Promise((r) => setTimeout(r, 2000))
      }
    } catch (err) {
      console.error(err)
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
}

loop().catch((e) => {
  console.error(e)
  process.exit(1)
})
