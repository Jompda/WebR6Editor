
const http = require('http'), url = require('url'), path = require('path');
const { resolveFile, sendFile, settings } = require('../server');
const { roomAccess } = require('../database/RoomManager');
const { finishResponse } = require('../util');

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

	if (!roomAccess(cutUrl[1], request))
		return finishResponse({ statusCode: 403 }, request, response);

	// tbh why resolve file in this point?
	if (cutUrl[2]) resolveFile(path.join(settings.roomsDir, cutUrl[1], 'slides', cutUrl[2]), postFileResolve);
	else resolveFile(path.join(settings.roomsDir, cutUrl[1], 'roominfo.json'), postFileResolve);

	function postFileResolve(resolvedFile, stat) {
		if (resolvedFile) return sendFile(resolvedFile, stat, request, response);
		finishResponse({ statusCode: 404 }, request, response);
	}
}

module.exports = {
	condition,
	handle
}
