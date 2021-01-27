module.exports = [];
require('fs').readdirSync(__dirname).forEach((filename) =>
	filename==='index.js'?0:module.exports.push(require('./'+filename)));
