const logger = require('./logger')

const requestLogger = (req, _res, next) => {
  logger.info('Method:', req.method, '\t', 'Path:', req.path)
  logger.info('Body:  ', req.body)
  logger.info('------------------')
  next()
}
/*
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  }

  next()
}*/

const unknownEndpoint = (req, res) => {
  logger.info('404 from ', req.path)
  res.status(404).send( { error: '404, why are you here?' } )
}

const errorHandler = (error, _req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'id in unknown format' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError'){
    return res.status(400).json({ error: 'invalid authorization token' })
  } else if (error.code === 'SQLITE_ERROR') {
    return res.status(500).json({ error: 'database error, admin notified, sorry for inconvenience' })
  } else {
    console.log('tännekin päädytään', error)
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
  //tokenExtractor
}