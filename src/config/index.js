require('dotenv').config()

let SERVER_PORT = process.env.SERVER_PORT
let SQLITE_DB = process.env.SQLITE_DB

// LED variables:
const TIME_BETWEEN_QUEUE_EXECUTIONS = 60000 // in milliseconds
const LED_QUEUE_MAX_LENGTH = 10
const MAX_LEDS_PER_QUEUE_ITEM = 10
const MAX_TIME_ALLOWED_PER_LED = 5000 // in milliseconds
const MIN_TIME_ALLOWED_PER_LED = 100 // in milliseconds
const BUTTON_TIMEOUT = 10000 // in milliseconds

if (process.env.NODE_ENV === 'dev') {
  SERVER_PORT = 3001
  SQLITE_DB = './db/test.db'
}

module.exports = {
  SERVER_PORT,
  SQLITE_DB,
  LED_QUEUE_MAX_LENGTH,
  MAX_LEDS_PER_QUEUE_ITEM,
  MAX_TIME_ALLOWED_PER_LED,
  MIN_TIME_ALLOWED_PER_LED,
  BUTTON_TIMEOUT,
  TIME_BETWEEN_QUEUE_EXECUTIONS
}