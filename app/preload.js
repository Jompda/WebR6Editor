import {
	constructLeftEditorSidebar,
	constructRightEditorSidebar
} from './gui.js'

//'https://jompda.github.io/WebR6Editor/'
const resourceURL = 'https://raw.githubusercontent.com/Jompda/Jompda.github.io/main/WebR6Editor/'


var assetConfig
const getAssetConfig = () => assetConfig
/**@type {Map<string,Object>}*/
const assets = new Map()


/**
 * @param {{method: string, url: string, body: string, headers: Object}} param0 
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
window.preload = async function() {
	// Assets are essential for the whole app.
	prepareAssets(assetConfig = JSON.parse((await requestHttpResource({ url: '/assets.json' })).responseText))

	// TODO: Check if edit-mode is enabled
	requestHttpResource({ url: '/UI/sidebar-left.html' }).then(constructLeftEditorSidebar)
	requestHttpResource({ url: '/UI/sidebar-right.html' }).then(constructRightEditorSidebar)
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
}

export {
	requestHttpResource,
	resourceURL,
	getAssetConfig,
	assets
}
