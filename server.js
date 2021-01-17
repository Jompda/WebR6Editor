
module.exports = {
	resolveFile,
	getContentType,
	logHttpRequest,
	starMatcher
}

const { key, cert, port, rootDirectory, roomsDirectory,
	mimeTypes, autoComplete } = require('./settings.json');

const roomsKey = '/room/'
const rooms = require('./rooms.json');
const liveSSE = require('./live-sse.js');

const http = require('http'), https = require('https'),
	url = require('url'), path = require('path'), fs = require('fs');

const server = https.createServer({
	key: fs.readFileSync(key),
	cert: fs.readFileSync(cert)
}, function (request, response) {
	const parsedUrl = url.parse(request.url);
	
	switch (request.method) {
		case 'GET': get(parsedUrl, request, response, true); break;
		case 'HEAD': get(parsedUrl, request, response, false); break;
		case 'POST': post(parsedUrl, request, response); break;
		default:
			response.writeHead(501);
			response.end();
			logHttpRequest(request, response);
			break;
	}
});

liveSSE.mapDirectories(rootDirectory);
server.listen(port, '0.0.0.0', () => {
	const serverAddress = server.address();
	let address = serverAddress.address;
	if (serverAddress.family === 'IPv6') address = '['+address+']';
	console.log(`Serving http on ${address}:${serverAddress.port} from '${path.resolve(rootDirectory)}' ..`);
});



/**
 * @param {url.UrlWithStringQuery} url 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 * @param {Boolean} sendBody 
 */
function get(url, request, response, sendBody) {
	// Awful hardcoding.
	if (url.pathname === '/live-server-updates') return liveSSE.handleSSE(request, response);
	if (url.pathname === '/live-page') return liveSSE.injectHtml(request, response, rootDirectory);

	let filepath = rootDirectory + url.pathname;

	// Restricted access
	if (url.pathname.startsWith(roomsKey)) {
		const cutUrl = url.pathname.split('/'); cutUrl.shift();
		if (checkRoomAccess(cutUrl[1], request, response)) {
			filepath = `${roomsDirectory}/${cutUrl[1]}/slides/${cutUrl[2]}`;
		} else {
			response.writeHead(403);
			response.end();
			return logHttpRequest(request, response);
		}
	}

	// Default
	resolveFile(filepath, (resolvedFile, stat) => {
		if (resolvedFile === undefined) {
			response.writeHead(404);
			response.end();
			return logHttpRequest(request, response);
		}

		response.writeHead(200, {
			'Content-Type': getContentType(resolvedFile),
			'Content-Length': stat.size
		});
		if (!sendBody) { // HEAD Method
			response.end();
			return logHttpRequest(request, response, resolvedFile);
		}

		// Send the body.
		const stream = fs.createReadStream(resolvedFile);
		stream.on('open', () => {
			stream.pipe(response);
		});
		stream.on('end', () => {
			logHttpRequest(request, response, resolvedFile);
		});
		stream.on('error', (err) => {
			response.end(err);
			logHttpRequest(request, response);
		});
	});
}

/**
 * Handles operations such as: saving the scene.
 * TODO: Support for creating a new room and adding slides to it.
 * @param {url.UrlWithStringQuery} url 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function post(url, request, response) {
	const postRequest = url.pathname.split('/'); postRequest.shift();

	switch (postRequest[0]) {
		case 'savescene':
			handleSaveScene(postRequest, request, response);
			break;
		default:
			response.writeHead(400);
			response.end();
			logHttpRequest(request, response);
			break;
	}
}

/**
 * @param {String[]} postRequest 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function handleSaveScene(postRequest, request, response) {
	if (!checkRoomAccess(postRequest[1], request, response)) {
		response.writeHead(403);
		response.end();
		return logHttpRequest(request, response);
	}
	
	let body = '';
	request.on('data', (data) => body += data);
	request.on('end', () => {
		try {
			// Check the integrity of the save data.
			const saveData = JSON.parse(body);
			saveScene(`${roomsDirectory}/${postRequest[1]}/slides/${postRequest[2]}`,
				saveData, request, response);
		} catch (err) {
			response.writeHead(400);
			response.end(err.message);
			logHttpRequest(request, response, err.message);
		}
	});
}

/**
 * @param {String} filepath 
 * @param {Object} saveData 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function saveScene(filepath, saveData, request, response) {
	const saveFile = {
		author: 'Jompda', // Placeholder for a user system.
		timestamp: new Date(),
		saveData
	}
	try {
		fs.writeFile(filepath,
			JSON.stringify(saveFile, undefined, /*For debugging purposes*/'\t'),
		() => {
			response.writeHead(200);
			response.end();
			logHttpRequest(request, response, filepath);
		});
	} catch (err) {
		response.writeHead(500);
		response.end(err.message);
		logHttpRequest(request, response, err.message);
	}
}

/**
 * @param {String} pathname 
 * @param {Function} callback 
 */
function resolveFile(pathname, callback) {
	let i = 0; loop();
	function loop() {
		if (i >= autoComplete.length) return callback();
		const temp = pathname + autoComplete[i++]
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

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 * @param {String} resolved 
 */
function logHttpRequest(request, response, resolved) {
	console.log(
		request.connection.remoteAddress + ' - - '
		+ request.method + ' '
		+ request.url + (resolved?' => '+resolved:'') + ' '
		+ 'HTTP/' + request.httpVersion + ' - '
		+ response.statusCode + ' '
		+ response.statusMessage);
}

/**
 * @param {String} pathname 
 * @returns {String}
 */
function getContentType(pathname) {
	const mimeType = mimeTypes[pathname.slice(pathname.lastIndexOf('.')+1)];
	return mimeType ? mimeType : 'text/plain';
}

/**
 * Waiting for purpose.
 * @param {String} matcher 
 * @param {String} str 
 * @returns {Boolean}
 */
function starMatcher(matcher, str) {
	let mpos = 0, a, b;
	for (let i = 0; i < str.length; i++) {
		const mn = matcher[mpos+1], sn = str[i+1];
		if (sn === undefined && mn === '*') return true;
		if ((a = matcher[mpos]) === (b = str[i])) {
			mpos++; continue;
		}
		if (a !== '*') return false;
		mn === b ? mpos++ && i-- :
		mn === sn ? mpos++ : 0;
	}
	return mpos >= matcher.length;
}
