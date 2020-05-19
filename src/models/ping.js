const config = require('../config')
const sqlite3 = require('sqlite3').verbose()
const sqlite = require('sqlite')
const logger = require('../utils/logger')

const openDb = async () => {
  try {
    const db = await sqlite.open({
      filename: config.SQLITE_DB,
      driver: sqlite3.Database
    })
    logger.info('Connected to DB:', config.SQLITE_DB)
    return db
  } catch (e) {
    logger.error('Error opening db:', e.message)
  }
}

const closeDb = async (db) => {
  try {
    await db.close()
    logger.info('DB connection closed')
  } catch (e) {
    logger.error('Error closing db', e.message)
  }
}

const updatePingCount = async () => {
  const db = await openDb()
  const updateResult = await db.run(
    'UPDATE clicks SET pings = pings + 1'
  )

  logger.info('DB opened, handling ping now:', updateResult)
  const pingResult = await db.get(
    'SELECT pings FROM clicks'
  )

  closeDb(db)
  return pingResult
}

module.exports = {
  updatePingCount
}