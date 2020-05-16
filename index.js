const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const PORT = 3001

app.get('/api/ping', (_req, res) => {
  console.log('a ping received')
  res.send('pong')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})