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

/*
const sendToClient = (msg, ws) => {
  ws.send(JSON.stringify(msg))
}*/

/* -- wrappers -- */

const sendButtonDisable = (color, socketConnections) => {
  sendToAllClients({
    type: 'disableButton',
    color: color
  }, socketConnections)
}

const sendButtonEnable = (color, socketConnections) => {
  sendToAllClients({
    type: 'enableButton',
    color: color
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

module.exports = {
  //sendToLedServer,
  //sendToAllClients,
  //sendToClient,
  sendButtonDisable,
  sendButtonEnable,
  sendNewQueueItem,
  sendProcessNextQueueItem,
  sendSingleClick
}