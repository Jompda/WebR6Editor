/**
 * Obj representing any object on the canvas.
 */
class Obj {

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {color|undefined} outline 
     */
    constructor(x, y, outline) {
        this.x = x; this.y = y;
        this.outline = outline;
        this.rotation = 0;
    }

    /**
     * Draw this object on the canvas.
     */
    draw() {}

    /**
     * Draw edit mode of this object.
     */
    drawEditMode() {}

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