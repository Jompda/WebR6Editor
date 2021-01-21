
module.exports = {
	sendFile,
	resolveFile,
	roomAccess
}

const http = require('http'), https = require('https'),
	url = require('url'), path = require('path'), fs = require('fs');

const { getContentType, logHttpRequest, finishResponse } = require('./util.js');
const { keyPath, certPath, port, rootDir } = require('./settings.json');
const autocompletes = require('./autocompletes.json');
const rooms = require('./rooms.json');

const handlers = [];
fs.readdirSync('./handlers/').forEach(filename =>
	handlers.push(require('./handlers/' + filename)));


const server = https.createServer({
	key: fs.readFileSync(keyPath),
	cert: fs.readFileSync(certPath)
}, function (request, response) {

	// Try to find a suitable handler.
	for (let i = 0; i < handlers.length; i++)
		if (handlers[i].condition(request))
			return handlers[i].handle(request, response);

	// Default
	switch (request.method) {
		case 'GET': get(request, response); break;
		default:
			response.writeHead(501);
			response.end();
			logHttpRequest(request, response);
			break;
	}
});

server.listen(port, '0.0.0.0', () => {
	const serverAddress = server.address();
	let address = serverAddress.address;
	if (serverAddress.family === 'IPv6') address = '['+address+']';
	console.log(`Serving https on ${address}:${serverAddress.port} from '${path.resolve(rootDir)}' ..`);
});



/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function get(request, response) {
	resolveFile(rootDir + url.parse(request.url).pathname, (resolvedFile, stat) => {
		if (resolvedFile) return sendFile(resolvedFile, stat, request, response);
		finishResponse({ statusCode: 404 }, request, response);
	});
}

/**
 * 
 * @param {String} filepath 
 * @param {fs.Stats} stat 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function sendFile(filepath, stat, request, response) {
	const stream = fs.createReadStream(filepath);
	stream.on('open', () => {
		response.writeHead(200, {
			'Content-Type': getContentType(filepath),
			'Content-Length': stat.size
		});
		stream.pipe(response);
	});
	stream.on('end', () => {
		response.end();
		logHttpRequest(request, response, filepath);
	});
	stream.on('error', (err) => {
		console.error('Internal Server Error!', err);
		finishResponse({ statusCode: 500 }, request, response);
	});
}

/**
 * @param {String} pathname 
 * @param {Function} callback 
 */
function resolveFile(pathname, callback) {
	let i = 0; loop();
	function loop() {
		if (i >= autocompletes.length) return callback();
		const temp = pathname + autocompletes[i++]
		fs.stat(temp, (err, result) => {
			if (err || result.isDirectory()) return loop();
			callback(temp, result);
		});
	}
}

/**
 * @param {String} roomName 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 * @returns {Room|false}
 */
function roomAccess(roomName, request, response) {
	const room = rooms.find((room) => room.name === roomName);
	if (!room || !request.headers.authorization) return false;

	const basicAuth = request.headers.authorization.slice('basic '.length);
	const password = Buffer.from(basicAuth, 'base64').toString();

	return password === room.password ? room : false;
}
