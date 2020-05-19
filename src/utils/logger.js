const info = ( ...params ) => {
  if (process.env.NODE_ENV === 'dev') {
    console.log( ...params )
  }
}

const error = ( ...params ) => {
  console.log( ...params )
}

module.exports = {
  info,
  error
}