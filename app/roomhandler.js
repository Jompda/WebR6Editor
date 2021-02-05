import { applyRoomInfo, formElement, setSelectedObject, showObjectProperties } from "./gui.js"
import { changeMap, getBackgroundImageUrl, getObjects, update } from "./main.js"
import ImageObj from "./objects/imageobj.js"
import Obj from "./objects/obj.js"
import { requestHttpResource } from "./preload.js"

const Room = {
	/**@type {string}*/ room: undefined,
	/**@type {string}*/ key: undefined,
	/**@type {string}*/ slide: undefined
}
window.Room = Room

const loadSlide = window.loadSlide = () => {
	requestHttpResource({
		url: `room/${Room.name}/${Room.slide}`,
		headers: { 'Authorization': 'Basic ' + btoa('lith') }
	}).then((xhr) => {
		const file = JSON.parse(xhr.responseText)
		console.log(file)
		const saveData = file.saveData

		// Clear the old slide.
		showObjectProperties(setSelectedObject())
		const objects = getObjects()
		objects.splice(0, objects.length)

		// Apply the new slide from save data.
		changeMap(saveData.backgroundImageUrl)
		saveData.objects.forEach(obj => {
			switch (obj.class) {
				case 'ImageObj': objects.push(ImageObj.fromObject(obj.instance)); break
				default: break
			}
		})
		
		update()
	}).catch(() => alert(`Slide '${Room.slide}' doesn't exist!`))
}

const saveSlide = window.saveSlide = () => {
	const objs = getObjects()
	const cache = [] // Used to avoid circular structures in the JSON.
	console.log(getBackgroundImageUrl())
	const saveData = JSON.stringify({
		backgroundImageUrl: getBackgroundImageUrl(),
		objects: objs
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

/**
 * Assigns the room to the session.
 */
const loadRoom = window.loadRoom = () => {
	requestHttpResource({
		method: 'GET',
		headers: { 'Authorization': 'Basic ' + btoa(Room.key) },
		url: `room/${Room.name}/`
	}).then((xhr) => {
		const roomInfo = document.getElementById('room-info')
		roomInfo.textContent = ''
		roomInfo.appendChild(formElement('p', [['class','sidebar-text']], 'Room: ' + Room.name))
		console.log('RoomInfo:', JSON.parse(xhr.responseText))
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
		if (Room.slide) loadSlide()
	}
}

export {
	Room,
	loadSlide,
	saveSlide,
	loadRoom,
	initRoomFromURL
}
