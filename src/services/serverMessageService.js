const config = require('../config')
const parser = require('../utils/parser')
const logger = require('../utils/logger')
const state = require('../state')

const handleServerMessage = (msg) => {
  const jsonMsg = parser.toJson(msg)

  if (!jsonMsg) {
    logger.error('led-socket message not valid JSON, discarded')
    return
  }

  const parsedMsg = parser.parseLedServerMsg(jsonMsg)

  if (!parsedMsg) {
    logger.info('led-socket message not valid, discarded')
  } else {
    switch(parsedMsg.type) {
    case 'requestNextInQueue':
      logger.info('python is requesting a new queue item', parsedMsg)
      state.processNextInQueue()
      break
    case 'executionStarted':
      logger.info('queue execution started, disabling clicks', parsedMsg)
      state.startExecutionRunning()
      break
    case 'executionStopped':
      logger.info('queue execution stopped, enabling clicks', parsedMsg)
      state.stopExecutionRunning()
      break
    default:
      logger.error('Message type not recognized, discarded')
      break
    }
  }
}

const initializeServerData = (ws) => {
  ws.send(
    JSON.stringify(
      {
        type: 'serverInitialValues',
        maxQueueLength: config.LED_QUEUE_MAX_LENGTH,
        maxLedsPerQueue: config.MAX_LEDS_PER_QUEUE_ITEM,
        maxTimePerLed: config.MAX_TIME_ALLOWED_PER_LED,
        minTimePerLed: config.MIN_TIME_ALLOWED_PER_LED,
        timeBetweenExecutions: config.TIME_BETWEEN_QUEUE_EXECUTIONS
      }
    ))
}

module.exports = {
  handleServerMessage,
  initializeServerData
}