const config = require('./config')
const express = require('express')
require('express-async-errors')

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const pingRouter = require('./routes/ping')
const ledRouter = require('./routes/led')

const state = require('./state')
const ledService = require('./services/ledService')
const serverMessageService = require('./services/serverMessageService')
const clientMessageService = require('./services/clientMessageService')
//const cors = require('cors')

const app = express()
app.use(express.json())
//app.use(cors())
app.use(middleware.requestLogger)

// eslint-disable-next-line no-unused-vars
const expressWs = require('express-ws')(app)
const wss = expressWs.getWss()

app.use('/api/ping', pingRouter)
app.use('/api/led', ledRouter)

if (process.env.NODE_ENV === 'dev') {
  logger.info('running in dev, serving public folder')
  app.use('/', express.static('public'))
}

// eslint-disable-next-line no-unused-vars
app.ws('/client-socket', (ws, _req) => {
  ws.route = '/client-socket'
  clientMessageService.initializeClientData(ws)

  state.setClientSockets(
    Array.from(
      wss.clients
    ).filter((socket) => {
      return socket.route === '/client-socket'
    })
  )

  ws.on('message', (msg) => {
    logger.info('Client socket received: ', msg)
    clientMessageService.handleClientMessage(msg)
  })

  ws.on('close', () => {
    state.setClientSockets(
      Array.from(
        wss.clients
      ).filter((socket) => {
        return socket.route === '/client-socket'
      })
    )
  })
})

// eslint-disable-next-line no-unused-vars
app.ws('/led-socket', (ws, _req) => {
  if (state.isLedServerRegistered()) {
    ws.close()
    logger.error('LED Server already connected, connection terminated')
    return
  }

  ws.route = '/led-socket'
  state.setLedServerSocket(ws)
  serverMessageService.initializeServerData(ws)

  ws.on('message', (msg) => {
    logger.info('LED socket received: ', msg)
    serverMessageService.handleServerMessage(msg)
  })

  ws.on('close', () => {
    console.log('LED SERVER CONNECTION TERMINATED')
    state.removeLedServer()
  })
})


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const SERVER_PORT = config.SERVER_PORT

// TODO: For Dev REMOVE
if (process.env.NODE_ENV === 'devs') {
  logger.info('Because in dev, set interval for LED queue purging')
  setInterval(() => {
    ledService.removeFirstItemFromQueue()
  }, 10000)
}

app.listen(SERVER_PORT, () => {
  logger.info(`Server running on port ${SERVER_PORT}`)
})