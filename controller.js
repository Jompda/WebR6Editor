import { sidebar_left, sidebar_right, sidebar_left_toggle, sidebar_right_toggle } from './preload.js';
import { objects } from './sketch.js';
import { getTool } from './toolhandler.js';
import { showObjectProperties } from './gui.js';

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

window.mousePressed = function mousePressed(event) {
    onObject = false;
    dragged = false;
    update(updateMousePosition());
    if (bounds()) return;
    // Check for intersection.
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].intersects((mouseX - translateX)/zoom, (mouseY - translateY)/zoom)) {
            onObject = objects[i];
            // Move to first.
            objects.splice(i, 1);
            objects.unshift(onObject);
            break;
        }
    }
    
    switch (mouseButton) {
        case CENTER: break;
        case RIGHT: showObjectProperties(onObject); break;
        case LEFT:
            const tool = getTool();
            if (tool && tool.onPress)
                tool.onPress();
            break;
        default: break;
    }
}

window.mouseDragged = function mouseDragged(event) {
    dragged = true;

    switch (mouseButton) {
        case CENTER:
            // Drag the viewport.
            const deltaX = mouseX - lastMouseX, deltaY = mouseY - lastMouseY;
            translateX += deltaX; translateY += deltaY;
            break;
        case RIGHT: /*if (bounds()) return;*/ break;
        case LEFT:
            if (bounds()) break;
            const tool = getTool();
            if (tool && tool.onDrag)
                tool.onDrag();
            else if (onObject) dragObject(onObject);
            break;
        default: break;
    }
    
    update(updateMousePosition());
}

window.mouseReleased = function mouseReleased(event) {
    switch (mouseButton) {
        case CENTER: break;
        case RIGHT: /*if (bounds()) return;*/ break;
        case LEFT:
            if (bounds()) break;
            const tool = getTool();
            if (tool && tool.onRelease)
                tool.onRelease();
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

window.mouseWheel = function mouseWheel(event) {
    update();
    if (bounds()) return;

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

function bounds() {
    //filters out mouse events that are overlapping with the sidebars
    if (mouseX < sidebar_left.offsetLeft+sidebar_left.offsetWidth || mouseX > sidebar_right.offsetLeft) return true;
    //filter out the toggle buttons. Dear god, what the fuck is this..
    if (dist(mouseX, mouseY, sidebar_right.offsetLeft+sidebar_right_toggle.offsetLeft+sidebar_right_toggle.offsetWidth/2,
        sidebar_right_toggle.offsetTop+sidebar_right_toggle.offsetHeight/2) < 20) return true;
    if (dist(mouseX, mouseY, sidebar_left.offsetLeft+sidebar_left_toggle.offsetLeft+sidebar_left_toggle.offsetWidth/2,
        sidebar_left_toggle.offsetTop+sidebar_left_toggle.offsetHeight/2) < 20) return true;
    return false;
}

function dragObject(obj) {
    const deltaX = mouseX - lastMouseX, deltaY = mouseY - lastMouseY;
    obj.x += deltaX/zoom; obj.y += deltaY/zoom;
}

const updateMousePosition = () => { lastMouseX = mouseX; lastMouseY = mouseY; };

export {
    getTranslateX, setTranslateX,
    getTranslateY, setTranslateY,
    getZoom, setZoom,
    isOnObject,
    isDragged
};