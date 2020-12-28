import Obj from './objects/obj.js';
import { resourceURL, preloadedImages, sidebar_left, sidebar_right } from './preload.js';

// Object selection functionality.
var selectedObject;
/**@returns {Obj}*/
const getSelectedObject = () => selectedObject;
window.getSelectedObject = getSelectedObject;
/**@param {Obj} obj*/
function setSelectedObject(obj) {
    selectedObject = obj;
}
window.setSelectedObject = setSelectedObject;

function showObjectProperties(obj) {
    const object_properties = document.getElementById('object-properties');
    if (object_properties.firstChild) object_properties.removeChild(object_properties.firstChild);
    if (obj) object_properties.appendChild(obj.getObjectPropertiesGUI());
}


// Sidebar functionality.
function sidebarLeftToggle() {
    if (!sidebar_left.style.left) sidebar_left.style.left = '0px';
    if (sidebar_left.style.left == '0px') sidebar_left.style.left = '-301px';
    else sidebar_left.style.left = '0px';
}
window.sidebarLeftToggle = sidebarLeftToggle;

function sidebarRightToggle() {
    if (!sidebar_right.style.right) sidebar_right.style.right = '0px';
    if (sidebar_right.style.right == '0px') sidebar_right.style.right = '-301px';
    else sidebar_right.style.right = '0px';
}
window.sidebarRightToggle = sidebarRightToggle;


// Functions to create HTML elements.
function createImageTool(path, title, filename, extension) {
    if (!filename) filename = title.toLowerCase();
    const filepath = path+filename+extension, assetURL = resourceURL + filepath;
    preloadedImages.set(filename, loadImage(assetURL)); // Preload the images for p5

    const label = formElement('label', [[ 'class', 'imagetool' ]]);
    label.append(
        formElement('input', [
            [ 'type', 'radio' ],
            [ 'name', 'tool' ],
            [ 'onchange', `setTool('imageplacer', ['${filename}'])` ]
        ]),
        formElement('img', [
            [ 'src', assetURL ],
            [ 'title', title ]
        ])
    );
    return label;
}

function createToolPageButton(title, group) {
    const label = formElement('label', [[ 'class', 'tool-page-button' ]]);
    const input = formElement('input', [
        [ 'type', 'radio' ],
        [ 'name', 'tool-page-button' ],
        [ 'onchange', `setToolPage('${group}');` ]
    ]);
    const txt = document.createElement('div');
    txt.innerHTML = title;
    label.appendChild(input);
    label.appendChild(txt);
    return label;
}

function createToolButton(title) {
    return formElement('button', [
        [ 'class', 'toolbutton' ],
        [ 'onclick', `setTool('${title.toLowerCase()}')` ]
    ], title);
}

const createHeader = (header) => formElement('p', [[ 'class', 'sidebar-header' ]], header);
const createHR = () => formElement('hr', [[ 'class', 'sidebar-hr' ]]);
const createFlexTable = () => formElement('div', [[ 'class', 'flex-table' ]]);

/**
 * @param {String} tag 
 * @param {String[][]} attribs 
 * @param {HTMLElement} innerHTML 
 * @returns {HTMLElement}
 */
function formElement(tag, attribs, innerHTML) {
    const elem = document.createElement(tag);
    if (attribs) attribs.forEach(attrib => elem.setAttribute(attrib[0], attrib[1]));
    if (innerHTML) elem.innerHTML = innerHTML;
    return elem;
}

export {
    getSelectedObject, setSelectedObject,
    showObjectProperties,
    sidebarLeftToggle, sidebarRightToggle,
    createImageTool,
    createToolPageButton,
    createToolButton,
    createHeader,
    createHR,
    createFlexTable,
    formElement
};
