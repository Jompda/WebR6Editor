
const path = require('path')

const { cfgToObject } = require('./util')

// Load the config files.

/**@type {{port:Number,keyPath:String,certPath:String,rootDir:String,roomsDir:String}}*/
const settings = module.exports.settings = {}
cfgToObject(settings, './config.cfg')
const autoCompletes = module.exports.autoCompletes = settings.autoCompletes.split(',')
{	// Handle the config.
	settings.port = parseInt(settings.port) || 443
	settings.rootDir = path.resolve(settings.rootDir) || '.'
	settings.roomsDir = path.resolve(settings.roomsDir) || 'database/rooms'
	autoCompletes.unshift('')
	delete settings.autoCompletes
	console.log(settings)
}

module.exports.mimeTypes = {}
cfgToObject(module.exports.mimeTypes, './mimetypes.cfg')

const server = require('./server')
