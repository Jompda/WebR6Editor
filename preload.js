import { changeMap } from './sketch.js';
import { setToolPageContainer, setToolPage, toolGroups } from './toolhandler.js';
import {
    createToolPageButton,
    createHeader,
    createFlexTable,
    createImageToolButton,
    createHR
} from './gui.js';

const resourceURL = 'https://jompda.github.io/WebR6Editor/';
/**@type {Map<String, image>}*/ const preloadedImages = new Map();

const sidebar_left = document.getElementById('sidebar-left');
const sidebar_right = document.getElementById('sidebar-right');
/**@type {HTMLElement}*/ var sidebar_left_toggle;
/**@type {HTMLElement}*/ var sidebar_right_toggle;

/**
 * @param {String} url 
 * @param {handleXMLHttpRequestResource} callback 
 */
function getHttpResource(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url); xhr.send();
    xhr.onerror = () => console.log(`Error ${url} => ${xhr.status}: ${xhr.statusText}`);
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
 * and preloading the resources such as the images.
 */
window.preload = function preload() {
    getHttpResource('/UI/sidebar-left.html', (sbleftxhr) => {
        sidebar_left.innerHTML = sbleftxhr.responseText;
        sidebar_left_toggle = document.getElementById('sidebar-left-toggle');
        getHttpResource('/maps.json', loadMapList);
    });
    getHttpResource('/UI/sidebar-right.html', (sbrightxhr) => {
        sidebar_right.innerHTML = sbrightxhr.responseText;
        sidebar_right_toggle = document.getElementById('sidebar-right-toggle');
        setToolPageContainer(document.getElementById('subtools-container'));
        const tool_page_buttons = document.getElementById('tool-page-buttons');

        {   // Hard coded basic tools page.
            const basic = toolGroups.get('basic');
            const no_tool = createImageToolButton('No tool', '', `setTool('no tool');update();`);
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
    changeMap(`${mapConfig[0].name.toLowerCase()}/${mapConfig[0].floors[0][1]}`);
}

/**@param {XMLHttpRequest} xhr*/
function loadAssetList(xhr) {
    const assetConfig = JSON.parse(xhr.responseText);
    assetConfig.forEach((group) => {
        const matchingPage = toolGroups.get(group.page);
        createImagePlacerGroup(matchingPage, group);
    });
}

/**
 * @param {HTMLElement} target
 * @param {Object} group
 */
function createImagePlacerGroup(target, group) {
    target.appendChild(createHeader(group.name));
    const table = createFlexTable();
    for (let i = 0; i < group.assets.length; i++) {
        const tempAsset = group.assets[i];

        let filename = tempAsset[1];
        if (!filename) filename = tempAsset[0].toLowerCase();
        const filepath = group.path+filename+group.extension, assetURL = resourceURL + filepath;
        preloadedImages.set(filename, loadImage(assetURL)); // Preload the images for p5

        const imageTool = createImageToolButton(tempAsset[0], assetURL, `setTool('imageplacer', ['${filename}'])`);
        table.appendChild(imageTool);
    }
    target.appendChild(table);
    target.appendChild(createHR());
}

export {
    resourceURL,
    preloadedImages,
    getHttpResource,
    sidebar_left, sidebar_right,
    sidebar_left_toggle, sidebar_right_toggle
};