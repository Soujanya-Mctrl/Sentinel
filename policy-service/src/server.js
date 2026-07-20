require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const prisma = require('./db')

const policies = require('./routes/policies')
const proposals = require('./routes/proposals')

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())

app.use('/api/policies', policies)
app.use('/api/proposals', proposals)

app.get('/health', (req, res) => res.json({ ok: true }))

app.listen(port, () => {
  console.log(`Policy service listening on ${port}`)
})

process.on('SIGINT', async () => {
  console.log('Shutting down...')
  await prisma.$disconnect()
  process.exit(0)
})
