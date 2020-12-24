
const preloadedImages = new Map();

const resourceURL = 'https://jompda.github.io/WebR6Editor/';

function changeMap(name) {
    if (name !== '-----')
        bg_image = loadImage(`${resourceURL}assets/maps/${name}.jpg`, update);
}

const viewport = document.getElementById('viewport');
const sidebar_left = document.getElementById('sidebar-left');
const sidebar_right = document.getElementById('sidebar-right');
var sidebar_left_toggle;
var sidebar_right_toggle;

function getHttpResource(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url); xhr.send();
    xhr.onerror = () => console.log(`Error ${url} => ${xhr.status}: ${xhr.statusText}`);
    xhr.onload = () => {
        if (xhr.status != 200) return xhr.onerror();
        callback(xhr);
    }
}

function preload() {
    bg_image = createImage(1,1); // Just to avoid background-image drawing errors.
    getHttpResource('/UI/sidebar-left.html', (sbleftxhr) => {
        sidebar_left.innerHTML = sbleftxhr.responseText;
        sidebar_left_toggle = document.getElementById('sidebar-left-toggle');
        getHttpResource('/maps.json', loadMapList);
    });
    getHttpResource('/UI/sidebar-right.html', (sbrightxhr) => {
        sidebar_right.innerHTML = sbrightxhr.responseText;
        sidebar_right_toggle = document.getElementById('sidebar-right-toggle');
        ToolHandler.subtools_container = document.getElementById('subtools-container');
        const tool_page_buttons = document.getElementById('tool-page-buttons');
        {
            // Hard coded basic tools page.
            ToolHandler.toolGroups.get('basic').appendChild(GUI.createToolButton('Remover'));
            const basicToolsBtn = GUI.createToolPageButton('Basic', 'basic');
            basicToolsBtn.firstChild.setAttribute('checked', '');
            tool_page_buttons.appendChild(basicToolsBtn);
        }

        // Init the toolpage.
        getHttpResource('/toolpages.json', (toolpagesxhr) => {
            const toolpagesConfig = JSON.parse(toolpagesxhr.responseText);
            toolpagesConfig.forEach((page) => {
                ToolHandler.toolGroups.set(page.group, document.createElement('div'));
                tool_page_buttons.appendChild(GUI.createToolPageButton(page.title, page.group));
            });
            
            // Load the tools
            ToolHandler.setSubTools('basic');
            getHttpResource('/assets.json', loadAssetList);
        });
    });
}

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

function loadAssetList(xhr) {
    const assetConfig = JSON.parse(xhr.responseText);
    assetConfig.forEach((group) => {
        const matchingPage = ToolHandler.toolGroups.get(group.page);
        createImageToolGroup(matchingPage, group);
    });
}

function createImageToolGroup(target, group) {
    target.appendChild(GUI.createHeader(group.name));
    const table = GUI.createFlexTable();
    for (let i = 0; i < group.assets.length; i++) {
        const tempAsset = group.assets[i];
        const imageTool = GUI.createImageTool(group.path, tempAsset[0], tempAsset[1], group.extension);
        table.appendChild(imageTool);
    }
    target.appendChild(table);
    target.appendChild(GUI.createHR());
}
