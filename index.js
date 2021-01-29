
const path = require('path')

const { cfgToObject } = require('./util')

// Load the config files.

/**@type {{port:Number,keyPath:String,certPath:String,rootDir:String,roomsDir:String}}*/
const settings = {}
cfgToObject(settings, './config.cfg')
const autoCompletes = settings.autoCompletes.split(',')
{	// Handle the config.
	settings.port = parseInt(settings.port) || 443
	settings.rootDir = path.resolve(settings.rootDir) || '.'
	settings.roomsDir = path.resolve(settings.roomsDir) || 'database/rooms'
	autoCompletes.unshift('')
	delete settings.autoCompletes
	console.log(settings)
}

module.exports = {
	settings,
	autoCompletes
}

const server = require('./server')
