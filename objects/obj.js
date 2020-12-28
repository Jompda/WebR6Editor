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
        this.scale = 1;
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
     * @param {String} scale 
     * @returns {Boolean}
     */
    parseScale(scale) {
        const parsed = parseFloat(scale);
        if (isNaN(parsed)) return false;
        this.scale = parsed;
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

    /**@returns {Number} scaled width */
    sw() {return this.w*this.scale}
    /**@returns {Number} scaled height */
    sh() {return this.h*this.scale}

}

export default Obj;