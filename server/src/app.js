const express = require('express')
const bodyParser = require('body-parser')
const { handlePull, handlePush } = require('./db/syncController')


const app = express()
app.use(bodyParser.json())

app.get('/sync/pull', (req, res) => {
  console.log("🚀 Incoming GET /sync/pull")
  handlePull(req, res)
})

app.post('/sync/push', (req, res) => {
  console.log("🚀 Incoming POST /sync/push")
  handlePush(req, res)
})




const PORT = 4000  // 🚨 changed from 3000 → 4000
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Sync server listening on ${PORT}`)
})
