/**
 * Obj representing any object on the canvas.
 */
class Obj {

    constructor(x, y, outline) {
        this.x = x; this.y = y;
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

}

export default Obj;