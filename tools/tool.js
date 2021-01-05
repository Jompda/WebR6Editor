import { dragObject, dragViewport, isDragOriginatedFromViewport, isOnObject } from '../controller.js';

/**
 * Representing a default tool.
 */
class Tool {

    constructor() {
        this.options = {};
    }

    mousePressed(event) {

    }

    mouseDragged(event) {
        const onObject = isOnObject();
        if (onObject) dragObject(onObject);
        else if (isDragOriginatedFromViewport()) dragViewport();
    }

    mouseReleased(event) {

    }

}

export default Tool;