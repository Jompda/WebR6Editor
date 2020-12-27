import {
    isDragged, isOnObject,
    getTranslateX,
    getTranslateY,
    getZoom
} from './controller.js';
import { preloadedImages } from './preload.js';
import { objects, imageobj_size } from './sketch.js';
import { setSelectedObject, showObjectProperties } from './gui.js';
import ImageObj from './objects/imageobj.js';


// Toolpages functionality
const toolGroups = new Map([
    [ 'basic', document.createElement('div') ]
]);

var subtools_container;
function setSubToolsContainer(element) {
    subtools_container = element;
}

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


// Tool functionality.
const tools = new Map();
var tool = undefined;
const getTool = () => tool;
function setTool(name, args) {
    const ctool = tools.get(name);
    if (!ctool) return;
    ctool.args = args;
    return tool = ctool;
}
window.setTool = setTool;


// Outline functionality.
var outline = undefined;
const getOutline = () => outline;
function setOutline(newOutline) { outline = newOutline }
window.setOutline = setOutline;


{   // Temporary way of initializing the tools.
    tools.set('remover', {
        onRelease: () => {
            const onObject = isOnObject();
            if (!onObject || isDragged()) return;
            let index = objects.indexOf(onObject);
            objects.splice(index, 1);
            setSelectedObject(undefined);
            showObjectProperties(undefined);
        }
    });
    const imagePlacer = {
        onRelease: () => {
            if (isOnObject()) return;
            const img = preloadedImages.get(imagePlacer.args[0]);
            const aspect_ratio = img.width / img.height;
            const imgobj = new ImageObj(
                (mouseX - getTranslateX())/getZoom() - imageobj_size*aspect_ratio/2, (mouseY - getTranslateY())/getZoom() - imageobj_size/2,
                imageobj_size*aspect_ratio, imageobj_size, img, outline
            );
            objects.unshift(imgobj);
            setSelectedObject(imgobj);
            showObjectProperties(imgobj);
        }
    }
    tools.set('imageplacer', imagePlacer);
}

export {
    setSubToolsContainer,
    toolGroups,
    getTool, setTool,
    getOutline, setOutline,
    setSubTools
};