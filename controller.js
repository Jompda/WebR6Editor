import { getObjects, getIntersectingObject, update } from './main.js';
import { getTool } from './toolhandler.js';
import { setSelectedObject } from './gui.js';
import Obj from './objects/obj.js';

// Filtering events outside the viewport.
var dragOriginatedFromViewport = false
const isDragOriginatedFromViewport = () => dragOriginatedFromViewport;
{
    let dragging = false;
    let mouseOnViewport = true;

    const viewport = document.getElementById('viewport');
    viewport.onmouseenter = () => mouseOnViewport = true;
    viewport.onmouseleave = () => mouseOnViewport = false;
    window.onmousedown = (e) => {
        if (mouseOnViewport) {
            dragOriginatedFromViewport = true;
            mousePressed(e);
        }
        else dragOriginatedFromViewport = false;
    }
    window.onmouseup = (e) => {
        dragging = false;
        if (mouseOnViewport) mouseReleased(e);
    };
    window.mouseDragged = (e) => {
        dragging = true;
        if (!mouseOnViewport && !dragOriginatedFromViewport) return;
        e.preventDefault();
        mouseDragged(e);
    }
    window.mouseWheel = (e) => {
        if (!mouseOnViewport) return;
        e.preventDefault();
        mouseWheel(e);
    }
}


// Viewport controls

var translateX = 0, translateY = 0;
const getTranslateX = () => translateX;
function setTranslateX(tx) { translateX = tx }
const getTranslateY = () => translateY;
function setTranslateY(ty) { translateY = ty }

var zoom = 1, minZoom = 0.2;
const getZoom = () => zoom;
function setZoom(z) { zoom = z }

var lastMouseX, lastMouseY;
/**@type {Obj} */
var onObject = undefined;
var controlPoint = undefined;
const isOnObject = () => onObject;
var dragged = false;
const isDragged = () => dragged;

function mousePressed(event) {
    onObject = undefined;
    dragged = false;
    updateLastMousePosition();

    const tool = getTool();

    // Check for intersection.
    setSelectedObject(undefined);
    const intersecting = getIntersectingObject((mouseX - translateX)/zoom, (mouseY - translateY)/zoom);
    if (intersecting) {
        setSelectedObject(onObject = intersecting.obj);
        if (tool.editAllowed) controlPoint = onObject.getControlPoint((mouseX - translateX)/zoom, (mouseY - translateY)/zoom);
        // Move to first for rendering purposes.
        getObjects().splice(intersecting.i, 1);
        getObjects().unshift(onObject);
    }
    update();
    
    tool.mousePressed(event, onObject);
}

function mouseDragged(event) {
    dragged = true;

    if (mouseButton === CENTER) dragViewport();
    else {
        const tool = getTool();
        if (tool.editAllowed && controlPoint) controlPoint.drag((lastMouseX - translateX)/zoom, (lastMouseY - translateY)/zoom, (mouseX - translateX)/zoom, (mouseY - translateY)/zoom);
        else tool.mouseDragged(event, onObject);
    }
    
    updateLastMousePosition();
}

function mouseReleased(event) {
    getTool().mouseReleased(event, onObject);
    controlPoint = undefined;
    onObject = undefined;
    dragged = false;
    updateLastMousePosition();
}

/*function mouseMoved() {
    if(filterSidebars()) return;
    if(tool.onMove) tool.onMove();
}*/

function mouseWheel(event) {
    let zoomDelta = -event.delta*zoom/750;
    if (zoom + zoomDelta < minZoom)
        zoomDelta += minZoom-(zoom+zoomDelta);

    adjustTranslation();
    zoom += zoomDelta;

    update();

    function adjustTranslation() {
        // Relative to cursor.
        translateX -= (mouseX-translateX)/zoom * zoomDelta;
        translateY -= (mouseY-translateY)/zoom * zoomDelta;
        // Relative to the camera position AKA center of the viewport.
        //translateX -= (width/2-translateX)/zoom * zoomDelta;
        //translateY -= (height/2-translateY)/zoom * zoomDelta;
    }
}

function dragViewport() {
    const deltaX = mouseX - lastMouseX, deltaY = mouseY - lastMouseY;
    translateX += deltaX; translateY += deltaY;
    update();
}

function dragObject(obj) {
    const deltaX = mouseX - lastMouseX, deltaY = mouseY - lastMouseY;
    obj.x += deltaX/zoom; obj.y += deltaY/zoom;
    update();
}

const updateLastMousePosition = () => { lastMouseX = mouseX; lastMouseY = mouseY; };

export {
    isDragOriginatedFromViewport,
    mousePressed, mouseDragged, mouseReleased, mouseWheel,
    getTranslateX, setTranslateX,
    getTranslateY, setTranslateY,
    getZoom, setZoom,
    isOnObject,
    isDragged,
    dragViewport,
    dragObject,
    updateLastMousePosition
};