import { objects, getIntersectingObject } from './sketch.js';
import { getTool } from './toolhandler.js';
import { setSelectedObject, showObjectProperties } from './gui.js';

// This whole thing is a mess.

var translateX = 0, translateY = 0;
const getTranslateX = () => translateX;
function setTranslateX(tx) { translateX = tx }
const getTranslateY = () => translateY;
function setTranslateY(ty) { translateY = ty }

var zoom = 1, minZoom = 0.2;
const getZoom = () => zoom;
function setZoom(z) { zoom = z }

var lastMouseX, lastMouseY;
var onObject = false;
const isOnObject = () => onObject;
var dragged = false;
const isDragged = () => dragged;

function mousePressed(event) {
    onObject = false;
    dragged = false;
    update(updateLastMousePosition());

    // Check for intersection.
    showObjectProperties(setSelectedObject(undefined));
    const intersecting = getIntersectingObject((mouseX - translateX)/zoom, (mouseY - translateY)/zoom);
    if (intersecting) {
        showObjectProperties(setSelectedObject(onObject = intersecting.obj));
        // Move to first for rendering purposes.
        objects.splice(intersecting.i, 1);
        objects.unshift(onObject);
    }
    
    getTool().mousePressed(event);
}

function mouseDragged(event) {
    dragged = true;

    if (mouseButton === CENTER) dragViewport();
    else getTool().mouseDragged(event);
    
    update(updateLastMousePosition());
}

function mouseReleased(event) {
    getTool().mouseReleased(event);
    onObject = false;
    dragged = false;
    update(updateLastMousePosition());
}

/*function mouseMoved() {
    if(filterSidebars()) return;
    if(tool.onMove) tool.onMove();
}*/

function mouseWheel(event) {
    update();
    let zoomDelta = -event.delta*zoom/750;
    if (zoom + zoomDelta < minZoom)
        zoomDelta += minZoom-(zoom+zoomDelta);

    adjustTranslation();
    zoom += zoomDelta;

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
}

function dragObject(obj) {
    const deltaX = mouseX - lastMouseX, deltaY = mouseY - lastMouseY;
    obj.x += deltaX/zoom; obj.y += deltaY/zoom;
}

const updateLastMousePosition = () => { lastMouseX = mouseX; lastMouseY = mouseY; };

export {
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