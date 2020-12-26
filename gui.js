import { resourceURL, preloadedImages, sidebar_left, sidebar_right } from './preload.js';

// Still unimplemented functionality.
function showObjectProperties(obj) {
    console.log('showObjectProperties:', obj);
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

    const label = formElement('label', [ 'class', 'imagetool' ]);
    label.appendChild(formElement('input',
        [ 'type', 'radio' ],
        [ 'name', 'tool' ],
        [ 'onchange', `setTool('imageplacer', ['${filename}'])` ]
    ));
    label.appendChild(formElement('img',
        [ 'src', assetURL ],
        [ 'title', title ]
    ));
    return label;
}

function createToolPageButton(title, group) {
    const label = formElement('label', [ 'class', 'tool-page-button' ]);
    const input = formElement('input',
        [ 'type', 'radio' ],
        [ 'name', 'tool-page-button' ],
        [ 'onchange', `setSubTools('${group}');` ]
    );
    const txt = document.createElement('div');
    txt.innerHTML = title;
    label.appendChild(input);
    label.appendChild(txt);
    return label;
}

function createToolButton(title) {
    const elem = formElement('button', [ 'class', 'toolbutton' ],
        [ 'onclick', `setTool('${title.toLowerCase()}')` ]);
    elem.innerHTML = title;
    return elem;
}

function createHeader(header) {
    const elem = formElement('p', [ 'class', 'sidebar-header' ]);
    elem.innerHTML = header;
    return elem;
}

const createHR = () => formElement('hr', [ 'class', 'sidebar-hr' ]);
const createFlexTable = () => formElement('div', [ 'class', 'flex-table' ]);

function formElement(tag, ...attribs) {
    const elem = document.createElement(tag);
    attribs.forEach(attrib => elem.setAttribute(attrib[0], attrib[1]));
    return elem;
}

export {
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
