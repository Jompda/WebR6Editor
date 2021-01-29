
const http = require('http'), https = require('https')
const url = require('url'), path = require('path'), fs = require('fs')

const { getContentType, logHttpRequest, finishResponse } = require('./util')
const { settings, autoCompletes } = require('.')

module.exports = {
	sendFile,
	resolveFile
}

const { RoomManager } = require('./database')
const handlers = require('./handlers')


const httpsServer = https.createServer({
	key: fs.readFileSync(settings.keyPath),
	cert: fs.readFileSync(settings.certPath)
}, function handleHttpRequest(request, response) {

	// Try to find a suitable handler.
	for (let i = 0; i < handlers.length; i++)
		if (handlers[i].condition(request))
			return handlers[i].handle(request, response)

	// Default
	switch (request.method) {
		case 'GET': get(request, response); break
		default:
			response.writeHead(501).end()
			logHttpRequest(request, response)
			break
	}
})

httpsServer.listen(settings.port, '0.0.0.0', () => {
	const serverAddress = httpsServer.address()
	const address = serverAddress.family !== 'IPv6' ? serverAddress.address : '['+serverAddress.address+']'
	console.log(`Serving https on ${address}:${serverAddress.port} from '${path.resolve(settings.rootDir)}' ..`)
})



/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function get(request, response) {
	resolveFile(path.join(settings.rootDir, url.parse(request.url).pathname), (resolvedFile, stat) =>
		resolvedFile ? sendFile(resolvedFile, stat, request, response)
			: finishResponse({ statusCode: 404 }, request, response)
	)
}

/**
 * 
 * @param {String} filepath 
 * @param {fs.Stats} stat 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function sendFile(filepath, stat, request, response) {
	const stream = fs.createReadStream(filepath)
	stream.on('open', () => 
		stream.pipe(response.writeHead(200, {
			'Content-Type': getContentType(filepath),
			'Content-Length': stat.size
		}))
	)
	stream.on('end', () => {
		response.end()
		logHttpRequest(request, response, filepath)
	})
	stream.on('error', (err) => {
		console.error('Internal Server Error!', err)
		finishResponse({ statusCode: 500 }, request, response)
	})
}

/**
 * @param {String} pathname 
 * @param {Function} callback 
 */
function resolveFile(pathname, callback) {
	let i = 0; loop()
	function loop() {
		if (i >= autoCompletes.length) return callback()
		const temp = path.join(pathname, autoCompletes[i++])
		fs.stat(temp, (err, result) =>
			err || result.isDirectory() ? loop() : callback(temp, result)
		)
	}
}
