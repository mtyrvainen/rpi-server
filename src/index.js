const config = require('./config')
const express = require('express')
require('express-async-errors')

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const pingRouter = require('./routes/ping')
const ledRouter = require('./routes/led')

const ledService = require('./services/ledService')
//const cors = require('cors')

const app = express()
app.use(express.json())
//app.use(cors())
app.use(middleware.requestLogger)

// eslint-disable-next-line no-unused-vars
const expressWs = require('express-ws')(app)
const aWss = expressWs.getWss('/')

app.use('/api/ping', pingRouter)
app.use('/api/led', ledRouter)
app.use('/', express.static('public'))

// eslint-disable-next-line no-unused-vars
app.ws('/echo', (ws, _req) => {
  ws.on('message', (msg) => {
    logger.info('Websocket msg received: ', msg)
    ws.send(String(msg).toUpperCase())

    aWss.clients.forEach(client => {
      client.send(msg)
    })
  })
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = config.PORT

// TODO: For Dev REMOVE
if (process.env.NODE_ENV === 'dev') {
  logger.info('Because in dev, set interval for LED queue purging')
  setInterval(() => {
    ledService.removeFirstItemFromQueue()
  }, 10000)
}

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})