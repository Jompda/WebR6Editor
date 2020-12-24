
class GUI {

    // Sidebar functionality.
    static sidebarLeftToggle() {
        if (!sidebar_left.style.left) sidebar_left.style.left = '0px';
        if (sidebar_left.style.left == '0px') sidebar_left.style.left = '-301px';
        else sidebar_left.style.left = '0px';
    }
    static sidebarRightToggle() {
        if (!sidebar_right.style.right) sidebar_right.style.right = '0px';
        if (sidebar_right.style.right == '0px') sidebar_right.style.right = '-301px';
        else sidebar_right.style.right = '0px';
    }

    // Functions to create HTML elements.
    static createImageTool(path, title, filename, extension) {
        if(!filename) filename = title.toLowerCase();
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
    }
    static createToolPageButton(title, group) {
        const label = this.formElement('label', [ 'class', 'tool-page-button' ]);
        const input = this.formElement('input',
            [ 'type', 'radio' ],
            [ 'name', 'tool-page-button' ],
            [ 'onchange', `ToolHandler.setSubTools('${group}');` ]
        );
        const txt = document.createElement('div');
        txt.innerHTML = title;
        label.appendChild(input);
        label.appendChild(txt);
        return label;
    }
    static createToolButton(title) {
        const elem = this.formElement('button', [ 'class', 'toolbutton' ],
            [ 'onclick', `ToolHandler.setTool('${title.toLowerCase()}')` ]);
        elem.innerHTML = title;
        return elem;
    }
    static createHeader(header) {
        const elem = this.formElement('p', [ 'class', 'sidebar-header' ]);
        elem.innerHTML = header;
        return elem;
    }
    static createHR = () => this.formElement('hr', [ 'class', 'sidebar-hr' ]);
    static createFlexTable = () => this.formElement('div', [ 'class', 'flex-table' ]);

    static formElement(tag, ...attribs) {
        const elem = document.createElement(tag);
        attribs.forEach(attrib => elem.setAttribute(attrib[0], attrib[1]));
        return elem;
    }

}
