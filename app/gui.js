import Obj from './objects/obj.js'
import { resourceURL } from './preload.js'
import { initRoomFromURL } from './roomhandler.js'
import { toolGroups } from './toolhandler.js'

/* BEGIN SEGMENT
 * Functions for object selection with the controller.
 */
/**@type {Obj} */
var selectedObject
const getSelectedObject = window.getSelectedObject = () => selectedObject

/**
 * Sets the selected object variable and calls showObjectProperties().
 * @param {Obj} obj
 */
const setSelectedObject = window.setSelectedObject = (obj) =>
	showObjectProperties(selectedObject = obj)

/**
 * @param {Obj} obj 
 */
function showObjectProperties(obj) {
	const object_properties = document.getElementById('object-properties')
	if (!object_properties) return;
	object_properties.textContent = ''
	if (obj) object_properties.appendChild(obj.getObjectPropertiesGUI())
	return obj
}
/*
 * END SEGMENT
 */


/* BEGIN SEGMENT
 * Functions for the sidebar animations.
 */
var slts = true
const sidebarLeftToggle = window.sidebarLeftToggle = () => {
	const wrapper = document.getElementById('editor-sidebar-left-wrapper')
	if (slts = !slts) translateElement(wrapper, '0px')
	else translateElement(wrapper, -wrapper.getBoundingClientRect().width+'px')
}

var srts = true
const sidebarRightToggle = window.sidebarRightToggle = () => {
	const wrapper = document.getElementById('editor-sidebar-right-wrapper')
	if (srts = !srts) translateElement(wrapper, '0px')
	else translateElement(wrapper, wrapper.getBoundingClientRect().width+'px')
}

/**
 * @param {HTMLElement} element 
 * @param {String} value 
 */
const translateElement = window.translateElement = (element, value) =>
	element.style.transform=`translate(${value})`
/*
 * END SEGMENT
 */


/* BEGIN SEGMENT
 * Functions for the Room controls.
 */
function applyRoomInfo(room) {
	$('#room-name').val(room.name)
	$('#room-key').val(room.key)
	$('#slide-name').val(room.slide)
}
/*
 * END SEGMENT
 */


/* BEGIN SEGMENT
 * Functions for creating the editor sidebars.
 */
/**
 * @param {Object} mapConfig 
 */
function loadMapList(mapConfig) {
	const mapChooser = document.getElementById('mapchooser')
	mapConfig.forEach((map, i) => {
		if (i > 0) {
			const line = document.createElement('option')
			line.innerHTML = '-----'
			mapChooser.appendChild(line)
		}
		map.floors.forEach((floor) => {
			const option = document.createElement('option')
			option.setAttribute('value', `${map.name.toLowerCase()}/${floor[1]}`)
			if (map.esl) option.setAttribute('class', 'map-pool-esl')
			option.innerHTML = `${map.name} ${floor[0]}`
			mapChooser.appendChild(option)
		});
	});
}

/**
 * @param {Object} assetConfig
 */
function loadToolPages(assetConfig) {
	assetConfig.forEach((group) => {
		const matchingPage = toolGroups.get(group.page)
		createImagePlacerGroup(matchingPage, group)
	})

	// temp room testing
	if (location.search) initRoomFromURL()
}

/**
 * @param {HTMLElement} target
 * @param {Object} group
 */
function createImagePlacerGroup(target, group) {
	target.appendChild(createHeader(group.name))
	const table = createFlexTable()
	group.assets.forEach((rawAsset) => {
		// Resolve filename AKA assetId
		const filename = rawAsset[1] ? rawAsset[1] : rawAsset[0].toLowerCase()
		const toolOptions = { assetId: filename }
		const imageTool = createImageToolButton(rawAsset[0], resourceURL + group.path + filename + '.png',
			`setTool('imageplacer', '${JSON.stringify(toolOptions)}')`)
		table.appendChild(imageTool)
	});
	target.appendChild(table)
	target.appendChild(createHR())
}

function createImageToolButton(title, imgurl, onchange) {
	const label = formElement('label', [[ 'class', 'imagetool' ]])
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
	)
	return label
}

function createToolPageButton(title, group) {
	const label = formElement('label', [[ 'class', 'tool-page-button' ]])
	const input = formElement('input', [
		[ 'type', 'radio' ],
		[ 'name', 'tool-page-button' ],
		[ 'onchange', `setToolPage('${group}')` ]
	])
	const txt = document.createElement('div')
	txt.textContent = title
	label.append(input, txt)
	return label
}

function createToolButton(title) {
	return formElement('button', [
		[ 'class', 'toolbutton' ],
		[ 'onclick', `setTool('${title.toLowerCase()}')` ]
	], title)
}

const createHeader = (header) => formElement('p', [[ 'class', 'sidebar-header' ]], header)
const createHR = () => formElement('hr', [[ 'class', 'sidebar-hr' ]])
const createFlexTable = () => formElement('div', [[ 'class', 'flex-table' ]])
/*
 * END SEGMENT
 */


 /**
 * @param {String} tag 
 * @param {String[][]} attribs 
 * @param {HTMLElement} innerHTML 
 * @returns {HTMLElement}
 */
function formElement(tag, attribs, innerHTML) {
	const elem = document.createElement(tag)
	if (attribs) attribs.forEach(attrib => elem.setAttribute(attrib[0], attrib[1]))
	if (innerHTML) elem.innerHTML = innerHTML
	return elem
}

export {
	getSelectedObject, setSelectedObject,
	showObjectProperties,
	sidebarLeftToggle, sidebarRightToggle,
	applyRoomInfo,
	loadMapList, loadToolPages,
	createImageToolButton,
	createToolPageButton,
	createToolButton,
	createHeader,
	createHR,
	createFlexTable,
	formElement
}
