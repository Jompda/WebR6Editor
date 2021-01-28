
module.exports = [];
module.exports.getroomfile = require('./getroomfile');
module.exports.live_sse = require('./live-sse');
module.exports.saveslide = require('./saveslide');

module.exports.push(module.exports.getroomfile, module.exports.live_sse, module.exports.saveslide);
