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
        const passedOptions = {...this.options};
        const posX = mouseX, posY = mouseY;
        loadImage(resourceURL + passedOptions.imageUrl, (img) => {
            if (passedOptions.outlineImage) loadImage(resourceURL + passedOptions.outlineImage, (outlineImage) => {
                passedOptions.outlineImage = outlineImage;
                ImagePlacer.placeImage(img, posX, posY, passedOptions);
            });
            else ImagePlacer.placeImage(img, posX, posY, passedOptions);
        });
    }

    static placeImage(img, posX, posY, options) {
        const aspect_ratio = img.width / img.height;
        const imgobj = new ImageObj(
            (posX - getTranslateX())/getZoom() - imageobj_size*aspect_ratio/2, (posY - getTranslateY())/getZoom() - imageobj_size/2,
            imageobj_size*aspect_ratio, imageobj_size, img, getOutline(), options
        );
        objects.unshift(imgobj);
        setSelectedObject(imgobj);
        update();
    }

}

export default ImagePlacer;