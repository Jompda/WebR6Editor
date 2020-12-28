/**
 * Obj representing any object on the canvas.
 */
class Obj {

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

    setScale(scale) {
        const parsed = parseFloat(scale);
        if (isNaN(parsed)) return false;
        this.scale = parsed;
        return true;
    }

    sw() {return this.w*this.scale}
    sh() {return this.h*this.scale}

}

export default Obj;