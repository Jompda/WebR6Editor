import { dragObject, dragViewport, isDragOriginatedFromViewport, isOnObject } from '../controller';

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
        else if (isDragOriginatedFromViewport()) dragViewport();
    }

    mouseReleased(event) {

    }

}

export default Tool;