const http = require('http'), fs = require('fs'), path = require('path')

const { settings } = require('..')
const { finishResponse } = require('../util')

/**
 * Room representing a room in the datastructure.
 */
module.exports = class Room {
	/**
	 * @param {Object} obj 
	 * @param {string} obj.name 
	 * @param {string} obj.key 
	 * @param {string} obj.owner 
	 */
	constructor(obj) {
		this.name = obj.name
		this.key = obj.key
		this.owner = obj.owner
		this.roominfo = require(path.join(settings.roomsDir, this.name, 'roominfo.json'))
		/**@type {string[]} */
		this.slides = this.roominfo.slides
	}

	/**
	 * @param {string} slideName 
	 * @param {Object} saveData 
	 * @param {http.IncomingMessage} request 
	 * @param {http.ServerResponse} response 
	 */
	saveSlide(slideName, saveData, request, response) {
		const filepath = path.join(settings.roomsDir, this.name, 'slides', slideName + '.json')

		if (!this.slides.find(temp=>temp===slideName)) {
			this.slides.push(slideName)
			this.saveRoomInfo()
		}

		// TODO: Check for permissions.
		const content = {
			author: 'Jompda', // Placeholder for a user system.
			timestamp: new Date(),
			saveData
		}
		try {
			fs.writeFile(filepath, JSON.stringify(content, undefined, /*For debugging purposes*/'\t'),
				() => finishResponse({ statusCode: 200 }, request, response))
		} catch (err) {
			finishResponse({
				statusCode: 500, message: err.message, resolved: err.message
			}, request, response)
		}
	}

	/**
	 * @param {string} slideName 
	 */
	slideReadStream(slideName) {
		return fs.createReadStream(path.join(settings.roomsDir, this.name, 'slides', slideName + '.json'))
	}

	saveRoomInfo() {
		const result = JSON.stringify({
			slides: this.slides
		}, undefined, '\t')
		fs.writeFile(path.join(settings.roomsDir, this.name, 'roominfo.json'), result, () =>
			console.log('saved roominfo')
		)
	}
}
