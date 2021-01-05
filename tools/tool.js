import { dragObject, dragViewport, isDragOriginatedFromViewport } from '../controller.js';
import Obj from '../objects/obj.js';

/**
 * Representing a default tool.
 */
class Tool {

    constructor() {
        this.options = {};
        this.editAllowed = true;
    }

    /**
     * @param {MouseEvent} event 
     * @param {Obj} onObject 
     */
    mousePressed(event, onObject) {
        
    }

    /**
     * @param {MouseEvent} event 
     * @param {Obj} onObject 
     */
    mouseDragged(event, onObject) {
        if (onObject) dragObject(onObject);
        else if (isDragOriginatedFromViewport()) dragViewport();
    }

    /**
     * @param {MouseEvent} event 
     * @param {Obj} onObject 
     */
    mouseReleased(event, onObject) {

    }

}

export default Tool;