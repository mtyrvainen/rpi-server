const logger = require('../utils/logger')
const moment = require('moment')
const { getLedClicks, getServerStartTime, updateSingleClicks, initializeClickData } = require('../models/ledData')

const getLedData = async () => {
  const result = await getLedClicks()
  logger.info('LED data result @ ledService:', result)

  return result
}

const initialize = async () => {
  const result = await initializeClickData()
  logger.info('db init result', result)
}

const logSingleClicks = async (clickData) => {
  const upDatedClickData = await updateSingleClicks(clickData)
  logger.info('Single click results @ ledService', upDatedClickData)
  return upDatedClickData
}

const getUptime = async () => {
  const result = await getServerStartTime()
  return moment(result.uptime).fromNow()
}

module.exports = {
  getLedData,
  getUptime,
  logSingleClicks,
  initialize
}