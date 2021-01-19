
const http = require('http'), url = require('url'), fs = require('fs');
const { checkRoomAccess } = require('../server.js');
const { logHttpRequest } = require('../util.js');
const { roomsDir } = require('../settings.json');

/**
 * @param {http.IncomingMessage} request 
 * @returns {Boolean}
 */
function condition(request) {
	return request.method === 'POST' && request.url.startsWith('/savescene/');
}

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function handle(request, response) {
	const postRequest = url.parse(request.url).pathname.split('/'); postRequest.shift();

	if (!checkRoomAccess(postRequest[1], request, response)) {
		response.writeHead(403);
		response.end();
		return logHttpRequest(request, response);
	}
	
	let body = '';
	request.on('data', (data) => body += data);
	request.on('end', () => {
		try {
			// Check the integrity of the save data.
			const saveData = JSON.parse(body);
			saveScene(`${roomsDir}/${postRequest[1]}/slides/${postRequest[2]}.json`,
				saveData, request, response);
		} catch (err) {
			response.writeHead(400);
			response.end(err.message);
			logHttpRequest(request, response, err.message);
		}
	});
}

/**
 * @param {String} filepath 
 * @param {Object} saveData 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function saveScene(filepath, saveData, request, response) {
	const saveFile = {
		author: 'Jompda', // Placeholder for a user system.
		timestamp: new Date(),
		saveData
	}
	try {
		fs.writeFile(filepath,
			JSON.stringify(saveFile, undefined, /*For debugging purposes*/'\t'),
		() => {
			response.writeHead(200);
			response.end();
			logHttpRequest(request, response, filepath);
		});
	} catch (err) {
		response.writeHead(500);
		response.end(err.message);
		logHttpRequest(request, response, err.message);
	}
}

module.exports = {
	condition,
	handle
}
