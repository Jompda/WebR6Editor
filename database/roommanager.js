
const { settings } = require('..')
const http = require('http'), path = require('path'), fs = require('fs')

module.exports = {
	roomAccess,
	getRoomByName,
	saveRooms
}

const Room = require('./room')
// Construct the cache.
const rooms = require('./temproomsdb.json').map((obj) => new Room(obj))


/**
 * @param {Room} room 
 * @param {http.IncomingMessage} request 
 * @returns {Boolean}
 */
function roomAccess(room, request) {
	if (!request.headers.authorization) return false

	const basicAuth = request.headers.authorization.slice('Basic '.length)
	const key = Buffer.from(basicAuth, 'base64').toString()

	return key === room.key ? room : false
}

/**
 * @param {String} roomName 
 * @returns {Room}s
 */
function getRoomByName(roomName) {
	return rooms.find((room) => room.name === roomName)
}

/**
 * Temporary solution until a proper databse.
 */
function saveRooms() {
	const result = JSON.stringify(rooms, replacer, '\t')
	fs.writeFile('./temproomsdb.json', result, () =>
		console.log('saved roomsdb')
	)

	function replacer(key, value) {
		// Filter out roominfo
		if (key === 'roominfo') return
		return value
	}
}
