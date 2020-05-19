require('dotenv').config()

let PORT = process.env.PORT
let SQLITE_DB = process.env.SQLITE_DB || undefined

// LED variables:
const LED_QUEUE_MAX_LENGHT = 10
const MAX_LEDS_PER_QUEUE_ITEM = 10
const MAX_TIME_ALLOWED_PER_LED = 5000 // in milliseconds

if (process.env.NODE_ENV === 'dev') {
  PORT = 3001
  SQLITE_DB = './db/test.db'
}

module.exports = {
  PORT,
  SQLITE_DB,
  LED_QUEUE_MAX_LENGHT,
  MAX_LEDS_PER_QUEUE_ITEM,
  MAX_TIME_ALLOWED_PER_LED
}