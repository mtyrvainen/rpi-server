const parser = require('../utils/parser')
const logger = require('../utils/logger')
const state = require('../state')
const ledService = require('./ledService')

const handleClientMessage = (msg) => {
  const jsonMsg = parser.toJson(msg)

  if (!jsonMsg) {
    logger.error('led-socket message not valid JSON, discarded')
    return
  }

  const parsedMsg = parser.parseClientMsg(jsonMsg)

  if (!parsedMsg) {
    logger.info('client-socket message not valid, discarded')
  } else {
    switch(parsedMsg.type) {
    case 'ledSingleClick':
      logger.info(`a client has clicked ${parsedMsg.color} button`, parsedMsg)
      state.handleSingleClick(parsedMsg)
      break
    case 'ledQueue':
      logger.info('a client has sent a new LED queue')
      state.addLedQueueItem(parsedMsg)
      break
    default:
      logger.error('Message type not recognized, discarded')
      break
    }
  }
}

const initializeClientData = async (ws) => {
  logger.info('queue for initial: ', state.serverState.ledQueue)
  const clicks = await ledService.getLedData()
  const uptime = await ledService.getUptime()
  console.log('uptime', uptime)
  ws.send(JSON.stringify({
    type: 'clientInitialData',
    queue: state.serverState.ledQueue,
    // TODO: currently running queue item
    redButton: state.serverState.buttonStatus.redButtonEnabled,
    greenButton: state.serverState.buttonStatus.greenButtonEnabled,
    blueButton: state.serverState.buttonStatus.blueButtonEnabled,
    queueConstraints: state.serverState.queueConstraints,
    queueBuilderDisabled: state.serverState.isQueueBuilderDisabled,
    buttonTimeout: state.serverState.buttonTimeOut,
    clickAmounts: clicks,
    serverUptime: uptime.replace(' ago', '')
  }))
}

module.exports = {
  handleClientMessage,
  initializeClientData
}
