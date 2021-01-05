import { formElement } from '../gui.js';
import Obj, { ControlPoint } from './obj.js';
import { update } from '../main.js';

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

    drawEditMode(enabled) {
        translate(this.x, this.y);
        noFill();
        stroke(255,255,255,255/2);
        strokeWeight(4);
        rect(0, 0, this.w, this.h);

        if (!enabled) return;

        // Draw the control points.
        stroke(200);
        strokeWeight(2);
        fill(0,0,255);

        const size = 10, offset = 8;
        rect(this.w-offset, this.h/2-size/2, size, size);
        rect(this.w/2-size/2, this.h-offset, size, size);
        ellipse(this.w-offset/1.5, this.h-offset/1.5, size*1.5);

    }

    intersects(x, y) {
        return (x > this.x && x < this.x+this.w)
            && (y > this.y && y < this.y+this.h);
    }

    getControlPoint(x, y) {
        x -= this.x; y -= this.y;
        const obj = this;

        const size = 10, offset = 8;
        // right
        if ((x > this.w-offset && x < this.w)
         && (y > this.h/2-size/2 && y < this.h/2+size/2)) {
            return {
                drag: function(diffX, diffY) {
                    obj.w += diffX;
                    update();
                }
            }
        }
        else if ((x > this.w/2-size/2 && x < this.w/2+size/2)
              && (y > this.h-offset && y < this.h)) {
            return {
                drag: function(diffX, diffY) {
                    obj.h += diffY;
                    update();
                }
            }
        }
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