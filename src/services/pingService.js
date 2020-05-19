const logger = require('../utils/logger')
const { updatePingCount } = require('../models/ping')

const handlePing = async () => {
  logger.info('a ping received')
  const result = await updatePingCount()
  logger.info('Ping result @ pingService:', result)

  return result
}

module.exports = {
  handlePing
}