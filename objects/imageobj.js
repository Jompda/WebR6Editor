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
    constructor(x, y, w, h, image, outline, outlineImage) {
        super(x, y, w, h, outline);
        this.image = image;
        this.outlineImage = outlineImage;
    }

    draw() {
        const adjX = -this.w/2, adjY = -this.h/2;
        translate(-adjX, -adjY);
        rotate(this.rotation);
        if (this.outline) {
            if (this.outlineImage) {
                tint(this.outline);
                image(this.outlineImage, adjX, adjY, this.w, this.h);
            } else {
                noFill();
                strokeWeight(4);
                stroke(this.outline);
                rect(adjX, adjY, this.w, this.h);
            }
        }
        // I noticed that this is apparently less resource-demanding than image() ..
        copy(this.image, 0, 0, this.image.width, this.image.height, adjX, adjY, this.w, this.h);
    }

}

export default ImageObj;