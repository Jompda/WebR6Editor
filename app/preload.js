import { setToolPageContainer, setToolPage, toolGroups } from './toolhandler.js'
import {
	createToolPageButton,
	createImageToolButton,
	loadMapList,
	loadAssetList
} from './gui.js'

//'https://jompda.github.io/WebR6Editor/'
const resourceURL = 'https://raw.githubusercontent.com/Jompda/Jompda.github.io/main/WebR6Editor/'

/**@type {Map<String,Object>}*/
const assets = new Map()
const getAssets = () => assets

const sidebar_left_wrapper = document.getElementById('editor-sidebar-left-wrapper')
const sidebar_right_wrapper = document.getElementById('editor-sidebar-right-wrapper')

/**
 * @param {handleXMLHttpRequestResource} callback 
 * @param {handleXMLHttpRequestResource} onerror 
 */
function requestHttpResource({ method = 'GET', url, body, headers }, callback, onerror) {
	const xhr = new XMLHttpRequest()
	xhr.open(method, url)
	if (headers) Object.getOwnPropertyNames(headers).forEach((headerName) =>
		xhr.setRequestHeader(headerName, headers[headerName])
	)
	xhr.send(body)
	onerror ? xhr.onerror = () => onerror(xhr) :
		xhr.onerror = () => console.log(`Error on request: ${method} ${url} => ${xhr.status}: ${xhr.statusText}`)
	xhr.onload = () => {
		if (xhr.status != 200) return xhr.onerror()
		callback(xhr)
	}
}
/**@param {XMLHttpRequest} xhr*/
function handleXMLHttpRequestResource(xhr) {}

/**
 * Called by the p5js library before setup.
 * Is in charge of building the GUI (sidebars), setting up the tools,
 * and preloading the assets.
 */
window.preload = function() {
	requestHttpResource({ url:'/UI/sidebar-left.html' }, (sbleftxhr) => {
		sidebar_left_wrapper.innerHTML = sbleftxhr.responseText
		requestHttpResource({ url:'/maps.json' }, (xhr) => loadMapList(JSON.parse(xhr.responseText)))
	})
	requestHttpResource({ url:'/UI/sidebar-right.html' }, (sbrightxhr) => {
		sidebar_right_wrapper.innerHTML = sbrightxhr.responseText
		setToolPageContainer(document.getElementById('editor-subtools-container'))
		const tool_page_buttons = document.getElementById('tool-page-buttons')

		{   // Hard coded basic tools page.
			const basic = toolGroups.get('basic')
			const no_tool = createImageToolButton('No tool', '', `setTool('notool');update()`)
			no_tool.firstChild.setAttribute('checked', '')
			basic.append(no_tool, createImageToolButton('Remover', '', `setTool('remover');update()`))
			const basicToolsBtn = createToolPageButton('Basic', 'basic')
			basicToolsBtn.firstChild.setAttribute('checked', '')
			tool_page_buttons.appendChild(basicToolsBtn)
		}

		// Init the toolpage.
		requestHttpResource({url:'/toolpages.json'}, (toolpagesxhr) => {
			const toolpagesConfig = JSON.parse(toolpagesxhr.responseText)
			toolpagesConfig.forEach((page) => {
				toolGroups.set(page.group, document.createElement('div'))
				tool_page_buttons.appendChild(createToolPageButton(page.title, page.group))
			})
			
			// Load the tools
			setToolPage('basic')
			requestHttpResource({ url:'/assets.json' }, (xhr) => loadAssetList(JSON.parse(xhr.responseText)))
		})
	})
}

export {
	resourceURL,
	getAssets,
	requestHttpResource,
	sidebar_left_wrapper, sidebar_right_wrapper
}
