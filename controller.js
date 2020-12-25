
// This whole thing is a mess.

var translateX = 0, translateY = 0;
var zoom = 1, minZoom = 0.2;
var lastMouseX, lastMouseY;
var onObject = false;
var dragged = false;

function mousePressed(event) {
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
        case RIGHT: GUI.showObjectProperties(onObject); break;
        case LEFT:
            if (ToolHandler.tool && ToolHandler.tool.onPress)
                ToolHandler.tool.onPress();
            break;
        default: break;
    }
}

function mouseDragged(event) {
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
            if (ToolHandler.tool && ToolHandler.tool.onDrag)
                ToolHandler.tool.onDrag();
            else if (onObject) dragObject(onObject);
            break;
        default: break;
    }
    
    update(updateMousePosition());
}

function mouseReleased(event) {
    dragged = false;

    switch (mouseButton) {
        case CENTER: break;
        case RIGHT: /*if (bounds()) return;*/ break;
        case LEFT:
            if (bounds()) break;
            if (ToolHandler.tool && ToolHandler.tool.onRelease)
                ToolHandler.tool.onRelease();
            break;
        default: break;
    }

    onObject = false;
    update(updateMousePosition());
}

/*function mouseMoved() {
    if(filterSidebars()) return;
    if(tool.onMove) tool.onMove();
}*/

function mouseWheel(event) {
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
