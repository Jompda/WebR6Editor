import { getOutline, setTool } from './toolhandler.js';
import {
    mousePressed, mouseDragged, mouseReleased, mouseWheel,
    getTranslateX, setTranslateX, getTranslateY, setTranslateY, getZoom, setZoom
} from './controller.js';
import { preloadedImages, resourceURL } from './preload.js';
import { getSelectedObject, setSelectedObject, showObjectProperties } from './gui.js';
import Obj from './objects/obj.js';
import ImageObj from './objects/imageobj.js';


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
        console.log('Processing:', file.name);

        const reader = new FileReader();
        reader.onload = (event) => {
            preloadedImages.set(file.name, loadImage(event.target.result, (img) => {
                const aspect_ratio = img.width / img.height;
                const imgobj = new ImageObj(
                    (mouseX - getTranslateX())/getZoom() - imageobj_size*aspect_ratio/2, (mouseY - getTranslateY())/getZoom() - imageobj_size/2,
                    imageobj_size*aspect_ratio, imageobj_size, img, getOutline()
                );
                objects.unshift(imgobj);
                setSelectedObject(imgobj);
                showObjectProperties(imgobj);
                update();
            }));
        }
        reader.readAsDataURL(file);  
    }
}


// Set the viewport events so the controller works.
var mouseOnViewport = true;
const viewport = document.getElementById('viewport');
viewport.onmouseenter = () => mouseOnViewport = true;
viewport.onmouseleave = () => mouseOnViewport = false;
viewport.onmousedown = (e) => mouseOnViewport ? mousePressed(e) : undefined;
viewport.onmouseup = (e) => mouseOnViewport ? mouseReleased(e) : undefined;
window.mouseDragged = (e) => {
    // TODO: If the drag originated from the viewport: preventDefault().
    // If not: return.
    e.preventDefault();
    if (!mouseOnViewport) return;
    mouseDragged(e);
}
window.mouseWheel = (e) => {
    if (!mouseOnViewport) return;
    e.preventDefault();
    mouseWheel(e);
}


const imageobj_size = 100;
var bg_image;
var canvas;
/**@type {Obj[]}*/
const objects = [];

window.windowResized = () =>
    update(resizeCanvas(viewport.offsetWidth, viewport.offsetHeight));

window.setup = function setup() {
    bg_image = createImage(1,1); // Just to avoid background-image drawing errors.
    setTool('remover');
    canvas = createCanvas(viewport.offsetWidth, viewport.offsetHeight);
    canvas.parent(viewport);

    document.oncontextmenu = () => false;
    update();
}

var updateCounter = 2;
window.update = function update() {
    updateCounter = 2;
}

window.draw = function draw() {
    if (updateCounter > 0) updateCounter--;
    else return;

    //const srdate = new Date();
    clear();
    translate(getTranslateX(), getTranslateY());

    scale(getZoom());
    image(bg_image, 0, 0);

    for (let i = objects.length-1; i > -1; i--) {
        push(); objects[i].draw(); pop();
    }

    const selobj = getSelectedObject();
    if (selobj) { // Highlight the intersecting object
        noFill();
        stroke(255, 255, 255, 255/2);
        let sweight = 3/getZoom()
        if (sweight > 3) sweight = 3;
        strokeWeight(sweight);
        rect(selobj.x-1, selobj.y-1, selobj.w+2, selobj.h+2);
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

export {
    imageobj_size,
    objects,
    viewport,
    getIntersectingObject,
    changeMap
};