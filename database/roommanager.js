
const http = require('http'), path = require('path'), fs = require('fs')

const Room = require('./room')
const rooms = require('./temproomsdb.json').map((obj) => new Room(obj))


/**
 * @param {Room} room 
 * @param {http.IncomingMessage} request 
 * @returns {Boolean}
 */
function roomAccess(room, request) {
	if (!request.headers.authorization) return false

	const basicAuth = request.headers.authorization.slice('Basic '.length)
	const password = Buffer.from(basicAuth, 'base64').toString()

	return password === room.password ? room : false
}

/**
 * @param {String} roomName 
 * @returns {Room}
 */
function getRoomByName(roomName) {
	return rooms.find((room) => room.name === roomName)
}

module.exports = {
	roomAccess,
	getRoomByName
}
