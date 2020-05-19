const config = require('../config')
const logger = require('../utils/logger')
const { getLedClicks, updateSingleClicks } = require('../models/led')

const ledQueue = {
  maxLength: config.LED_QUEUE_MAX_LENGHT,
  maxLedsPerQueue: config.MAX_LEDS_PER_QUEUE_ITEM,
  maxTimePerLed: config.MAX_TIME_ALLOWED_PER_LED,
  queue: []
}

const removeFirstItemFromQueue = () => {
  if (ledQueue.queue.length > 0) {
    ledQueue.queue.shift()
    logger.info('Item purged from queue')
  }
}

const getLedData = async () => {
  const result = await getLedClicks()
  logger.info('LED data result @ ledService:', result)

  return result
}

const handleSingleClick = async (clickData) => {
  // TODO: LOGIC FOR CHECKING IF CLICK ALLOWED TO BE REGISTERED
  // PROBABLY IF YOU'RE HERE THE BUTTON WAS NOT DISABLED, WHEN PRESSING
  // SKIP REGISTERING CLICK, JUST RETURN CLICK DATA
  // JUST MAKE SURE IF GLOBAL BUTTON DISABLEMENT ALREADY ONGOING, DON'T MESS WITH IT
  const upDatedClickData = await updateSingleClicks(clickData)
  logger.info('Single click results @ ledService', upDatedClickData)
  return upDatedClickData
}

const handleQueueEntry = async (queueData) => {
  // TODO: LOGIC FOR CHECKING IF QUEUE IS EMPTY / FULL
  // QUEUE DATA NOT NECESSARY TO PUT INTO DB
  logger.info('LED QUEUE: ', ledQueue.queue.length)
  if (ledQueue.queue.length < ledQueue.maxLength) {
    logger.info('Room in queue --> added')
    // TODO: Check that maxTimePerLed & maLedsPerQueue not no exceeded
    ledQueue.queue.push(queueData)

    // TODO: Check if LED module / Python is idle --> if idle send item there
    // TODO: for testing purposes remove item from queue every 30s
  } else {
    logger.info('Queue full, data discarded')
  }
  logger.info('Handling the queue @ ledService', queueData)
}

module.exports = {
  getLedData,
  handleSingleClick,
  handleQueueEntry,
  removeFirstItemFromQueue
}