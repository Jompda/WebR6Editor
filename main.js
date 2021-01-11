import { getTool, setTool } from './toolhandler.js';
import {
    getTranslateX, setTranslateX,
    getTranslateY, setTranslateY,
    getZoom, setZoom
} from './controller.js';
import { resourceURL } from './preload.js';
import { getSelectedObject, showObjectProperties } from './gui.js';
import Obj from './objects/obj.js';
import ImagePlacer from './tools/imageplacer.js';

document.getElementsByTagName('body')[0].setAttribute('onresize', 'windowResized()');
const viewport = document.getElementById('viewport');
const imageobj_size = 100;
var bg_image;
var canvas;
/**@type {Obj[]}*/
const objects = [];

window.windowResized = () =>
    update(resizeCanvas(viewport.offsetWidth, viewport.offsetHeight));

window.setup = function setup() {
    bg_image = createImage(1,1); // Just to avoid background-image drawing errors.
    setTool('notool');
    canvas = createCanvas(viewport.offsetWidth, viewport.offsetHeight);
    canvas.parent(viewport);

    document.oncontextmenu = () => false;
    update();
}

var scheduledUpdate = false;
const update = () => scheduledUpdate = true;
window.update = update;

window.draw = function draw() {
    if (!scheduledUpdate) return;
    scheduledUpdate = false;

    showObjectProperties(getSelectedObject());

    //const srdate = new Date();

    // Basic setup.
    clear();
    translate(getTranslateX(), getTranslateY());
    scale(getZoom());
    
    // Background image.
    image(bg_image, 0, 0);

    // Objects.
    for (let i = objects.length-1; i > -1; i--) {
        push();
        const tempObj = objects[i];
        translate(tempObj.x, tempObj.y);
        tempObj.draw();
        pop();
    }

    // Selected object's highlight.
    const selobj = getSelectedObject();
    if (selobj) {
        push(); selobj.drawEditMode(getTool().editAllowed); pop();
    }

    //const renderTime = new Date()-srdate;
    //console.log(`${renderTime} millisecond${renderTime==1?'':'s'} render time.`);
}

function getIntersectingObject(x, y) {
    for (let i = 0; i < objects.length; i++)
        if (objects[i].intersects(x, y))
            return { obj: objects[i], i };
}

function changeMap(name) {
    if (name !== '-----') {
        bg_image = loadImage(`${resourceURL}assets/maps/${name}.jpg`, focusToImage);
        
        function focusToImage(img) {
            // Focus the viewport to the background-image.
            const tx = -(img.width/2 - width/2), zoom = 1;
            setTranslateX(tx);
            setTranslateY(0);

            // Alter the zoom.
            setZoom(zoom);
            let zoomDelta = (height / img.height)-zoom;

            // Keep the translation focused on the
            // same point with the new zoom.
            setTranslateX(tx-(width/2-tx)/zoom * zoomDelta);
            setZoom(zoom+zoomDelta);

            update();
        }
    }
}
window.changeMap = changeMap;

/**
 * Loads images and possibly strats from json files in the future.
 * @param {DragEvent} event 
 */
window.dropHandler = function dropHandler(event) {
    event.preventDefault();

    if (event.dataTransfer.items) {
        const fileArray = event.dataTransfer.items;
        for (let i = 0; i < fileArray.length; i++)
            if (fileArray[i].kind === 'file')
                handleFile(fileArray[i].getAsFile());
    } else {
        const fileArray = event.dataTransfer.files;
        for (let i = 0; i < fileArray.length; i++)
            handleFile(fileArray[i].getAsFile());
    }

    /**
     * @param {File} file 
     */
    function handleFile(file) {
        console.log(`Processing file '${file.name}'.`);

        const reader = new FileReader();
        reader.onload = (file) => {
            // Save the target location until the image is loaded.
            const posX = mouseX, posY = mouseY;
            loadImage(file.target.result, (img) => ImagePlacer.placeImage(img, posX, posY));
        }
        reader.readAsDataURL(file);
    }
}

const getObjects = () => objects;

export {
    imageobj_size,
    getObjects,
    update,
    getIntersectingObject,
    changeMap
};

// Init the IO module.
import { loadScene, saveScene } from './io.js';