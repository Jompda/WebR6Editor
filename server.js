
module.exports = {
	resolveFile,
	getContentType,
	logHttpRequest,
	starMatcher
}

const { port, rootDirectory, mimeTypes, autoComplete } = require('./settings.json');
const liveSSE = require('./live-sse.js');

const http = require('http'), url = require('url'), path = require('path'), fs = require('fs');

const server = http.createServer(function (request, response) {
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

	resolveFile(rootDirectory + url.pathname, (resolvedFile, stat) => {
		if (resolvedFile === undefined) {
			response.writeHead(404);
			response.end();
			return logHttpRequest(request, response);
		}

		if (!sendBody) { // HEAD Method
			response.writeHead(200, {
				'Content-Type': getContentType(resolvedFile),
				'Content-Length': stat.size
			});
			response.end();
			return logHttpRequest(request, response, resolvedFile);
		}

		// Send the body.
		const stream = fs.createReadStream(resolvedFile);
		stream.on('open', () => {
			response.writeHead(200, {
				'Content-Type': getContentType(resolvedFile),
				'Content-Length': stat.size
			});
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
 * Used to handle scene saves.
 * @param {url.UrlWithStringQuery} url 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function post(url, request, response) {
	if (!url.pathname.startsWith('/saved/')) {
		response.writeHead(404);
		response.end();
		logHttpRequest(request, response);
		return;
	}
	let body = '';
	request.on('data', (data) => {
		body += data;
	});
	request.on('end', () => {
		fs.writeFile(rootDirectory + url.pathname, body, () => {
			response.writeHead(200);
			response.end();
			logHttpRequest(request, response, 'overwritten');
		});
	});
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
	const mimeType = mimeTypes[pathname.substring(pathname.lastIndexOf('.')+1)];
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
		if ((a = matcher[mpos]) === (b = str[i])) {
			mpos++; continue;
		}
		if (a !== '*') return false;
		if (matcher[mpos+1] === str[i+1]) ++mpos;
	}
	return mpos >= matcher.length;
}
