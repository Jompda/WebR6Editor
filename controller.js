
// This whole thing is a mess.

var translateX = 0, translateY = 0;
var minZoom = 0.6;
var lastX, lastY;
var onObject = false;
var dragged = false;

function mousePressed() {
    update();
    if(mouseButton != CENTER) {
        if(bounds()) return;
        //check for intersection
        for(let i = 0; i < objects.length; i++) {
            if(objects[i].intersects((mouseX - translateX)/zoom, (mouseY - translateY)/zoom)) {
                onObject = objects[i];
                //move to first
                objects.splice(i, 1);
                objects.unshift(onObject);
                break;
            }
        }
        if(ToolHandler.tool && ToolHandler.tool.onPress) ToolHandler.tool.onPress();
    }
}

function mouseDragged() {
    update();
    dragged = true;
    if(mouseButton != CENTER) {
        if(bounds()) return;
        if(ToolHandler.tool && ToolHandler.tool.onDrag) ToolHandler.tool.onDrag();
        else dragObject();
    }
    else {
        //drag the viewport
        if(!lastX || !lastY) {lastX = mouseX; lastY = mouseY}
        let deltaX = mouseX - lastX, deltaY = mouseY - lastY;
        translateX += deltaX; translateY += deltaY;
        lastX = mouseX; lastY = mouseY;
    }
}

function mouseReleased() {
    update();
    if(mouseButton != CENTER) {
        if(bounds()) return;
        if(ToolHandler.tool && ToolHandler.tool.onRelease) ToolHandler.tool.onRelease();
        //console.log(ToolHandler.tool);
    }
    lastX = undefined; lastY = undefined;
    onObject = false;
    dragged = false;
}

/*function mouseMoved() {
    if(filterSidebars()) return;
    if(tool.onMove) tool.onMove();
}*/

function mouseWheel(e) {
    update();
    if(bounds()) return;

    let zoomDelta = -e.delta/500;
  
    // TODO: Recreate this shit. What the fuck was I thinking..
    if(zoom + zoomDelta < minZoom)
      zoomDelta += minZoom-(zoom+zoomDelta);
    if(zoom > 2) zoomDelta *= 1.5; //boosts the zoomDelta
    if(zoom > 4) zoomDelta *= 1.5;
    if(zoom > 8) zoomDelta *= 1.5;
    if(zoom > 12) zoomDelta *= 1.5;

    //zooming relative to cursor
    translateX += -((mouseX-translateX)/zoom * zoomDelta);
    translateY += -((mouseY-translateY)/zoom * zoomDelta);
    //zooming relative to camera position aka center of the viewport
    //translateX += -((width/2-translateX)/zoom * zoomDelta);
    //translateY += -((height/2-translateY)/zoom * zoomDelta);
    zoom += zoomDelta;
}

function bounds() {
    //filters out mouse events that are overlapping with the sidebars
    if(mouseX < sidebar_left.offsetLeft+sidebar_left.offsetWidth || mouseX > sidebar_right.offsetLeft) return true;
    //filter out the toggle buttons.
    if(dist(mouseX, mouseY, sidebar_right.offsetLeft+sidebar_right_toggle.offsetLeft+sidebar_right_toggle.offsetWidth/2,
        sidebar_right_toggle.offsetTop+sidebar_right_toggle.offsetHeight/2) < 20) return true;
    if(dist(mouseX, mouseY, sidebar_left.offsetLeft+sidebar_left_toggle.offsetLeft+sidebar_left_toggle.offsetWidth/2,
        sidebar_left_toggle.offsetTop+sidebar_left_toggle.offsetHeight/2) < 20) return true;
    return false;
}

function dragObject() {
    if(!onObject) return;
    if(!lastX || !lastY) {lastX = mouseX; lastY = mouseY}
    let deltaX = mouseX - lastX, deltaY = mouseY - lastY;
    onObject.x += deltaX/zoom; onObject.y += deltaY/zoom;
    lastX = mouseX; lastY = mouseY;
}
