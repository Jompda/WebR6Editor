import { formElement } from './gui.js';

class ImageObject {

    sw() {return this.w*this.scale}
    sh() {return this.h*this.scale}

    constructor(x, y, w, h, image, outline) {
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.image = image;
        this.outline = outline;

        this.scale = 1;
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
                'p', undefined, 'Scale:'
            ),
            formElement(
                'input', [
                    [ 'type', 'text' ],
                    [ 'value', this.scale ],
                    [ 'onchange', 'getSelectedObject().setScale(this.value);update();' ]
                ]
            )
        );
        return div;
    }

    setScale(scale) {
        const newScale = parseFloat(scale);
        if (isNaN(newScale)) return false;
        this.scale = newScale;
        return true;
    }

}

export default ImageObject;