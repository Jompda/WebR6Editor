import { changeMap } from './main.js';
import { setToolPageContainer, setToolPage, toolGroups } from './toolhandler.js';
import {
	createToolPageButton,
	createHeader,
	createFlexTable,
	createImageToolButton,
	createHR
} from './gui.js';

//'https://jompda.github.io/WebR6Editor/'
const resourceURL = 'https://raw.githubusercontent.com/Jompda/Jompda.github.io/main/WebR6Editor/';

/**@type {Map<String,Object>} */
const assets = new Map();
const getAssets = () => assets;

const sidebar_left = document.getElementById('sidebar-left');
const sidebar_right = document.getElementById('sidebar-right');

/**
 * @param {String} url 
 * @param {handleXMLHttpRequestResource} callback 
 * @param {Function} onerror 
 */
function getHttpResource(url, callback, onerror) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', url); xhr.send();
	if (onerror) xhr.onerror = () => onerror(xhr);
	else xhr.onerror = () => console.log(`Error ${url} => ${xhr.status}: ${xhr.statusText}`);
	xhr.onload = () => {
		if (xhr.status != 200) return xhr.onerror();
		callback(xhr);
	}
}
/**@param {XMLHttpRequest} xhr*/
function handleXMLHttpRequestResource(xhr) {}

/**
 * Preload function called by the p5js library before setup.
 * Is in charge of building the GUI (sidebars), setting up the tools,
 * and preloading the assets.
 */
window.preload = function preload() {
	getHttpResource('/UI/sidebar-left.html', (sbleftxhr) => {
		sidebar_left.innerHTML = sbleftxhr.responseText;
		getHttpResource('/maps.json', loadMapList);
	});
	getHttpResource('/UI/sidebar-right.html', (sbrightxhr) => {
		sidebar_right.innerHTML = sbrightxhr.responseText;
		setToolPageContainer(document.getElementById('subtools-container'));
		const tool_page_buttons = document.getElementById('tool-page-buttons');

		{   // Hard coded basic tools page.
			const basic = toolGroups.get('basic');
			const no_tool = createImageToolButton('No tool', '', `setTool('notool');update();`);
			no_tool.firstChild.setAttribute('checked', '');
			basic.append(no_tool, createImageToolButton('Remover', '', `setTool('remover');update();`));
			const basicToolsBtn = createToolPageButton('Basic', 'basic');
			basicToolsBtn.firstChild.setAttribute('checked', '');
			tool_page_buttons.appendChild(basicToolsBtn);
		}

		// Init the toolpage.
		getHttpResource('/toolpages.json', (toolpagesxhr) => {
			const toolpagesConfig = JSON.parse(toolpagesxhr.responseText);
			toolpagesConfig.forEach((page) => {
				toolGroups.set(page.group, document.createElement('div'));
				tool_page_buttons.appendChild(createToolPageButton(page.title, page.group));
			});
			
			// Load the tools
			setToolPage('basic');
			getHttpResource('/assets.json', loadAssetList);
		});
	});
}

/**@param {XMLHttpRequest} xhr*/
function loadMapList(xhr) {
	const mapConfig = JSON.parse(xhr.responseText);
	const mapchooserElem = document.getElementById('mapchooser');
	mapConfig.forEach((map, i) => {
		if (i > 0) {
			const line = document.createElement('option');
			line.innerHTML = '-----';
			mapchooserElem.appendChild(line);
		}
		map.floors.forEach((floor) => {
			const option = document.createElement('option');
			option.setAttribute('value', `${map.name.toLowerCase()}/${floor[1]}`);
			if (map.esl) option.setAttribute('class', 'map-pool-esl');
			option.innerHTML = `${map.name} ${floor[0]}`;
			mapchooserElem.appendChild(option);
		});
	});
	changeMap(`assets/maps/${mapConfig[0].name.toLowerCase()}/${mapConfig[0].floors[0][1]}.jpg`);
}

/**@param {XMLHttpRequest} xhr*/
function loadAssetList(xhr) {
	const assetConfig = JSON.parse(xhr.responseText);
	assetConfig.forEach((group) => {
		const matchingPage = toolGroups.get(group.page);
		createImagePlacerGroup(matchingPage, group);
	});
	console.log(assets);
}

/**
 * @param {HTMLElement} target
 * @param {Object} group
 */
function createImagePlacerGroup(target, group) {
	target.appendChild(createHeader(group.name));
	const table = createFlexTable();
	group.assets.forEach((rawAsset) => {
		const filename = rawAsset[1] ?
			rawAsset[1] : rawAsset[0].toLowerCase();

		// Prepare the asset.
		const asset = {
			filename,
			path: group.path,
			extension: group.extension
		};
		// Additional options
		if (rawAsset[2]) asset.options = rawAsset[2];
		assets.set(filename, asset);

		const toolOptions = { assetId: filename };

		const imageTool = createImageToolButton(rawAsset[0], resourceURL + group.path + filename + group.extension,
			`setTool('imageplacer', '${JSON.stringify(toolOptions)}')`);
		table.appendChild(imageTool);
	});
	target.appendChild(table);
	target.appendChild(createHR());
}

export {
	resourceURL,
	getAssets,
	getHttpResource,
	sidebar_left, sidebar_right
};