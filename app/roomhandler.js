import { appendSlide, applyRoomInfo, formElement, loadSlides, setSelectedObject, showObjectProperties } from "./gui.js"
import { clearSlide, changeMap, getBackgroundImageUrl, getObjects, update } from "./main.js"
import ImageObj from "./objects/imageobj.js"
import Obj from "./objects/obj.js"
import { requestHttpResource } from "./preload.js"

const Room = {
	/**@type {string}*/ name: undefined,
	/**@type {string}*/ key: undefined,
	/**@type {String[]}*/ slides: [],
	/**@type {string}*/ slide: undefined
}
window.Room = Room

const loadSlide = window.loadSlide = (slideName) => {
	document.getElementById('room-slide').textContent = 'Slide: ' + (Room.slide = slideName)
	if (!slideName) {
		return clearSlide()
	}
		
	requestHttpResource({
		url: `room/${Room.name}/${slideName}`,
		headers: { 'Authorization': 'Basic ' + btoa(Room.key) }
	}).then((xhr) => {
		const file = JSON.parse(xhr.responseText)
		console.log(file)
		clearSlide()
		const saveData = file.saveData

		// Clear the old slide.
		const objects = getObjects()

		// Apply the new slide from save data.
		changeMap(saveData.backgroundImageUrl)
		saveData.objs.forEach(obj => {
			switch (obj.class) { // TODO: for each object type
				case 'ImageObj': objects.push(ImageObj.fromObject(obj.instance)); break
				default: break
			}
		})
		
		update()
	}).catch(() => alert(`Slide '${slideName}' doesn't exist!`))
}

const saveSlide = window.saveSlide = () => {
	if (!Room.slide) return;
	const cache = [] // Used to avoid circular structures in the JSON.
	const saveData = JSON.stringify({
		backgroundImageUrl: getBackgroundImageUrl(),
		objs: getObjects()
	}, replacer)

	// Save the slide.
	requestHttpResource({
		method: 'POST',	headers: {
			'Authorization': 'Basic ' + btoa('lith'),
			'Content-Type': 'application/json'
		},
		url: `saveslide/${Room.name}/${Room.slide}`, body: saveData
	}).then((xhr) => {
		if (xhr.status != 200) return alertXhrError(xhr)
		alert('The slide has been succesfully saved!')
	}).catch(alertXhrError)

	/**
	 * @param {XMLHttpRequest} xhr
	 */
	function alertXhrError(xhr) {
		console.log('ERROR:', xhr.status, xhr.statusText, '\nReason:',  xhr.responseText)
		alert('An error has occurred while saving the slide! Further information has been logged to the console.')
	}

	/**
	 * @param {string} key 
	 * @param {*} value 
	 */
	function replacer(key, value) {
		if (key === 'image' || key === 'outlineImage' || key === 'controlPoints') return;
		if (key === 'outline' && value) return { type: 'p5RgbColor', levels: value.levels }
		if (typeof value === 'object' && value !== null) {
			if (key !== 'instance' && value instanceof Obj) return { class: value.constructor.name, instance: value }

			// avoid cycles
			if (cache.includes(value)) return;
			cache.push(value)
		}
		if (typeof value === 'number') return Math.round(value*1000)/1000
		return value
	}
}

const newSlide = window.newSlide = (slideName) => {
	if (!slideName) return console.log('newSlide cancelled')
	clearSlide()
	document.getElementById('room-slide').textContent = 'Slide: ' + (Room.slide = slideName)
	appendSlide(document.getElementById('slide-list'), slideName)
	alert(`New slide "${slideName}" has been created locally but it has not yet been saved on the server.`)
}

/**
 * Assigns the room to the session.
 */
const loadRoom = window.loadRoom = () => {
	requestHttpResource({
		method: 'GET',
		headers: { 'Authorization': 'Basic ' + btoa(Room.key) },
		url: `room/${Room.name}/`
	}).then((xhr) => {
		const roominfo = JSON.parse(xhr.responseText)
		Room.slides = roominfo.slides
		console.log('Room:', Room)
		loadSlides(Room)
	}).catch(() => alert('Authorization forbidden.'))
}

function initRoomFromURL() {
	const params = new URL(location).searchParams
	Room.name = params.get('room')
	Room.key = params.get('key')
	Room.slide = params.get('slide')
	applyRoomInfo(Room)
	if (Room.name && Room.key) {
		loadRoom()
		if (Room.slide) loadSlide(Room.slide)
	}
}

export {
	Room,
	loadSlide,
	saveSlide,
	newSlide,
	loadRoom,
	initRoomFromURL
}
