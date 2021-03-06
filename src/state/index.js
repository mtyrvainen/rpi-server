const config = require('../config')
const logger = require('../utils/logger')
const {
  sendButtonDisable,
  sendButtonEnable,
  sendNewQueueItem,
  sendProcessNextQueueItem,
  sendSingleClick,
  sendDisableQueueBuilder,
  sendEnableQueueBuilder,
  sendClickAmounts,
  sendConnectedClientsAmount
} = require('../services/senderService')
const ledService = require('../services/ledService')

const serverState = {
  isExecutionRunning: false,
  isServerReady: false,
  queueConstraints: {
    maxQueueLength: config.LED_QUEUE_MAX_LENGTH,
    maxLedsPerQueue: config.MAX_LEDS_PER_QUEUE_ITEM,
    maxTimePerLed: config.MAX_TIME_ALLOWED_PER_LED,
    minTimePerLed: config.MIN_TIME_ALLOWED_PER_LED,
    timeBetweenExecutions: config.TIME_BETWEEN_QUEUE_EXECUTIONS
  },
  ledQueue: [],
  buttonTimeOut: config.BUTTON_TIMEOUT,
  isQueueBuilderDisabled: false,
  buttonStatus: {
    redButtonEnabled: true,
    greenButtonEnabled: true,
    blueButtonEnabled: true,
  },
  socketConnections: {
    ledServer: null,
    clients: null,
  }
}

const addLedQueueItem = (queueItem) => {
  if (serverState.ledQueue.length < serverState.queueConstraints.maxQueueLength) {
    serverState.ledQueue.push(queueItem)
    sendNewQueueItem(queueItem, serverState.socketConnections)
    if (serverState.ledQueue.length === serverState.queueConstraints.maxQueueLength) {
      serverState.isQueueBuilderDisabled = true
      sendDisableQueueBuilder(serverState.socketConnections)
    }

    if (serverState.ledQueue.length === 1 && !serverState.isExecutionRunning && serverState.isServerReady) {
      processNextInQueue()
    }
  } else {
    logger.error('led queue already full, discarding new item')
  }
}

const getFirstLedQueueItem = () => {
  if (serverState.ledQueue.length > 0) {
    if (serverState.isQueueBuilderDisabled) {
      serverState.isQueueBuilderDisabled = false
      sendEnableQueueBuilder(serverState.socketConnections)
    }

    return serverState.ledQueue.shift()
  } else {
    return null
  }
}

const handleSingleClick = async (singleClickData) => {
  switch(singleClickData.color) {
  case 'r':
    if (serverState.buttonStatus.redButtonEnabled) {
      disableButton(singleClickData.color)
      sendSingleClick(singleClickData, serverState.socketConnections)
      const updatedClickAmounts = await ledService.logSingleClicks(singleClickData)
      sendClickAmounts(updatedClickAmounts, serverState.socketConnections)
    }
    break
  case 'g':
    if (serverState.buttonStatus.greenButtonEnabled) {
      disableButton(singleClickData.color)
      sendSingleClick(singleClickData, serverState.socketConnections)
      const updatedClickAmounts = await ledService.logSingleClicks(singleClickData)
      sendClickAmounts(updatedClickAmounts, serverState.socketConnections)
    }
    break
  case 'b':
    if (serverState.buttonStatus.blueButtonEnabled) {
      disableButton(singleClickData.color)
      sendSingleClick(singleClickData, serverState.socketConnections)
      const updatedClickAmounts = await ledService.logSingleClicks(singleClickData)
      sendClickAmounts(updatedClickAmounts, serverState.socketConnections)
    }
    break
  default:
    logger.error('wrong button color, discarded')
    break
  }
}

const disableButton = (color) => {
  switch(color) {
  case 'r':
    if (serverState.buttonStatus.redButtonEnabled) {
      serverState.buttonStatus.redButtonEnabled = false
      sendButtonDisable(color, serverState.socketConnections, serverState.buttonTimeOut)
      setTimeout(() => enableButton(color), serverState.buttonTimeOut)
    }
    break
  case 'g':
    if (serverState.buttonStatus.greenButtonEnabled) {
      serverState.buttonStatus.greenButtonEnabled = false
      sendButtonDisable(color, serverState.socketConnections, serverState.buttonTimeOut)
      setTimeout(() => enableButton(color), serverState.buttonTimeOut)
    }
    break
  case 'b':
    if (serverState.buttonStatus.blueButtonEnabled) {
      serverState.buttonStatus.blueButtonEnabled = false
      sendButtonDisable(color, serverState.socketConnections, serverState.buttonTimeOut)
      setTimeout(() => enableButton(color), serverState.buttonTimeOut)
    }
    break
  case 'all':
    serverState.buttonStatus.redButtonEnabled = false
    serverState.buttonStatus.greenButtonEnabled = false
    serverState.buttonStatus.blueButtonEnabled = false
    sendButtonDisable(color, serverState.socketConnections)
    break
  default:
    logger.error('wrong button color for disabling, ignored')
    break
  }
}

const enableButton = (color) => {
  switch(color) {
  case 'r':
    if (!serverState.isExecutionRunning) {
      serverState.buttonStatus.redButtonEnabled = true
      sendButtonEnable(color, serverState.socketConnections)
    }
    break
  case 'g':
    if (!serverState.isExecutionRunning) {
      serverState.buttonStatus.greenButtonEnabled = true
      sendButtonEnable(color, serverState.socketConnections)
    }
    break
  case 'b':
    if (!serverState.isExecutionRunning) {
      serverState.buttonStatus.blueButtonEnabled = true
      sendButtonEnable(color, serverState.socketConnections)
    }
    break
  case 'all':
    serverState.buttonStatus.redButtonEnabled = true
    serverState.buttonStatus.greenButtonEnabled = true
    serverState.buttonStatus.blueButtonEnabled = true
    sendButtonEnable(color, serverState.socketConnections, serverState.queueConstraints.timeBetweenExecutions)
    break
  default:
    logger.error('wrong button color for enabling, ignored')
    break
  }
}

const setLedServerSocket = (websocket) => {
  if (serverState.socketConnections.ledServer === null) {
    serverState.socketConnections.ledServer = websocket
    logger.info('LED socket updated')
  }
}

const setClientSockets = (clientArray) => {
  serverState.socketConnections.clients = clientArray
  logger.info('Client socket opened, currently connected: ', serverState.socketConnections.clients.length)
  sendConnectedClientsAmount(serverState.socketConnections)
}

const isLedServerRegistered = () => {
  return serverState.socketConnections.ledServer !== null
}

const removeLedServer = () => {
  return serverState.socketConnections.ledServer = null
}

const startExecutionRunning = () => {
  serverState.isExecutionRunning = true
  disableButton('all')
}

const stopExecutionRunning = () => {
  serverState.isExecutionRunning = false
  enableButton('all')
}

const processNextInQueue = () => {
  serverState.isServerReady = true
  const queueItem = getFirstLedQueueItem()

  if (queueItem) {
    console.log('item requested and queue not empty')
    serverState.isServerReady = false
    sendProcessNextQueueItem(queueItem, serverState.socketConnections)
  } else {
    logger.info('--> queue is empty, nothing to send')
  }
}

module.exports = {
  serverState,
  addLedQueueItem,
  getFirstLedQueueItem,
  disablebutton: disableButton,
  enableButton,
  setLedServerSocket,
  setClientSockets,
  isLedServerRegistered,
  removeLedServer,
  startExecutionRunning,
  stopExecutionRunning,
  processNextInQueue,
  handleSingleClick
}