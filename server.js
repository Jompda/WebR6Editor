
const http = require('http'), https = require('https')
const url = require('url'), path = require('path'), fs = require('fs')

const { logHttpRequest, finishResponse } = require('./util')
const { settings, autoCompletes, mimeTypes } = require('.')

module.exports = {
	sendContent,
	sendFile,
	sendStream,
	resolveFile,
	getContentType
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
	resolveFile(path.join(settings.rootDir, url.parse(request.url).pathname))
		.then((filename, stat) => sendFile(filename, stat, request, response))
		.catch(() => finishResponse({ statusCode: 404 }, request, response))
}

/**
 * @param {string} string 
 * @param {string} mimetype 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function sendContent(string, mimetype, request, response) {
	response.writeHead(200, {
		'Content-Type': mimetype,
		'Content-Length': string.length
	}).end(string)
	logHttpRequest(request, response)
}

/**
 * @param {string} filepath 
 * @param {fs.Stats} stat 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function sendFile(filepath, stat, request, response) {
	sendStream(fs.createReadStream(filepath), getContentType(filepath), request, response).on('end', () =>
		logHttpRequest(request, response, filepath)
	)
}

/**
 * @param {fs.ReadStream} stream 
 * @param {string} mimetype 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function sendStream(stream, mimetype, request, response) {
	stream.on('open', () => 
		stream.pipe(response.writeHead(200, {
			'Content-Type': mimetype
		}))
	)
	stream.on('end', () => response.end())
	stream.on('error', (err) => {
		console.error('Internal Server Error!', err)
		finishResponse({ statusCode: 500 }, request, response)
	})
	return stream;
}

/**
 * @param {string} pathname 
 * @param {Function} callback 
 * @returns {Promise<string, fs.Stats>}
 */
function resolveFile(pathname) {
	return new Promise((resolve, reject) => {
		let i = 0; loop()
		function loop() {
			if (i >= autoCompletes.length) return reject()
			const filename = path.join(pathname, autoCompletes[i++])
			fs.stat(filename, (err, stats) =>
				err || stats.isDirectory() ? loop() : resolve(filename, stats)
			)
		}
	})
}

/**
 * @param {string} pathname 
 * @returns {string}
 */
function getContentType(pathname) {
	return mimeTypes[pathname.slice(pathname.lastIndexOf('.')+1)] || 'text/plain'
}
