const express = require('express')
const ledService = require('../services/ledService')
const logger = require('../utils/logger')

const ledRouter = express.Router()

ledRouter.get('/', async (_req, res) => {
  const ledData = await ledService.getLedData()
  res.json(ledData)
})

ledRouter.post('/single', async (req, res) => {
  logger.info('Post a single click')
  // TODO: VERIFY  POST DATA
  const updatedClickData = await ledService.handleSingleClick(req.body)
  res.json(updatedClickData)
})

ledRouter.post('/queue', async (req, res) => {
  logger.info('Post a queue')
  // TODO: VERIFY POST DATA
  ledService.handleQueueEntry(req.body)
  res.json({ queue: 'accepted / rejected' })
})


module.exports = ledRouter