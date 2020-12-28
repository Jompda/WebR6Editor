/**
 * Obj representing any object on the canvas.
 */
class Obj {

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} w 
     * @param {Number} h 
     * @param {color|undefined} outline 
     */
    constructor(x, y, w, h, outline) {
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.outline = outline;
    }

    /**
     * Draw this object on the canvas.
     */
    draw() {}

    /**
     * Checks if a point is intersecting this object.
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Boolean}
     */
    intersects(x, y) {}

    /**
     * @returns {HTMLElement}
     */
    getObjectPropertiesGUI() {}

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

    /**
     * @param {String} outline 
     * @returns {Boolean}
     */
    parseOutline(outline) {
        if (outline === '') {
            this.outline = undefined;
            return true;
        }
        this.outline = color(outline);
        return true;
    }

}

export default Obj;