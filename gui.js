import Obj from './objects/obj';
import { sidebar_left, sidebar_right } from './preload';

// Object selection functionality.
var selectedObject;
/**@returns {Obj}*/
const getSelectedObject = () => selectedObject;
window.getSelectedObject = getSelectedObject;
/**
 * Sets the selected object variable and calls showObjectProperties().
 * @param {Obj} obj
 * @returns {Obj}
 */
function setSelectedObject(obj) {
    showObjectProperties(selectedObject = obj);
    return obj;
}
window.setSelectedObject = setSelectedObject;

/**
 * @param {Obj} obj 
 */
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
function createImageToolButton(title, imgurl, onchange) {
    const label = formElement('label', [[ 'class', 'imagetool' ]]);
    label.append(
        formElement('input', [
            [ 'type', 'radio' ],
            [ 'name', 'tool' ],
            [ 'onchange', onchange ]
        ]),
        formElement('img', [
            [ 'src', imgurl ],
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
    createImageToolButton,
    createToolPageButton,
    createToolButton,
    createHeader,
    createHR,
    createFlexTable,
    formElement
};
