import Obj from './objects/obj.js';
import { sidebar_left, sidebar_right } from './preload.js';

// Object selection functionality.
var selectedObject;
/**@returns {Obj}*/
const getSelectedObject = () => selectedObject;
window.getSelectedObject = getSelectedObject;
/**
 * Sets the selected object variable and calls showObjectProperties().
 * @param {Obj} obj
 * @returns {Obj}
 */
function setSelectedObject(obj) {
	showObjectProperties(selectedObject = obj);
	return obj;
}
window.setSelectedObject = setSelectedObject;

/**
 * @param {Obj} obj 
 */
function showObjectProperties(obj) {
	const object_properties = document.getElementById('object-properties');
	if (!object_properties) return;
	if (object_properties.firstChild) object_properties.removeChild(object_properties.firstChild);
	if (obj) object_properties.appendChild(obj.getObjectPropertiesGUI());
}

// Sidebar functionality.
var sidebar_left_toggle_state = true;
function sidebarLeftToggle() {
	sidebar_left_toggle_state ?
		sidebar_left.style.transform=`translate(${-sidebar_left.getBoundingClientRect().width}px)` :
		sidebar_left.style.transform='translate(0px)';
	sidebar_left_toggle_state = !sidebar_left_toggle_state;
}
window.sidebarLeftToggle = sidebarLeftToggle;

// Sidebar functionality.
var sidebar_right_toggle_state = true;
function sidebarRightToggle() {
	sidebar_right_toggle_state ?
		sidebar_right.style.transform=`translate(${sidebar_right.getBoundingClientRect().width}px)` :
		sidebar_right.style.transform='translate(0px)';
		sidebar_right_toggle_state = !sidebar_right_toggle_state;
}
window.sidebarRightToggle = sidebarRightToggle;


// Functions to create HTML elements.
function createImageToolButton(title, imgurl, onchange) {
	const label = formElement('label', [[ 'class', 'imagetool' ]]);
	label.append(
		formElement('input', [
			[ 'type', 'radio' ],
			[ 'name', 'tool' ],
			[ 'onchange', onchange ]
		]),
		formElement('img', [
			[ 'src', imgurl ],
			[ 'title', title ]
		])
	);
	return label;
}

function createToolPageButton(title, group) {
	const label = formElement('label', [[ 'class', 'tool-page-button' ]]);
	const input = formElement('input', [
		[ 'type', 'radio' ],
		[ 'name', 'tool-page-button' ],
		[ 'onchange', `setToolPage('${group}');` ]
	]);
	const txt = document.createElement('div');
	txt.innerHTML = title;
	label.appendChild(input);
	label.appendChild(txt);
	return label;
}

function createToolButton(title) {
	return formElement('button', [
		[ 'class', 'toolbutton' ],
		[ 'onclick', `setTool('${title.toLowerCase()}')` ]
	], title);
}

const createHeader = (header) => formElement('p', [[ 'class', 'sidebar-header' ]], header);
const createHR = () => formElement('hr', [[ 'class', 'sidebar-hr' ]]);
const createFlexTable = () => formElement('div', [[ 'class', 'flex-table' ]]);

/**
 * @param {String} tag 
 * @param {String[][]} attribs 
 * @param {HTMLElement} innerHTML 
 * @returns {HTMLElement}
 */
function formElement(tag, attribs, innerHTML) {
	const elem = document.createElement(tag);
	if (attribs) attribs.forEach(attrib => elem.setAttribute(attrib[0], attrib[1]));
	if (innerHTML) elem.innerHTML = innerHTML;
	return elem;
}

export {
	getSelectedObject, setSelectedObject,
	showObjectProperties,
	sidebarLeftToggle, sidebarRightToggle,
	createImageToolButton,
	createToolPageButton,
	createToolButton,
	createHeader,
	createHR,
	createFlexTable,
	formElement
};
