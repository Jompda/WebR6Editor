
const http = require('http'), url = require('url')
const { sendStream, sendContent } = require('../server')
const { roomAccess, getRoomByName } = require('../database/RoomManager')
const { finishResponse, logHttpRequest } = require('../util')

/**
 * @param {http.IncomingMessage} request 
 * @returns {Boolean}
 */
function condition(request) {
	return request.method === 'GET' && /\/room\/\S+?\/.*/.test(request.url)
}

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function handle(request, response) {
	const parsedUrl = url.parse(request.url)
	const cutUrl = parsedUrl.pathname.split('/'); cutUrl.shift()

	const room = getRoomByName(cutUrl[1])
	if (!room || !roomAccess(room, request))
		return finishResponse({ statusCode: 403 }, request, response)

	if (cutUrl[2]) { // slide
		if (!room.slides.find(temp=>temp===cutUrl[2]))
			return finishResponse({ statusCode: 404 }, request, response)
		
		sendStream(room.slideReadStream(cutUrl[2]), 'application/json', request, response)
			.on('end', () => logHttpRequest(request, response))
	} else { // roominfo
		sendContent(JSON.stringify(room.roominfo), 'application/json', request, response)
	}
}

module.exports = {
	condition,
	handle
}
