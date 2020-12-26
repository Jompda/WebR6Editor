import {
    isDragged, isOnObject,
    getTranslateX,
    getTranslateY,
    getZoom
} from './controller.js';
import { preloadedImages } from './preload.js';
import { objects, imageobj_size } from './sketch.js';
import ImageObject from './imageobject.js';

var subtools_container;
function setSubToolsContainer(element) {
    subtools_container = element;
}

const toolGroups = new Map([
    [ 'basic', document.createElement('div') ]
]);

const tools = [];
var tool = undefined;
const getTool = () => tool;
function setTool(name) {
    for (let i = 0; i < tools.length; i++) {
        if (tools[i].name == name) {
            tool = tools[i];
        }
    }
}
window.setTool = setTool;

var outline = undefined;
const getOutline = () => outline;
function setOutline(newOutline) { outline = newOutline }
window.setOutline = setOutline;


function setImageTool(name) {
    tool = new function() {
        this.onRelease = function() {
            if (!isOnObject()) {
                const img = preloadedImages.get(name);
                const aspect_ratio = img.width / img.height;
                objects.unshift(new ImageObject(
                    (mouseX - getTranslateX())/getZoom() - imageobj_size*aspect_ratio/2, (mouseY - getTranslateY())/getZoom() - imageobj_size/2,
                    imageobj_size*aspect_ratio, imageobj_size, img, outline
                ));
            }
        }
    }
}
window.setImageTool = setImageTool;

function setSubTools(group) {
    clearSelectedTool();
    if (subtools_container.firstChild) subtools_container.removeChild(subtools_container.firstChild);
    subtools_container.appendChild(toolGroups.get(group));
}
window.setSubTools = setSubTools;

function clearSelectedTool() {
    const elem = document.getElementsByName("tool");
    for (let i=0;i<elem.length;i++)
        elem[i].checked = false;
}

// Temporary way of initializing the remover tool.
tools.push(new function() {
    this.name = 'remover';
    this.onRelease = function() {
        const onObject = isOnObject();
        if (onObject && !isDragged()) {
            let index = objects.indexOf(onObject);
            objects.splice(index, 1);
        }
    }
});

export {
    setSubToolsContainer,
    toolGroups,
    getTool, setTool,
    getOutline, setOutline,
    setImageTool,
    setSubTools
};