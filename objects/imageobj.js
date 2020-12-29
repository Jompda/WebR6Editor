import { getZoom } from '../controller.js';
import { formElement } from '../gui.js';
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
     */
    constructor(x, y, w, h, image, outline) {
        super(x, y, w, h, outline);
        this.image = image;
    }

    draw() {
        if (this.outline) {
            noFill();
            strokeWeight(2);
            stroke(this.outline);
            rect(this.x, this.y, this.w, this.h);
        }
        // I noticed that this is apparently less resource-demanding than image() ..
        copy(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, this.w, this.h);
    }

    drawEditMode() {
        noFill();
        stroke(255,255,255,255/2);
        let sweight = 4/getZoom();
        if (sweight > 4) sweight = 4;
        strokeWeight(sweight);
        rect(this.x-1, this.y-1, this.w+2, this.h+2);
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
            )
        );
        return div;
    }

}

export default ImageObj;