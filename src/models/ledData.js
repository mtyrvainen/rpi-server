const config = require('../config')
const sqlite3 = require('sqlite3').verbose()
const sqlite = require('sqlite')
const logger = require('../utils/logger')

const openDb = async (dbName) => {
  try {
    const db = await sqlite.open({
      filename: dbName,
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

const getServerStartTime = async() => {
  const db = await openDb(config.SQLITE_DB)

  const uptime = db.get(`SELECT server_start as uptime
    FROM clicks`)
  closeDb(db)
  return uptime
}

const getLedClicks = async () => {
  const db = await openDb(config.SQLITE_DB)

  const ledResult = db.get(`SELECT red_clicks as redClicks,
    blue_clicks as blueClicks,
    green_clicks as greenClicks
    FROM clicks`)
  closeDb(db)
  return ledResult
}

const updateSingleClicks = async (clickData) => {
  const db = await openDb(config.SQLITE_DB)

  let color
  switch(clickData.color) {
  case 'r':
    color = 'red_clicks'
    break
  case 'g':
    color = 'green_clicks'
    break
  case 'b':
    color = 'blue_clicks'
    break
  }

  const updateResult = await db.run(
    `UPDATE clicks SET ${color} = ${color} + 1`
  )

  logger.info('DB opened, handling single click now:', updateResult)
  const updatedClicks = await db.get(
    `SELECT red_clicks as redClicks,
      blue_clicks as blueClicks,
      green_clicks as greenClicks
      FROM clicks`
  )

  closeDb(db)
  return updatedClicks
}

const initializeClickData = async () => {
  const db = await openDb(config.SQLITE_DB)

  const updateResult = await db.run(
    `UPDATE clicks SET red_clicks = 0,
      blue_clicks = 0,
      green_clicks = 0,
      server_start = CURRENT_TIMESTAMP`
  )

  closeDb(db)
  return updateResult
}

module.exports = {
  getLedClicks,
  updateSingleClicks,
  initializeClickData,
  getServerStartTime
}