
const GUI = {

    // Still unimplemented functionality.
    showObjectProperties(obj) {
        console.log('showObjectProperties:', obj);
    },

    // Sidebar functionality.
    sidebarLeftToggle() {
        if (!sidebar_left.style.left) sidebar_left.style.left = '0px';
        if (sidebar_left.style.left == '0px') sidebar_left.style.left = '-301px';
        else sidebar_left.style.left = '0px';
    },
    sidebarRightToggle() {
        if (!sidebar_right.style.right) sidebar_right.style.right = '0px';
        if (sidebar_right.style.right == '0px') sidebar_right.style.right = '-301px';
        else sidebar_right.style.right = '0px';
    },

    // Functions to create HTML elements.
    createImageTool(path, title, filename, extension) {
        if (!filename) filename = title.toLowerCase();
        const filepath = path+filename+extension, assetURL = resourceURL + filepath;
        preloadedImages.set(filename, loadImage(assetURL)); // Preload the images for p5
    
        const label = GUI.formElement('label', [ 'class', 'imagetool' ]);
        label.appendChild(GUI.formElement('input',
            [ 'type', 'radio' ],
            [ 'name', 'tool' ],
            [ 'onchange', `ToolHandler.setImageTool('${filename}')` ]
        ));
        label.appendChild(GUI.formElement('img',
            [ 'src', assetURL ],
            [ 'title', title ]
        ));
        return label;
    },
    createToolPageButton(title, group) {
        const label = GUI.formElement('label', [ 'class', 'tool-page-button' ]);
        const input = GUI.formElement('input',
            [ 'type', 'radio' ],
            [ 'name', 'tool-page-button' ],
            [ 'onchange', `ToolHandler.setSubTools('${group}');` ]
        );
        const txt = document.createElement('div');
        txt.innerHTML = title;
        label.appendChild(input);
        label.appendChild(txt);
        return label;
    },
    createToolButton(title) {
        const elem = GUI.formElement('button', [ 'class', 'toolbutton' ],
            [ 'onclick', `ToolHandler.setTool('${title.toLowerCase()}')` ]);
        elem.innerHTML = title;
        return elem;
    },
    createHeader(header) {
        const elem = GUI.formElement('p', [ 'class', 'sidebar-header' ]);
        elem.innerHTML = header;
        return elem;
    },
    createHR: () => GUI.formElement('hr', [ 'class', 'sidebar-hr' ]),
    createFlexTable: () => GUI.formElement('div', [ 'class', 'flex-table' ]),

    formElement(tag, ...attribs) {
        const elem = document.createElement(tag);
        attribs.forEach(attrib => elem.setAttribute(attrib[0], attrib[1]));
        return elem;
    }

}
