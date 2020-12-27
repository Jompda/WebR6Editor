import { formElement } from '../gui.js';
import Obj from './obj.js';

class ImageObj extends Obj {

    sw() {return this.w*this.scale}
    sh() {return this.h*this.scale}

    constructor(x, y, w, h, image, outline) {
        super(x, y);
        this.w = w; this.h = h;
        this.image = image;
        this.outline = outline;
    }

    draw() {
        if (this.outline) {
            noFill();
            strokeWeight(2);
            stroke(this.outline);
            rect(this.x, this.y, this.sw(), this.sh());
        }
        // I noticed that this is apparently less resource-demanding than image() ..
        copy(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, this.sw(), this.sh());
    }

    intersects(x, y) {
        return (x > this.x && x < this.x+this.sw())
            && (y > this.y && y < this.y+this.sh());
    }

    getObjectPropertiesGUI() {
        // Temporary implementation.
        const div = document.createElement('div');
        div.append(
            formElement(
                'p', [['class', 'sidebar-header']], 'Image Object properties:'
            ),
            formElement(
                'p', [[ 'style', 'display: inline-block' ]], 'Scale:'
            ),
            formElement(
                'input', [
                    [ 'type', 'text' ],
                    [ 'value', this.scale ],
                    [ 'onchange', 'getSelectedObject().setScale(this.value);update();' ]
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
                    [ 'onchange', 'getSelectedObject().setOutline(this.value);update();' ]
                ]
            )
        );
        return div;
    }

    setOutline(outline) {
        if (outline === '') {
            this.outline = undefined;
            return true;
        }
        this.outline = color(outline);
        return true;
    }

}

export default ImageObj;