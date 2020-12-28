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


/**
 * Toolpages functionality
 * @type {Map<String, HTMLElement>}
 */
const toolGroups = new Map([
    [ 'basic', document.createElement('div') ]
]);

/**@type {HTMLElement}*/ var subtools_container;
/**@param {HTMLElement} element */
function setToolPageContainer(element) {
    subtools_container = element;
}

/**@param {String} group the group name in toolGroups*/
function setToolPage(group) {
    clearSelectedTool();
    if (subtools_container.firstChild) subtools_container.removeChild(subtools_container.firstChild);
    subtools_container.appendChild(toolGroups.get(group));
}
window.setToolPage = setToolPage;

function clearSelectedTool() {
    const elem = document.getElementsByName("tool");
    for (let i=0;i<elem.length;i++)
        elem[i].checked = false;
}


// Tool functionality.
/**@type {Map<String, Tool>}*/ const tools = new Map();
/**@type {Tool}*/ var tool = undefined;
/**@returns {Tool}*/
const getTool = () => tool;
/**
 * @param {String} name 
 * @param {String[]} args 
 * @returns {Tool|undefined}
 */
function setTool(name, args) {
    const ctool = tools.get(name);
    if (!ctool) return;
    ctool.args = args;
    return tool = ctool;
}
window.setTool = setTool;


// Outline functionality.
/**@type {color}*/ var outline = undefined;
/**@returns {color}*/
const getOutline = () => outline;
/**
 * @param {color|undefined} newOutline 
 * @returns {color|undefined}
 */
const setOutline = (newOutline) => outline = newOutline;
window.setOutline = setOutline;


{   // Temporary way of initializing the tools.
    tools.set('no tool', {} );
    tools.set('remover', {
        onLRelease: () => {
            const onObject = isOnObject();
            if (!onObject || isDragged()) return;
            let index = objects.indexOf(onObject);
            objects.splice(index, 1);
            setSelectedObject(undefined);
            showObjectProperties(undefined);
        }
    });
    const imagePlacer = {
        onLRelease: () => {
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
    setToolPageContainer,
    toolGroups,
    getTool, setTool,
    getOutline, setOutline,
    setToolPage
};