
const http = require('http'), path = require('path'), fs = require('fs')

const { settings } = require('..')
const { finishResponse } = require('../util')
const rooms = require('./temproomsdb.json')

/**
 * @param {Room} room
 * @param {String} slideName 
 * @param {Object} saveData 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function saveSlide(room, slideName, saveData, request, response) {
	const filepath = path.join(settings.roomsDir, room.name, 'slides', slideName + '.json')

	// TODO: Check for permissions.
	const content = {
		author: 'Jompda', // Placeholder for a user system.
		timestamp: new Date(),
		saveData
	}
	try {
		fs.writeFile(filepath, JSON.stringify(content, undefined, /*For debugging purposes*/'\t'),
			() => finishResponse({ statusCode: 200, resolved: filepath }, request, response))
	} catch (err) {
		finishResponse({
			statusCode: 500, message: err.message, resolved: err.message
		}, request, response)
	}
}

/**
 * @param {String} roomName 
 * @param {http.IncomingMessage} request 
 * @returns {Room|false}
 */
function roomAccess(roomName, request) {
	const room = rooms.find((room) => room.name === roomName);
	if (!room || !request.headers.authorization) return false;

	const basicAuth = request.headers.authorization.slice('Basic '.length);
	const password = Buffer.from(basicAuth, 'base64').toString();

	return password === room.password ? room : false;
}

module.exports = {
	saveSlide,
	roomAccess
}
