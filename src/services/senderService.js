const logger = require('../utils/logger')

const sendToLedServer = (msg, socketConnections) => {
  logger.info('Sending to server', msg)
  socketConnections.ledServer.send(JSON.stringify(msg))
}

const sendToAllClients = (msg, socketConnections) => {
  logger.info('Sending to clients', msg)

  if (socketConnections.clients && socketConnections.clients.length > 0) {
    socketConnections.clients.filter((socket) => {
      return socket.route === '/client-socket'
    }).forEach(function (client) {
      client.send(JSON.stringify(msg))
    })
  }
}

const sendButtonDisable = (color, socketConnections, timeOut=0) => {
  sendToAllClients({
    type: 'disableButton',
    color: color,
    timeOut
  }, socketConnections)
}

const sendButtonEnable = (color, socketConnections, timeBetweenExecutions=0) => {
  sendToAllClients({
    type: 'enableButton',
    color: color,
    timeBetweenExecutions: timeBetweenExecutions
  }, socketConnections)
}

const sendNewQueueItem = (queueItem, socketConnections) => {
  sendToAllClients({
    type: 'newQueueItem',
    queueItem: queueItem
  }, socketConnections)
}

const sendProcessNextQueueItem = (queueItem, socketConnections) => {
  sendToLedServer(
    {
      type: 'nextQueueItem',
      queueItem: queueItem
    },
    socketConnections)

  sendToAllClients(
    {
      type: 'processNextInQueue',
      queueItem: queueItem
    },
    socketConnections)
}

const sendSingleClick = (singleClickData, socketConnections) => {
  sendToLedServer(
    {
      type: 'singleClickData',
      singleClickData: singleClickData
    },
    socketConnections)
}

const sendDisableQueueBuilder = (socketConnections) => {
  sendToAllClients(
    {
      type: 'disableQueueBuilder'
    },
    socketConnections
  )
}

const sendEnableQueueBuilder = (socketConnections) => {
  sendToAllClients(
    {
      type: 'enableQueueBuilder'
    },
    socketConnections
  )
}

const sendClickAmounts = (clickData, socketConnections) => {
  sendToAllClients(
    {
      type: 'singleClickAmounts',
      clickData: clickData
    },
    socketConnections
  )
}

const sendConnectedClientsAmount = (socketConnections) => {
  sendToAllClients(
    {
      type: 'connectedClientsAmount',
      connectedClients: socketConnections.clients.length
    },
    socketConnections
  )
}


module.exports = {
  sendButtonDisable,
  sendButtonEnable,
  sendNewQueueItem,
  sendProcessNextQueueItem,
  sendSingleClick,
  sendDisableQueueBuilder,
  sendEnableQueueBuilder,
  sendClickAmounts,
  sendConnectedClientsAmount
}