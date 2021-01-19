
const http = require('http'), url = require('url');
const { checkRoomAccess, resolveFile, sendFile } = require('../server.js');
const { logHttpRequest } = require('../util.js');
const { roomsDirectory } = require('../settings.json');

/**
 * @param {http.IncomingMessage} request 
 * @returns {Boolean}
 */
function condition(request) {
	return request.method === 'GET' && request.url.startsWith('/room/');
}

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function handle(request, response) {
	const parsedUrl = url.parse(request.url);
	const cutUrl = parsedUrl.pathname.split('/'); cutUrl.shift();

	if (!checkRoomAccess(cutUrl[1], request, response)) {
		response.writeHead(403);
		response.end();
		return logHttpRequest(request, response);
	}

	resolveFile(`${roomsDirectory}/${cutUrl[1]}/slides/${cutUrl[2]}`, (resolvedFile, stat) => {
		if (!resolvedFile) {
			response.writeHead(404);
			response.end();
			return logHttpRequest(request, response);
		}
		sendFile(resolvedFile, stat, request, response);
	});
}

module.exports = {
	condition,
	handle
}
