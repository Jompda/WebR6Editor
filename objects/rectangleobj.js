import { getZoom } from "../controller.js";
import Obj from "./obj.js";

/**
 * RectangleObj representing any rectangle shaped object on the canvas.
 */
class RectangleObj extends Obj {
    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} w 
     * @param {Number} h 
     * @param {color|undefined} outline 
     */
    constructor(x, y, w, h, outline) {
        super(x, y, outline);
        this.w = w; this.h = h;
    }

    drawEditMode() {
        noFill();
        stroke(255,255,255,255/2);
        let sweight = 4/getZoom();
        if (sweight > 4) sweight = 4;
        strokeWeight(sweight);
        rect(this.x-1, this.y-1, this.w+2, this.h+2);
    }

    intersects(x, y) {
        return (x > this.x && x < this.x+this.w)
            && (y > this.y && y < this.y+this.h);
    }

    /**
     * @param {String} width 
     * @returns {Boolean}
     */
    parseWidth(width) {
        const parsed = parseInt(width);
        if (isNaN(parsed)) return false;
        this.w = parsed;
        return true;
    }

    /**
     * @param {String} height 
     * @returns {Boolean}
     */
    parseHeight(height) {
        const parsed = parseInt(height);
        if (isNaN(parsed)) return false;
        this.h = parsed;
        return true;
    }

}

export default RectangleObj;