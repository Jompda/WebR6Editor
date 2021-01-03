import { formElement } from '../gui.js';
import { getZoom } from '../controller.js';
import Obj from './obj.js';

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

    getObjectPropertiesGUI() {
        // Temporary implementation.
        const div = document.createElement('div');
        div.append(
            formElement(
                'p', [['class', 'sidebar-header']], 'Image Object properties:'
            ),
            document.createElement('br'),
            formElement(
                'p', [[ 'style', 'display: inline-block' ]], 'Width:'
            ),
            formElement(
                'input', [
                    [ 'type', 'text' ],
                    [ 'value', this.w ],
                    [ 'onchange', 'getSelectedObject().parseWidth(this.value);update();' ]
                ]
            ),
            document.createElement('br'),
            formElement(
                'p', [[ 'style', 'display: inline-block' ]], 'Height:'
            ),
            formElement(
                'input', [
                    [ 'type', 'text' ],
                    [ 'value', this.h ],
                    [ 'onchange', 'getSelectedObject().parseHeight(this.value);update();' ]
                ]
            ),
            document.createElement('br'),
            formElement(
                'p', [[ 'style', 'display: inline-block' ]], 'Outline:'
            ),
            formElement(
                'input', [
                    [ 'type', 'text' ],
                    [ 'value', this.outline ? this.outline.toString() : '' ],
                    [ 'onchange', 'getSelectedObject().parseOutline(this.value);update();' ]
                ]
            ),
            document.createElement('br'),
            formElement(
                'button', [[ 'onclick', 'getSelectedObject().rotate(false);update();' ]], 'Rotate left'
            ),
            formElement(
                'button', [[ 'onclick', 'getSelectedObject().rotate(true);update();' ]], 'Rotate right'
            )
        );
        return div;
    }

    rotate(right) {
        this.rotation += right?Math.PI/2:-Math.PI/2;
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