import { getTranslateX, getTranslateY, getZoom, isDragged, isOnObject } from '../controller.js';
import { setSelectedObject } from '../gui.js';
import ImageObj from '../objects/imageobj.js';
import { imageobj_size, objects, update } from '../main.js';
import { getOutline } from '../toolhandler.js';
import Tool from './tool.js';
import { resourceURL } from '../preload.js';

class ImagePlacer extends Tool {

    mouseReleased() {
        if (isOnObject() || isDragged() || mouseButton !== LEFT) return;
        // Save the target location until the image is loaded.
        const posX = mouseX, posY = mouseY;
        console.log(this.options);
        loadImage(resourceURL + this.options.imageUrl, (img) => {
            if (this.options.outlineImage) loadImage(resourceURL + this.options.outlineImage, (outlineImage) => ImagePlacer.placeImage(img, posX, posY, outlineImage));
            else ImagePlacer.placeImage(img, posX, posY);
        });
    }

    static placeImage(img, posX, posY, outlineImage) {
        const aspect_ratio = img.width / img.height;
        const imgobj = new ImageObj(
            (posX - getTranslateX())/getZoom() - imageobj_size*aspect_ratio/2, (posY - getTranslateY())/getZoom() - imageobj_size/2,
            imageobj_size*aspect_ratio, imageobj_size, img, getOutline(), outlineImage
        );
        objects.unshift(imgobj);
        setSelectedObject(imgobj);
        update();
    }

}

export default ImagePlacer;