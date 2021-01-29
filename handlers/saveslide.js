
const http = require('http'), url = require('url'), path = require('path'), fs = require('fs')
const { settings } = require('../server')
const { roomAccess } = require('../database/RoomManager')
const { finishResponse } = require('../util')

/**
 * @param {http.IncomingMessage} request 
 * @returns {Boolean}
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

	if (!roomAccess(cutUrl[1], request))
		return finishResponse({ statusCode: 403 }, request, response)
	
	let body = ''
	request.on('data', (data) => body += data)
	request.on('end', () => {
		try {
			// Check the integrity of the save data while at it.
			saveSlide(path.join(settings.roomsDir, cutUrl[1], 'slides', cutUrl[2] + '.json'),
				JSON.parse(body), request, response)
		} catch (err) {
			finishResponse({
				statusCode: 400, message: err.message, resolved: err.message
			}, request, response)
		}
	})
}

/**
 * @param {String} filepath 
 * @param {Object} saveData 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function saveSlide(filepath, saveData, request, response) {
	const content = {
		author: 'Jompda', // Placeholder for a user system.
		timestamp: new Date(),
		saveData
	}
	try {
		fs.writeFile(filepath, JSON.stringify(content, undefined, /*For debugging purposes*/'\t'),
		() => finishResponse({ statusCode: 200, resolved: filepath }, request, response))
	} catch (err) {
		finishResponse({ statusCode: 500, message: err.message, resolved: err.message }, request, response)
	}
}

module.exports = {
	condition,
	handle
}
