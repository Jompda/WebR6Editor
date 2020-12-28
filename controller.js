import { sidebar_left, sidebar_right, sidebar_left_toggle, sidebar_right_toggle } from './preload.js';
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
    update(updateMousePosition());

    // Check for intersection.
    showObjectProperties(setSelectedObject(undefined));
    const intersecting = getIntersectingObject((mouseX - translateX)/zoom, (mouseY - translateY)/zoom);
    if (intersecting) {
        showObjectProperties(setSelectedObject(onObject = intersecting.obj));
        // Move to first for rendering purposes.
        objects.splice(intersecting.i, 1);
        objects.unshift(onObject);
    }
    
    const tool = getTool();
    switch (mouseButton) {
        case CENTER: break;
        case RIGHT:
            if (tool && tool.onRPress) tool.onRPress();
            break;
        case LEFT:
            if (tool && tool.onLPress) tool.onLPress();
            break;
        default: break;
    }
}

function mouseDragged(event) {
    dragged = true;

    const tool = getTool();
    switch (mouseButton) {
        case CENTER:
            // Drag the viewport.
            const deltaX = mouseX - lastMouseX, deltaY = mouseY - lastMouseY;
            translateX += deltaX; translateY += deltaY;
            break;
        case RIGHT:
            if (tool && tool.onRDrag) tool.onRDrag();
            break;
        case LEFT:
            if (tool && tool.onLDrag) tool.onLDrag();
            else if (onObject) dragObject(onObject);
            break;
        default: break;
    }
    
    update(updateMousePosition());
}

function mouseReleased(event) {
    const tool = getTool();
    switch (mouseButton) {
        case CENTER: break;
        case RIGHT:
            if (tool && tool.onRRelease) tool.onRRelease();
            break;
        case LEFT:
            if (tool && tool.onLRelease) tool.onLRelease();
            break;
        default: break;
    }

    onObject = false;
    dragged = false;
    update(updateMousePosition());
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

function dragObject(obj) {
    const deltaX = mouseX - lastMouseX, deltaY = mouseY - lastMouseY;
    obj.x += deltaX/zoom; obj.y += deltaY/zoom;
}

const updateMousePosition = () => { lastMouseX = mouseX; lastMouseY = mouseY; };

export {
    mousePressed, mouseDragged, mouseReleased, mouseWheel,
    getTranslateX, setTranslateX,
    getTranslateY, setTranslateY,
    getZoom, setZoom,
    isOnObject,
    isDragged,
    dragObject,
    updateMousePosition
};