const logger = require('../utils/logger')

// TODO: convert try - catch

const toJson = (data) => {
  try {
    const json = JSON.parse(data)
    return json
  } catch (e) {
    return false
  }
}

const parseLedServerMsg = (msg) => {
  if (!checkMsgType(msg)) {
    return false
  }
  // TODO: More parsing for types and contents
  return msg
}

const checkMsgType = (msg) => {
  if (Object.prototype.hasOwnProperty.call(msg, 'type') && typeof msg.type === 'string') {
    return msg
  } else {
    logger.error('invalid msg: wrong or missing type')
    return false
  }
}

const parseClientMsg = (msg) => {
  if (!checkMsgType(msg)) {
    return false
  }
  // TODO: More parsing for types and contents
  return msg
}



module.exports = {
  toJson,
  parseLedServerMsg,
  parseClientMsg
}