import { formElement, getSelectedObject, showObjectProperties } from '../gui.js';
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

        this.initControlPoints();
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

        this.controlPoints.forEach(cp => cp.draw());
    }

    intersects(x, y) {
        return (x > this.x && x < this.x+this.w)
            && (y > this.y && y < this.y+this.h);
    }

    getControlPoint(x, y) {
        x -= this.x; y -= this.y;
        for (let i = 0; i < this.controlPoints.length; i++) {
            const temp = this.controlPoints[i];
            if (temp.intersects(x, y)) return temp;
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
        const amount = Math.PI/4;
        this.rotation += right?amount:-amount;
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

    initControlPoints() {
        const size = 10, offset = 8;

        const rightCP = new RectangleObjControlPoint(this);
        rightCP.draw = function() {
            rect(this.right()-offset, this.bottom()/2-size/2, size, size);
        }
        rightCP.intersects = function(x, y) {
            return (x > this.right()-offset && x < this.right())
                && (y > this.bottom()/2-size/2 && y < this.bottom()/2+size/2);
        }
        rightCP.drag = function(oldX, oldY, newX, newY) {
            this.obj.w += newX-oldX;
            update();
        }
        this.controlPoints.push(rightCP);

        const bottomCP = new RectangleObjControlPoint(this);
        bottomCP.draw = function() {
            rect(this.right()/2-size/2, this.bottom()-offset, size, size);
        }
        bottomCP.intersects = function(x, y) {
            return (x > this.right()/2-size/2 && x < this.right()/2+size/2)
                && (y > this.bottom()-offset && y < this.bottom());
        }
        bottomCP.drag = function(oldX, oldY, newX, newY) {
            this.obj.h += newY-oldY;
            update();
        }
        this.controlPoints.push(bottomCP);

        const bottomRightCP = new RectangleObjControlPoint(this);
        bottomRightCP.draw = function() {
            ellipse(this.right()-offset/1.5, this.bottom()-offset/1.5, size*1.5);
        }
        bottomRightCP.intersects = function(x, y) {
            return (x > this.right()-offset && x < this.right())
                && (y > this.bottom()-offset && y < this.bottom());
        }
        bottomRightCP.drag = function(oldX, oldY, newX, newY) {
            // TODO: Better controls.
            const aspect_ratio = this.obj.w/this.obj.h;
            const newW = newX-this.obj.x;
            this.obj.w = newW;
            this.obj.h = newW/aspect_ratio;
            update();
        }
        this.controlPoints.push(bottomRightCP);
    }

}

class RectangleObjControlPoint extends ControlPoint {
    /**
     * @param {RectangleObj} obj 
     */
    constructor(obj) {
        super();
        this.obj = obj;
    }

    right() {  return this.obj.w; }
    left() { return 0; }

    top() { return 0; }
    bottom() { return this.obj.h; }

}

export default RectangleObj;