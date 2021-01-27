
const http = require('http'), https = require('https'),
	url = require('url'), path = require('path'), fs = require('fs');

const { getContentType, logHttpRequest, finishResponse, applyToObject } = require('./util.js');

/**
 * @type {{port:Number,keyPath:String,certPath:String,rootDir:String,roomsDir:String}}
 */
const settings = {};
applyToObject(settings, './config.cfg');
{	// Handle the settings.
	settings.port = parseInt(settings.port);
	settings.rootDir = path.resolve(settings.rootDir);
	settings.roomsDir = path.resolve(settings.roomsDir);
	console.log(settings);
}

const autoCompletes = settings.autoCompletes.split(',');
autoCompletes.unshift('');
delete settings.autoCompletes;

const RoomManager = require('./database/RoomManager.js');

module.exports = {
	sendFile,
	resolveFile,
	settings
}

const handlers = [];
fs.readdirSync('./handlers/').forEach(filename =>
	handlers.push(require('./handlers/' + filename)));


const server = https.createServer({
	key: fs.readFileSync(settings.keyPath),
	cert: fs.readFileSync(settings.certPath)
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

server.listen(settings.port, '0.0.0.0', () => {
	const serverAddress = server.address();
	let address = serverAddress.address;
	if (serverAddress.family === 'IPv6') address = '['+address+']';
	console.log(`Serving https on ${address}:${serverAddress.port} from '${path.resolve(settings.rootDir)}' ..`);
});



/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function get(request, response) {
	resolveFile(path.join(settings.rootDir, url.parse(request.url).pathname), (resolvedFile, stat) => {
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
		if (i >= autoCompletes.length) return callback();
		const temp = path.join(pathname, autoCompletes[i++]);
		fs.stat(temp, (err, result) => {
			if (err || result.isDirectory()) return loop();
			callback(temp, result);
		});
	}
}
