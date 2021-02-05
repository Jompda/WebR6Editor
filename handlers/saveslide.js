
const http = require('http'), url = require('url')
const { roomAccess, getRoomByName } = require('../database/RoomManager')
const { finishResponse } = require('../util')

/**
 * @param {http.IncomingMessage} request 
 * @returns {boolean}
 */
function condition(request) {
	return request.method === 'POST' && /\/saveslide\/\S+?\/\S+/.test(request.url)
}

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function handle(request, response) {
	const cutUrl = url.parse(request.url).pathname.split('/'); cutUrl.shift()

	const room = getRoomByName(cutUrl[1])
	if (!room || !roomAccess(room, request))
		return finishResponse({ statusCode: 403 }, request, response)
	
	let body = ''
	request.on('data', (data) => body += data)
	request.on('end', () => {
		try {
			// Check the integrity of the save data while at it.
			room.saveSlide(cutUrl[2], JSON.parse(body), request, response)
		} catch (err) {
			finishResponse({
				statusCode: 400, message: err.message, resolved: err.message
			}, request, response)
		}
	})
}

module.exports = {
	condition,
	handle
}
