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

const getLedClicks = async () => {
  const db = await openDb()

  const ledResult = db.get(`SELECT red_clicks as redClicks,
    blue_clicks as blueClicks,
    green_clicks as greenClicks
    FROM clicks`)
  closeDb(db)
  return ledResult
}

const updateSingleClicks = async (clickData) => {
  const db = await openDb()

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

module.exports = {
  getLedClicks,
  updateSingleClicks
}