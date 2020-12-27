
class Obj {

    constructor(x, y, outline) {
        this.x = x; this.y = y;
        this.outline = outline;
        this.scale = 1;
    }

    draw() {}

    intersects(x, y) {}

    getObjectPropertiesGUI() {}

    setScale(scale) {
        const parsed = parseFloat(scale);
        if (isNaN(parsed)) return false;
        this.scale = parsed;
        return true;
    }

}

export default Obj;