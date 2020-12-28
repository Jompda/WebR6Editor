import { dragObject, dragViewport, isOnObject } from "../controller.js";

/**
 * Representing a default tool.
 */
class Tool {

    constructor() {
        this.args = [];
    }

    mousePressed(event) {

    }

    mouseDragged(event) {
        const onObject = isOnObject();
        if (onObject) dragObject(onObject);
        else dragViewport();
    }

    mouseReleased(event) {

    }

}

export default Tool;