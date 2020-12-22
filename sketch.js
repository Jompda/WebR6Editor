
const imageobj_size = 42;

var viewport;
var canvas;
const objects = [];

function windowResized() {
    resizeCanvas(viewport.offsetWidth, viewport.offsetHeight);
    update();
}

function setup() {
    ToolHandler.setTool('remover');
    viewport = document.getElementById('viewport');
    canvas = createCanvas(viewport.offsetWidth, viewport.offsetHeight);
    canvas.parent('viewport');

    ToolHandler.setTint(color(255));
    //temporary object
    //objects[objects.length] = new ImageObject(0, 0, imageobj_size, imageobj_size, loadImage('assets/ash.png'), saveTint);

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

    image(bg_image, 0, 0, bg_image.width*zoom, bg_image.height*zoom);

    for(let i = objects.length-1; i > -1; i--) objects[i].draw();
}
