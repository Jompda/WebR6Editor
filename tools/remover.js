import { isDragged, isOnObject } from '../controller.js';
import { setSelectedObject } from '../gui.js';
import { objects, update } from '../main.js';
import Tool from './tool.js';

class Remover extends Tool {

    mouseReleased() {
        const onObject = isOnObject();
        if (!onObject || isDragged() || mouseButton !== LEFT) return;
        let index = objects.indexOf(onObject);
        objects.splice(index, 1);
        setSelectedObject(undefined);
        update();
    }

}

export default Remover;