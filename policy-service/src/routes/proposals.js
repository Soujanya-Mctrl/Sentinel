const express = require('express')
const router = express.Router()
const prisma = require('../db')
const { v4: uuidv4 } = require('uuid')

// Submit a proposal (called by UI or by Safe event worker)
router.post('/', async (req, res) => {
  try {
    const { proposer, to, encryptedAmount, metadata, commitmentId, encryptedHash } = req.body
    const proposalId = uuidv4()
    const created = await prisma.proposal.create({
      data: {
        proposalId,
        proposer,
        to,
        encryptedAmount,
        metadata,
        status: 'PENDING',
      },
    })

    if (commitmentId && encryptedHash) {
      await prisma.auditCommitment.create({
        data: { commitmentId, proposer, encryptedHash, metadata },
      })
    }

    res.json(created)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// List proposals (optional pagination)
router.get('/', async (req, res) => {
  try {
    const list = await prisma.proposal.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single proposal
router.get('/:proposalId', async (req, res) => {
  try {
    const p = await prisma.proposal.findUnique({ where: { proposalId: req.params.proposalId } })
    if (!p) return res.status(404).json({ error: 'not found' })
    res.json(p)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Approve or reject a proposal manually via API
router.patch('/:proposalId', async (req, res) => {
  try {
    const { action, reviewer, note } = req.body
    if (!['APPROVED', 'REJECTED'].includes(action)) return res.status(400).json({ error: 'invalid action' })

    const updated = await prisma.proposal.updateMany({
      where: { proposalId: req.params.proposalId, status: 'PENDING' },
      data: { status: action, reviewer, reviewNote: note, processedAt: new Date() },
    })

    if (updated.count === 0) return res.status(404).json({ error: 'not found or already processed' })
    res.json({ ok: true, action })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
