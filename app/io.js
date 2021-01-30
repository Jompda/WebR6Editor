import { setSelectedObject, showObjectProperties } from "./gui.js";
import { changeMap, getBackgroundImageUrl, getObjects, update } from "./main.js";
import ImageObj from "./objects/imageobj.js";
import Obj from "./objects/obj.js";
import { requestHttpResource } from "./preload.js";


const Room = {
	name: undefined,
	password: undefined,
	slide: undefined
}
window.Room = Room;

function loadSlide() {
	requestHttpResource({
		url: `room/${Room.name}/${Room.slide}`,
		headers: { 'Authorization': 'Basic ' + btoa('lith') }
	}, (xhr) => {
		const file = JSON.parse(xhr.responseText);
		console.log(file);
		const saveData = file.saveData;

		// Clear the old slide.
		showObjectProperties(setSelectedObject());
		const objects = getObjects();
		objects.splice(0, objects.length);

		// Apply the new slide from save data.
		changeMap(saveData.backgroundImageUrl);
		saveData.objects.forEach(obj => {
			switch (obj.class) {
				case 'ImageObj': objects.push(ImageObj.fromObject(obj.instance)); break;
				default: break;
			}
		});
	
		update();
	}, () => alert(`Slide '${Room.slide}' doesn't exist!`));
}
window.loadSlide = loadSlide;

function saveSlide() {
	const objs = getObjects();
	const cache = []; // Used to avoid circular structures in the JSON.
	const saveData = JSON.stringify({
		backgroundImageUrl: getBackgroundImageUrl(),
		objects: objs
	}, replacer);

	// Save the slide.
	requestHttpResource({
		method: 'POST',	headers: {
			'Authorization': 'Basic ' + btoa('lith'),
			'Content-Type': 'application/json'
		},
		url: `saveslide/${Room.name}/${Room.slide}`, body: saveData
	}, (xhr) => {
		if (xhr.status != 200) return alertXhrError(xhr);
		alert('The slide has been succesfully saved!');
	}, (xhr) => alertXhrError(xhr));

	function alertXhrError(xhr) {
		console.log('ERROR:', xhr.status, xhr.statusText, '\nReason:',  xhr.responseText);
		alert('An error has occurred while saving the slide! Further information has been logged to the console.');
	}

	function replacer(key, value) {
		if (key === 'image' || key === 'outlineImage' || key === 'controlPoints') return;
		if (key === 'outline' && value) return { type: 'p5RgbColor', levels: value.levels };
		if (typeof value === 'object' && value !== null) {
			if (key !== 'instance' && value instanceof Obj) return { class: value.constructor.name, instance: value };

			// avoid cycles
			if (cache.includes(value)) return;
			cache.push(value);
		}
		if (typeof value === 'number') return Math.round(value*1000)/1000;
		return value;
	}
}
window.saveSlide = saveSlide;

/**
 * Sets the app to work with the room.
 */
function loadRoom() {
	requestHttpResource({
		method: 'GET',
		headers: { 'Authorization': 'Basic ' + btoa(Room.password) },
		url: `room/${Room.name}/`
	}, (xhr) => {
		console.log('RoomInfo:', JSON.parse(xhr.responseText));
	}, () => alert('Authorization forbidden.'));
}
window.loadRoom = loadRoom;

function initRoomFromURL() {
	const params = new URL(location).searchParams
	const roomName = params.get('room'), password = params.get('pw'), slideName = params.get('slide')
	document.getElementById('room-name').value = Room.name = roomName
	document.getElementById('room-pw').value = Room.password = password
	document.getElementById('slide-name').value = Room.slide = slideName
	if (Room.name && Room.password) {
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
