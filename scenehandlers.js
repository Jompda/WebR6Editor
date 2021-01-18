
const http = require('http'), url = require('url'), fs = require('fs');
const { checkRoomAccess, resolveFile, sendFile } = require('./server');
const { logHttpRequest } = require('./util');
const { roomsDirectory } = require('./settings.json');

class GetSceneHandler {

	/**
	 * @param {http.IncomingMessage} request 
	 * @returns {Boolean}
	 */
	static condition(request) {
		return request.method === 'GET' && request.url.startsWith('/room/');
	}

	/**
	 * @param {http.IncomingMessage} request 
	 * @param {http.ServerResponse} response 
	 */
	static handle(request, response) {
		const parsedUrl = url.parse(request.url);
		const cutUrl = parsedUrl.pathname.split('/'); cutUrl.shift();

		if (!checkRoomAccess(cutUrl[1], request, response)) {
			response.writeHead(403);
			response.end();
			return logHttpRequest(request, response);
		}

		resolveFile(`${roomsDirectory}/${cutUrl[1]}/slides/${cutUrl[2]}`, (resolvedFile, stat) => {
			if (!resolvedFile) {
				response.writeHead(404);
				response.end();
				return logHttpRequest(request, response);
			}
			sendFile(resolvedFile, stat, request, response);
		});
		return true;
	}
}

class PostSceneHandler {

	/**
	 * @param {http.IncomingMessage} request 
	 * @returns {Boolean}
	 */
	static condition(request) {
		return request.method === 'POST' && request.url.startsWith('/savescene/');
	}
	
	/**
	 * @param {http.IncomingMessage} request 
	 * @param {http.ServerResponse} response 
	 */
	static handle(request, response) {
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
				PostSceneHandler.saveScene(`${roomsDirectory}/${postRequest[1]}/slides/${postRequest[2]}.json`,
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
	static saveScene(filepath, saveData, request, response) {
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
}



module.exports = [
	GetSceneHandler, PostSceneHandler
]
