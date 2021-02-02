import Obj from './objects/obj.js';
import { sidebar_left, sidebar_right } from './preload.js';

/* BEGIN
 * Functions for object selection with the controller.
 */
/**@type {Obj} */
var selectedObject;
const getSelectedObject = window.getSelectedObject = () => selectedObject;

/**
 * Sets the selected object variable and calls showObjectProperties().
 * @param {Obj} obj
 */
const setSelectedObject = window.setSelectedObject = (obj) =>
	showObjectProperties(selectedObject = obj);

/**
 * @param {Obj} obj 
 */
function showObjectProperties(obj) {
	const object_properties = document.getElementById('object-properties');
	if (!object_properties) return;
	if (object_properties.firstChild) object_properties.removeChild(object_properties.firstChild);
	if (obj) object_properties.appendChild(obj.getObjectPropertiesGUI());
	return obj;
}
/* END
 * Functions for object selection with the controller.
 */


/* BEGIN
 * Functions for the sidebar animations.
 */
var slts = true;
const sidebarLeftToggle = window.sidebarLeftToggle = () => (slts = !slts) ?
		translateElement(sidebar_left, '0px') :
		translateElement(sidebar_left, -sidebar_left.getBoundingClientRect().width+'px');

var srts = true;
const sidebarRightToggle = window.sidebarRightToggle = () => (srts = !srts) ?
		translateElement(sidebar_right, '0px') :
		translateElement(sidebar_right, sidebar_right.getBoundingClientRect().width+'px');

/**
 * @param {HTMLElement} element 
 * @param {String} value 
 */
const translateElement = window.translateElement = (element, value) =>
	element.style.transform=`translate(${value})`;
/* END
 * Functions for the sidebar animations.
 */


/* BEGIN
 * Functions for creating the Room controls.
 */
// TODO
/* END
 * Functions for creating the Room controls.
 */


/* BEGIN
 * Functions for creating the editor sidebars.
 */
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
/* END
 * Functions for creating the editor sidebars.
 */

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
