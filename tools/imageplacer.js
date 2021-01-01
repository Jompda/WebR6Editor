import { getTranslateX, getTranslateY, getZoom, isDragged, isOnObject } from "../controller.js";
import { setSelectedObject } from "../gui.js";
import ImageObj from "../objects/imageobj.js";
import { imageobj_size, objects, update } from "../sketch.js";
import { getOutline } from "../toolhandler.js";
import Tool from "./tool.js";

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