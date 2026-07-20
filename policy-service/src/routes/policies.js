const express = require('express')
const router = express.Router()
const prisma = require('../db')

// Create or update a policy
router.post('/', async (req, res) => {
  try {
    const { subject, cap, windowSecs } = req.body
    const upsert = await prisma.policy.upsert({
      where: { subject },
      update: { cap: cap.toString(), windowSecs },
      create: { subject, cap: cap.toString(), windowSecs },
    })
    res.json(upsert)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:subject', async (req, res) => {
  try {
    const p = await prisma.policy.findUnique({ where: { subject: req.params.subject } })
    if (!p) return res.status(404).json({ error: 'not found' })
    res.json(p)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
