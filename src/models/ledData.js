const config = require('../config')
const sqlite3 = require('sqlite3').verbose()
const sqlite = require('sqlite')
const logger = require('../utils/logger')

let dbConnection = undefined

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
  const uptime = dbConnection.get(`SELECT server_start as uptime
    FROM clicks`)

  return uptime
}

const getLedClicks = async () => {
  const ledResult = dbConnection.get(`SELECT red_clicks as redClicks,
    blue_clicks as blueClicks,
    green_clicks as greenClicks
    FROM clicks`)

  return ledResult
}

const updateSingleClicks = async (clickData) => {
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

  const updateResult = await dbConnection.run(
    `UPDATE clicks SET ${color} = ${color} + 1`
  )

  logger.info('DB opened, handling single click now:', updateResult)
  const updatedClicks = await dbConnection.get(
    `SELECT red_clicks as redClicks,
      blue_clicks as blueClicks,
      green_clicks as greenClicks
      FROM clicks`
  )

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

  dbConnection = db
  return updateResult
}

module.exports = {
  getLedClicks,
  updateSingleClicks,
  initializeClickData,
  getServerStartTime
}