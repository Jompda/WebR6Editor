
class ImageObject {

    constructor(x, y, w, h, image, outline) {
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.image = image;
        this.outline = outline;
        //this.update = false;
    }

    draw() {
        if (this.outline) {
            noFill();
            strokeWeight(2);
            stroke(this.outline);
            rect(this.x, this.y, this.w, this.h);
        }
        copy(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, this.w, this.h);
    }

    intersects(x, y) {
        return (x > this.x && x < this.x+this.w)
            && (y > this.y && y < this.y+this.h);
    }

}
