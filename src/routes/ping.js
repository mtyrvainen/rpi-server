const express = require('express')
const pingService = require('../services/pingService')

const pingRouter = express.Router()

pingRouter.get('/', async (_req, res) => {
  const result = await pingService.handlePing()
  res.json({ ...result, type: 'pong' })
})

module.exports = pingRouter