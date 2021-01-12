import Tool from './tools/tool.js';
import Remover from './tools/remover.js';
import ImagePlacer from './tools/imageplacer.js';


/**
 * Toolpages functionality
 * @type {Map<String, HTMLElement>}
 */
const toolGroups = new Map([
    [ 'basic', document.createElement('div') ]
]);

/**@type {HTMLElement}*/ var subtools_container;
/**@param {HTMLElement} element */
const setToolPageContainer = (element) => subtools_container = element;

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
 * @param {String} options 
 * @returns {Tool|undefined}
 */
function setTool(name, options) {
    const ctool = tools.get(name);
    if (!ctool) return;
    if (options) ctool.options = JSON.parse(options);
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
    tools.set('notool', new Tool());
    tools.set('remover', new Remover());
    tools.set('imageplacer', new ImagePlacer());
}

export {
    setToolPageContainer,
    toolGroups,
    getTool, setTool,
    getOutline, setOutline,
    setToolPage
};