
class ImageObject {

    constructor(x, y, w, h, image, tint) {
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.image = image;
        this.tint = tint;
    }

    draw() {
        if (this.tint) tint(this.tint);
        image(this.image, this.x, this.y, this.w, this.h);
    }

    intersects(x, y) {
        return (x > this.x && x < this.x+this.w)
            && (y > this.y && y < this.y+this.h);
    }

}
