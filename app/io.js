import { setSelectedObject, showObjectProperties } from "./gui.js";
import { changeMap, getBackgroundImageUrl, getObjects, update } from "./main.js";
import ImageObj from "./objects/imageobj.js";
import Obj from "./objects/obj.js";
import { requestHttpResource } from "./preload.js";

function loadScene() {
	const sceneName = document.getElementById('scene-name').value;
	requestHttpResource({
		url: `room/testroom/${sceneName}.json`,
		headers: { 'Authorization': 'Basic ' + btoa('lith') }
	}, (xhr) => {
		const file = JSON.parse(xhr.responseText);
		console.log(file);
		const saveData = file.saveData;

		// Clear the old scene.
		showObjectProperties(setSelectedObject());
		const objects = getObjects();
		objects.splice(0, objects.length);

		// Apply the new scene from save data.
		changeMap(saveData.backgroundImageUrl);
		saveData.objects.forEach(obj => {
			switch (obj.class) {
				case 'ImageObj': objects.push(ImageObj.fromObject(obj.instance)); break;
				default: break;
			}
		});
	
		update();
	}, () => alert(`Scene '${sceneName}' doesn't exist!`));
}
window.loadScene = loadScene;

function saveScene() {
	const objs = getObjects();
	const cache = []; // Used to avoid circular structures in the JSON.
	const saveData = JSON.stringify({
		backgroundImageUrl: getBackgroundImageUrl(),
		objects: objs
	}, replacer);

	// Save the scene.
	const sceneName = document.getElementById('scene-name').value;
	requestHttpResource({
		method: 'POST',	headers: {
			'Authorization': 'Basic ' + btoa('lith'),
			'Content-Type': 'application/json'
		},
		url: `savescene/testroom/${sceneName}`, body: saveData
	}, (xhr) => {
		if (xhr.status != 200) return alertXhrError(xhr);
		alert('The scene has been succesfully saved!');
	}, (xhr) => alertXhrError(xhr));

	function alertXhrError(xhr) {
		console.log('ERROR:', xhr.status, xhr.statusText, '\nReason:',  xhr.responseText);
		alert('An error has occurred while saving the scene! Further information has been logged to the console.');
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
window.saveScene = saveScene;

export default {
	loadScene,
	saveScene
}