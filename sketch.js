
const imageobj_size = 42;

var bg_image;
var canvas;
const objects = [];

const windowResized = () =>
    update(resizeCanvas(viewport.offsetWidth, viewport.offsetHeight));

function setup() {
    ToolHandler.setTool('remover');
    canvas = createCanvas(viewport.offsetWidth, viewport.offsetHeight);
    canvas.parent('viewport');

    ToolHandler.setTint(color(255));

    document.oncontextmenu = () => false;
    update();
}

var updateCounter = 2;
function update() {
    updateCounter = 2;
}

function draw() {
    if (updateCounter > 0) updateCounter--;
    else return;

    background(17);
    translate(translateX, translateY);

    scale(zoom);
    image(bg_image, 0, 0);

    for (let i = objects.length-1; i > -1; i--) {
        push(); objects[i].draw(); pop();
    }
}

function showObjectProperties(obj) {
    console.log('showObjectProperties:', obj);
}
