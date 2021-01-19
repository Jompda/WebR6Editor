
const http = require('http'), url = require('url');
const { checkRoomAccess, resolveFile, sendFile } = require('../server.js');
const { logHttpRequest } = require('../util.js');
const { roomsDir } = require('../settings.json');

/**
 * @param {http.IncomingMessage} request 
 * @returns {Boolean}
 */
function condition(request) {
	return request.method === 'GET' && /\/room\/\S+?\/.*/.test(request.url);
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

	if (cutUrl[2]) resolveFile(`${roomsDir}/${cutUrl[1]}/slides/${cutUrl[2]}`, postFileResolve);
	else resolveFile(`${roomsDir}/${cutUrl[1]}/roominfo.json`, postFileResolve);

	

	function postFileResolve(resolvedFile, stat) {
		if (!resolvedFile) {
			response.writeHead(404);
			response.end();
			return logHttpRequest(request, response);
		}
		sendFile(resolvedFile, stat, request, response);
	}
}

module.exports = {
	condition,
	handle
}
