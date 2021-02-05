import Tool from './tools/tool.js'
import Remover from './tools/remover.js'
import ImagePlacer from './tools/imageplacer.js'


/**
 * Toolpages functionality
 * @type {Map<string, HTMLElement>}
 */
const toolGroups = new Map([
	[ 'basic', document.createElement('div') ]
])

/**@type {HTMLElement}*/ var subtools_container
/**@param {HTMLElement} element*/
const setToolPageContainer = (element) => subtools_container = element

/**@param {string} group the group name in toolGroups*/
const setToolPage = window.setToolPage = (group) => {
	clearSelectedTool()
	if (subtools_container.firstChild) subtools_container.removeChild(subtools_container.firstChild)
	subtools_container.appendChild(toolGroups.get(group))
}

const clearSelectedTool = () =>
	document.getElementsByName('tool-button').forEach((elem) => elem.checked = false)


// Tool functionality.
/**@type {Map<string, Tool>}*/ const tools = new Map()
/**@type {Tool}*/
var tool
const getTool = () => tool
/**
 * @param {string} name 
 * @param {string=} options 
 * @returns {Tool=}
 */
const setTool = window.setTool = (name, options) => {
	const ctool = tools.get(name)
	if (!ctool) return;
	if (options) ctool.options = JSON.parse(options)
	return tool = ctool
}


// Outline functionality.
/**@type {color}*/
var outline
const getOutline = () => outline;
/**
 * @param {color=} newOutline 
 */
const setOutline = window.setOutline = (newOutline) => outline = newOutline


// Temporary way of initializing the tools.
tools.set('notool', new Tool())
tools.set('remover', new Remover())
tools.set('imageplacer', new ImagePlacer())
setTool('notool')

export {
	setToolPageContainer,
	toolGroups,
	getTool, setTool,
	getOutline, setOutline,
	setToolPage
}
