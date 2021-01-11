import { update } from '../main.js';
import { resourceURL } from '../preload.js';
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
     * @param {Object} options
     */
    constructor(x, y, w, h, image, outline, options) {
        super(x, y, w, h, outline);
        this.image = image;
        this.options = options;
        
        // figure out the draw function.
        if (options.outlineImageUrl) {
            this.outlineImage = loadImage(resourceURL + options.outlineImageUrl, update);
            this.actualDraw = this.drawOutlineImage;
        }
        else if (options.tintableOutline) this.actualDraw = this.drawTintableOutline;
        else this.actualDraw = this.drawDefaultOutline;
        
    }

    static fromObject(obj) {
        let outline;
        if (obj.outline) {
            const rgba = obj.outline.levels;
            outline = color(rgba[0], rgba[1], rgba[2], rgba[3]);
        }
        
        return new ImageObj(
            obj.x, obj.y, obj.w, obj.h,
            loadImage(resourceURL + obj.options.imageUrl, update),
            outline,
            obj.options
        );
    }

    draw() {
        const adjX = this.w/2, adjY = this.h/2;
        translate(adjX, adjY);
        rotate(this.rotation);
        this.actualDraw(-adjX, -adjY);
    }

    drawDefaultOutline(adjX, adjY) {
        // I noticed that this is apparently less resource-demanding than image() ..
        copy(this.image, 0, 0, this.image.width, this.image.height, adjX, adjY, this.w, this.h);

        if (this.outline) {
            noFill();
            strokeWeight(4);
            stroke(this.outline);
            rect(adjX, adjY, this.w, this.h);
        }
    }

    drawTintableOutline(adjX, adjY) {
        if (this.outline) tint(this.outline);
        image(this.image, adjX, adjY, this.w, this.h);
    }

    drawOutlineImage(adjX, adjY) {
        // I noticed that this is apparently less resource-demanding than image() ..
        copy(this.image, 0, 0, this.image.width, this.image.height, adjX, adjY, this.w, this.h);

        if (this.outline) {
            tint(this.outline);
            image(this.outlineImage, adjX, adjY, this.w, this.h);
        }
    }

}

export default ImageObj;