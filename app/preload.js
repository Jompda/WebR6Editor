import { setToolPageContainer, setToolPage, toolGroups } from './toolhandler.js'
import {
	createToolPageButton,
	createImageToolButton,
	loadMapList,
	loadToolPages
} from './gui.js'

//'https://jompda.github.io/WebR6Editor/'
const resourceURL = 'https://raw.githubusercontent.com/Jompda/Jompda.github.io/main/WebR6Editor/'

/**@type {Map<String,Object>}*/
const assets = new Map()


/**
 * @param {{method: String, url: String, body: String, headers: Object}} param0 
 * @returns {Promise<XMLHttpRequest, XMLHttpRequest>}
 */
async function requestHttpResource({ method = 'GET', url, body, headers }) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open(method, url)
		if (headers) Object.getOwnPropertyNames(headers).forEach((headerName) =>
			xhr.setRequestHeader(headerName, headers[headerName])
		)
		xhr.send(body)
		xhr.onerror = () => reject(xhr)
		xhr.onload = () => {
			if (xhr.status != 200) return reject(xhr)
			resolve(xhr)
		}
	})
}

/**
 * Called by the p5js library before setup.
 * Is in charge of building the GUI (sidebars), setting up the tools,
 * and preloading the assets.
 */
window.preload = function() {
	requestHttpResource({ url: '/UI/sidebar-left.html' }).then(async (sbleftxhr) => {
		$('#editor-sidebar-left-wrapper').append($.parseHTML(sbleftxhr.responseText))
		loadMapList(JSON.parse((await requestHttpResource({ url: '/maps.json' })).responseText))
	})
	requestHttpResource({ url: '/UI/sidebar-right.html' }).then(async (sbrightxhr) => {
		$('#editor-sidebar-right-wrapper').append($.parseHTML(sbrightxhr.responseText))
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
		JSON.parse((await requestHttpResource({ url: '/toolpages.json' })).responseText).forEach((page) => {
			toolGroups.set(page.group, document.createElement('div'))
			tool_page_buttons.appendChild(createToolPageButton(page.title, page.group))
		})
		
		// Load the tools
		setToolPage('basic')
		loadToolPages(prepareAssets(JSON.parse((await requestHttpResource({ url: '/assets.json' })).responseText)))
	})
}

function prepareAssets(assetConfig) {
	assetConfig.forEach((group) => {
		group.assets.forEach((rawAsset) => {
			const filename = rawAsset[1] ?
				rawAsset[1] : rawAsset[0].toLowerCase()
	
			// Prepare the asset.
			const asset = { path: group.path, filename }
			// Additional options
			if (rawAsset[2]) asset.options = rawAsset[2]
			assets.set(filename, asset)
		})
	})
	return assetConfig
}

export {
	resourceURL,
	assets,
	requestHttpResource
}
