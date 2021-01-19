
module.exports = {
	sendFile,
	resolveFile,
	checkRoomAccess
}

const http = require('http'), https = require('https'),
	url = require('url'), path = require('path'), fs = require('fs');

const { getContentType, logHttpRequest } = require('./util.js');
const { key, cert, port, rootDirectory } = require('./settings.json');
const autocompletes = require('./autocompletes.json');
const rooms = require('./rooms.json');

// Temporary way of building the handler list.
const handlers = [
	require('./handlers/getscene.js'),
	require('./handlers/postscene.js'),
	require('./handlers/live-sse.js')
];


const server = https.createServer({
	key: fs.readFileSync(key),
	cert: fs.readFileSync(cert)
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
	console.log(`Serving https on ${address}:${serverAddress.port} from '${path.resolve(rootDirectory)}' ..`);
});



/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function get(request, response) {
	const parsedUrl = url.parse(request.url);

	// Default
	resolveFile(rootDirectory + parsedUrl.pathname, (resolvedFile, stat) => {
		if (!resolvedFile) {
			response.writeHead(404);
			response.end();
			return logHttpRequest(request, response);
		}
		sendFile(resolvedFile, stat, request, response);
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
	response.writeHead(200, {
		'Content-Type': getContentType(filepath),
		'Content-Length': stat.size
	});

	const stream = fs.createReadStream(filepath);
	stream.on('open', () => {
		stream.pipe(response);
	});
	stream.on('end', () => {
		logHttpRequest(request, response, filepath);
	});
	stream.on('error', (err) => {
		response.end(err);
		logHttpRequest(request, response);
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
 * @returns {Object|false}
 */
function checkRoomAccess(roomName, request, response) {
	const room = rooms.find((room) => room.name === roomName);
	if (!room || !request.headers.authorization) return false;

	const basicAuth = request.headers.authorization.slice('basic '.length);
	const password = Buffer.from(basicAuth, 'base64').toString();

	return password === room.password ? room : false;
}
