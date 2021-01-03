import { getTranslateX } from '../controller.js';
import RectangleObj from './rectangleobj.js';

/**
 * ImageObj representing a image on the canvas.
 */
class ImageObj extends RectangleObj {

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} w 
     * @param {Number} h 
     * @param {image} image 
     * @param {color|undefined} outline 
     */
    constructor(x, y, w, h, image, outline) {
        super(x, y, w, h, outline);
        this.image = image;
    }

    draw() {
        translate(this.w/2, this.h/2);
        rotate(this.rotation);
        if (this.outline) {
            noFill();
            strokeWeight(4);
            stroke(this.outline);
            rect(this.x, this.y, this.w, this.h);
        }
        // I noticed that this is apparently less resource-demanding than image() ..
        copy(this.image, 0, 0, this.image.width, this.image.height, -this.w/2, -this.h/2, this.w, this.h);
    }

}

export default ImageObj;