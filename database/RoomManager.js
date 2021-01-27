
const http = require('http');

const rooms = require('./temproomsdb.json');

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
	roomAccess
}
