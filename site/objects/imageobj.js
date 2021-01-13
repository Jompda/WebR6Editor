import { update } from '../main.js';
import { assets, resourceURL } from '../preload.js';
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
     * @param {Object} asset 
     * @param {Object} options 
     */
    constructor(x, y, w, h, image, outline, asset) {
        super(x, y, w, h, outline);
        this.image = image;
        this.assetId = asset.filename;

        // figure out the draw function.
        const outlineType = asset.options?asset.options.outlineType:undefined;
        switch (outlineType) {
            case 'tint':
                this.actualDraw = this.drawTintableOutline;
                break;
            case 'image':
                this.outlineImage = loadImage(resourceURL + asset.path + asset.filename + '_outline' + asset.extension, update);
                this.actualDraw = this.drawOutlineImage;
                break;
            default:
                this.actualDraw = this.drawDefaultOutline;
                break;
        }
        
    }

    static fromObject(obj) {
        let outline;
        if (obj.outline && obj.outline.levels) {
            const rgba = obj.outline.levels;
            outline = color(rgba[0], rgba[1], rgba[2], rgba[3]);
        }

        const asset = assets.get(obj.assetId);

        const newObj = new ImageObj(
            obj.x, obj.y, obj.w, obj.h,
            loadImage(resourceURL + asset.path + asset.filename + asset.extension, update),
            outline,
            asset
        );
        newObj.rotation = obj.rotation;
        return newObj;
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