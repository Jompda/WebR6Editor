
const preloadedImages = new Map();

var bg_image;
function changeMap(name) {
    if(!name.includes('-----'))
        bg_image = loadImage(`assets/maps/${name}.jpg`);
        update();
}

const sidebar_left = document.getElementById('sidebar-left');
const sidebar_right = document.getElementById('sidebar-right');
var sidebar_left_toggle;
var sidebar_right_toggle;

function getHttpResource(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url); xhr.send();
    xhr.onerror = () => console.log(`Error ${xhr.status}: ${xhr.statusText}`);
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
            ToolHandler.toolGroups.get('basic').appendChild(createToolButton('Remover'));
            const basicToolsBtn = createToolPageButton('Basic', 'basic');
            basicToolsBtn.firstChild.setAttribute('checked', '');
            tool_page_buttons.appendChild(basicToolsBtn);
        }

        // Init the toolpage.
        getHttpResource('/toolpages.json', (toolpagesxhr) => {
            const toolpagesConfig = JSON.parse(toolpagesxhr.responseText);
            toolpagesConfig.forEach((page) => {
                ToolHandler.toolGroups.set(page.group, document.createElement('div'));
                tool_page_buttons.appendChild(createToolPageButton(page.title, page.group));
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
            option.setAttribute('value', `${map.name}/${floor[1]}`);
            if (map.esl) option.setAttribute('class', 'map-pool-esl');
            option.innerHTML = `${map.name} ${floor[0]}`;
            mapchooserElem.appendChild(option);
        });
    });
    changeMap(`${mapConfig[0].name}/${mapConfig[0].floors[0][1]}`);
}

function loadAssetList(xhr) {
    const assetConfig = JSON.parse(xhr.responseText);
    assetConfig.forEach((group) => {
        const matchingPage = ToolHandler.toolGroups.get(group.page);
        createImageToolGroup(matchingPage, group);
    });
}

function createImageToolGroup(target, group) {
    target.appendChild(createHeader(group.name));
    const table = createFlexTable();
    for (let i = 0; i < group.assets.length; i++) {
        const tempAsset = group.assets[i];
        const imageTool = createImageTool(group.path, tempAsset[0], tempAsset[1], group.extension, tempAsset[2]);
        table.appendChild(imageTool);
    }
    target.appendChild(table);
    target.appendChild(createHR());
}

function createImageTool(path, title, filename, extension, owner) {
    if(!filename) filename = title.toLowerCase();
    const elem = document.createElement('label');
    elem.setAttribute('class', 'imagetool');
    const r = document.createElement('input');
    r.setAttribute('type', 'radio');
    r.setAttribute('name', 'tool');
    const filepath = path+filename+extension;
    preloadedImages.set(filename, loadImage(filepath)); // Preload the images for p5
    r.setAttribute('onchange', `ToolHandler.setImageTool('${filename}')`);
    const i = document.createElement('img');
    i.setAttribute('src', filepath);
    i.setAttribute('title', title);
    elem.appendChild(r);
    elem.appendChild(i);
    return elem;
}


// Sidebar functionality.
function sidebarLeftToggle() {
    if(!sidebar_left.style.left) sidebar_left.style.left = '0px';
    if(sidebar_left.style.left == '0px') sidebar_left.style.left = '-301px';
    else sidebar_left.style.left = '0px';
}
function sidebarRightToggle() {
    if(!sidebar_right.style.right) sidebar_right.style.right = '0px';
    if(sidebar_right.style.right == '0px') sidebar_right.style.right = '-301px';
    else sidebar_right.style.right = '0px';
}


// Functions to create HTML elements.
function createToolPageButton(title, group) {
    const label = document.createElement('label');
    label.setAttribute('class', 'tool-page-button');
    // First Should be checked.
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'tool-page-button');
    input.setAttribute('onchange', `ToolHandler.setSubTools('${group}');`);
    const txt = document.createElement('div');
    txt.innerHTML = title;
    label.appendChild(input);
    label.appendChild(txt);
    return label;
}
function createToolButton(title) {
    let elem = document.createElement('button');
    elem.setAttribute('class', 'toolbutton');
    elem.setAttribute('onclick', `ToolHandler.setTool('${title.toLowerCase()}')`);
    elem.innerHTML = title;
    return elem;
}
function createHeader(text) {
    let elem = document.createElement('p');
    elem.setAttribute('class', 'sidebar-header');
    elem.innerHTML = text;
    return elem;
}
function createHR() {
    let elem = document.createElement('hr');
    elem.setAttribute('class', 'sidebar-hr');
    return elem;
}
function createFlexTable() {
    let elem = document.createElement('div');
    elem.setAttribute('class', 'flex-table');
    return elem;
}
