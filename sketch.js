
const imageobj_size = 42;

var viewport;
var canvas;
var zoom = 1;
const objects = [];

function windowResized() {
    resizeCanvas(viewport.offsetWidth, viewport.offsetHeight);
}

function setup() {
    setTool('remover');
    viewport = document.getElementById('viewport');
    canvas = createCanvas(viewport.offsetWidth, viewport.offsetHeight);
    canvas.parent('viewport');

    setTint(color(255));
    //temporary object
    //objects[objects.length] = new ImageObject(0, 0, imageobj_size, imageobj_size, loadImage('assets/ash.png'), saveTint);

}

var update = true;
function draw() {
    if (!update) return;
    update = false;
    background(17);
    translate(translateX, translateY);

    image(bg_image, 0, 0, bg_image.width*zoom, bg_image.height*zoom);

    for(let i = objects.length-1; i > -1; i--) objects[i].draw();
}
