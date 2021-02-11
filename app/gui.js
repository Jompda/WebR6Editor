import Obj from './objects/obj.js'
import { getAssetConfig, requestHttpResource, resourceURL } from './preload.js'
import { initRoomFromURL } from './roomhandler.js'
import { setToolPage, setToolPageContainer, toolGroups } from './toolhandler.js'

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
 * @param {string} value 
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
}

/**
 * Construct the slide controls
 * @param {Room} room 
 */
function loadSlides(room) {
	const roomInfo = document.getElementById('room-info')
	roomInfo.textContent = ''

	const slideList = formElement('div', [['id','slide-list']])
	appendSlide(slideList,'')
	room.slides.forEach((slideName) => appendSlide(slideList, decodeURI(slideName)))
	roomInfo.append(
		formElement('h3', [['class','sidebar-text'],['id','room-name']], 'Room: ' + room.name),
		formElement('h3', [['class','sidebar-text'],['id','room-slide']], 'Slide: ' + room.slide),
		createHR(),
		formElement('button', [['onclick','newSlide(prompt("Slide name:"))']], 'New slide'),
		formElement('button', [['onclick','saveSlide()']], 'Save slide'),
		createHR(),
		// This needs to be reworked for user-friendliness.
		formElement('p', [['class','sidebar-text']], 'slides:'),
		slideList
	)
}

function appendSlide(slideList, slideName) {
	const label = formElement('label', [
		['class','slide-selector']
	])
	label.append(
		formElement('input', [
			['type','radio'],
			['name','slide-button'],
			['onchange',`loadSlide('${slideName}')`]
		]),
		formElement('p', undefined, slideName)
	)
	slideList.appendChild(label)
}
/*
 * END SEGMENT
 */


/* BEGIN SEGMENT
 * Functions for creating the editor sidebars.
 */
/**
 * @param {XMLHttpRequest} xhr 
 */
async function constructLeftEditorSidebar(xhr) {
	$('#editor-sidebar-left-wrapper').append($.parseHTML(xhr.responseText))
	loadMapList(JSON.parse((await requestHttpResource({ url: '/maps.json' })).responseText))
}

/**
 * @param {XMLHttpRequest} xhr 
 */
async function constructRightEditorSidebar(xhr) {
	$('#editor-sidebar-right-wrapper').append($.parseHTML(xhr.responseText))
	setToolPageContainer(document.getElementById('editor-subtools-container'))
	const tool_page_buttons = document.getElementById('tool-page-buttons')

	{ // Hard coded basic tools page.
		const basic = toolGroups.get('basic')
		const no_tool = createImageToolButton('No tool', '', `setTool('notool');update()`)
		no_tool.firstChild.setAttribute('checked', '')
		basic.append(no_tool, createImageToolButton('Remover', '', `setTool('remover');update()`))
		const basicToolsBtn = createToolPageButton('Basic', 'basic')
		basicToolsBtn.firstChild.setAttribute('checked', '')
		tool_page_buttons.appendChild(basicToolsBtn)
	}

	// Init the toolpages.
	JSON.parse((await requestHttpResource({ url: '/toolpages.json' })).responseText).forEach((page) => {
		toolGroups.set(page.group, document.createElement('div'))
		tool_page_buttons.appendChild(createToolPageButton(page.title, page.group))
	})
	setToolPage('basic')
	loadToolPages(getAssetConfig())
}

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
		})
	})
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
	})
	target.appendChild(table)
	target.appendChild(createHR())
}

function createImageToolButton(title, imgurl, onchange) {
	const label = formElement('label', [[ 'class', 'image-tool' ]])
	label.append(
		formElement('input', [
			[ 'type', 'radio' ],
			[ 'name', 'tool-button' ],
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

const createHeader = (header) => formElement('p', [[ 'class', 'sidebar-header' ]], header)
const createHR = () => formElement('hr', [[ 'class', 'sidebar-hr' ]])
const createFlexTable = () => formElement('div', [[ 'class', 'flex-table' ]])
/*
 * END SEGMENT
 */


 /**
 * @param {string} tag 
 * @param {string[][]} attribs 
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
	loadSlides,
	appendSlide,
	constructLeftEditorSidebar,
	constructRightEditorSidebar,
	createHeader,
	createHR,
	createFlexTable,
	formElement
}
