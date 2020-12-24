
class ImageObject {

    // Variables which take zoom into consideration.
    sx() {return this.x*zoom}
    sy() {return this.y*zoom}
    sw() {return this.w*zoom}
    sh() {return this.h*zoom}

    constructor(x, y, w, h, image, tint) {
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.image = image;
        this.tint = tint;
    }

    draw() {
        if (this.tint) tint(this.tint);
        image(this.image, this.sx(), this.sy(), this.sw(), this.sh());
    }

    intersects(x, y) {
        return (x > this.x && x < this.x+this.w)
            && (y > this.y && y < this.y+this.h);
    }

}
