
module.exports = []
module.exports.room = require('./room')
module.exports.live_sse = require('./live-sse')
module.exports.saveslide = require('./saveslide')

module.exports.push(module.exports.room, module.exports.live_sse, module.exports.saveslide)
