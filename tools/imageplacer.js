import { getTranslateX, getTranslateY, getZoom, isDragged, isOnObject } from '../controller';
import { setSelectedObject } from '../gui';
import ImageObj from '../objects/imageobj';
import { imageobj_size, objects, update } from '../main';
import { getOutline } from '../toolhandler';
import Tool from './tool';

class ImagePlacer extends Tool {

    mouseReleased() {
        if (isOnObject() || isDragged() || mouseButton !== LEFT) return;
        // Save the target location until the image is loaded.
        const posX = mouseX, posY = mouseY;
        loadImage(this.args[0], (img) => ImagePlacer.placeImage(img, posX, posY));
    }

    static placeImage(img, posX, posY) {
        const aspect_ratio = img.width / img.height;
        const imgobj = new ImageObj(
            (posX - getTranslateX())/getZoom() - imageobj_size*aspect_ratio/2, (posY - getTranslateY())/getZoom() - imageobj_size/2,
            imageobj_size*aspect_ratio, imageobj_size, img, getOutline()
        );
        objects.unshift(imgobj);
        setSelectedObject(imgobj);
        update();
    }

}

export default ImagePlacer;