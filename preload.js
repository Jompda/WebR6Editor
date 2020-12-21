
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

var subtools_container;
var tools_tools; // Wtf is this name?
var attacker_tools;
var defender_tools;

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
    getHttpResource('/UI/sidebar-left.html', (xhr) => {
        sidebar_left.innerHTML = xhr.responseText;
        sidebar_left_toggle = document.getElementById('sidebar-left-toggle');
        getHttpResource('/maps.json', loadMapList);
    });
    getHttpResource('/UI/sidebar-right.html', (xhr) => {
        sidebar_right.innerHTML = xhr.responseText;
        sidebar_right_toggle = document.getElementById('sidebar-right-toggle');
        subtools_container = document.getElementById('subtools-container');
        attacker_tools = document.createElement('div');
        defender_tools = document.createElement('div');
        
        // Load the tools
        createTools();
        ToolHandler.setSubTools('tools');
        getHttpResource('/assets.json', loadAssetList);
    });
    changeMap('bank-1');
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
            option.setAttribute('value', floor[1]);
            if (map.esl) option.setAttribute('class', 'map-pool-esl');
            option.innerHTML = `${map.name} ${floor[0]}`;
            mapchooserElem.appendChild(option);
        });
    });
}

function loadAssetList(xhr) {
    const assetConfig = JSON.parse(xhr.responseText);
    console.log(assetConfig);
    const attackerGroups = [], defenderGroups = [];
    assetConfig.forEach((group) => {
        switch (group.page) {
            case 'attackers': attackerGroups.push(group); break;
            case 'defenders': defenderGroups.push(group); break;
            default: console.log('ERROR: Unknown group:', group); break;
        }
    });
    createImageToolPage(attacker_tools, attackerGroups);
    createImageToolPage(defender_tools, defenderGroups);
}

function createImageToolPage(target, groups) {
    // Create sections from the groups.
    groups.forEach((group) => {
        target.appendChild(createHeader(group.name));
        var center = createDivCenter(), rowWidth = 0;
        target.appendChild(center);
        for (let i = 0; i < group.assets.length; i++) {
            const tempAsset = group.assets[i];

            // Calculate the width of each element and if the total
            // width exceeds the reserved space, continue on a new row.
            const imageTool = createImageTool(group.path, tempAsset[0], tempAsset[1], group.extension, tempAsset[2]);
            // Sad way of acquiring the width of the element. UPDATE: This doesn't work.
            // In order for this kind of width calculation to work, the images would need to be preloaded.
            tools_tools.appendChild(imageTool);
            rowWidth += imageTool.getBoundingClientRect().width;
            tools_tools.removeChild(imageTool);

            if (rowWidth >= 84) {
                center = createDivCenter();
                target.appendChild(center);
                rowWidth = 0;
            }

            center.appendChild(imageTool);
        }
        target.appendChild(createHR());
    });
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
function createTools() {
    tools_tools = document.createElement('div');
    tools_tools.appendChild(createToolButton('Remover'));
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
function createDivCenter() {
    let elem = document.createElement('div');
    elem.setAttribute('class', 'center');
    return elem;
}
