import { isDragged, isOnObject } from '../controller';
import { setSelectedObject } from '../gui';
import { objects, update } from '../main';
import Tool from './tool';

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