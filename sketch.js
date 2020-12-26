import { setTool } from './toolhandler.js';
import { getTranslateX, setTranslateX, getTranslateY, setTranslateY, getZoom, setZoom } from './controller.js';
import { resourceURL } from './preload.js';

const imageobj_size = 42;

var bg_image;
var canvas;
const viewport = document.getElementById('viewport');
const objects = [];

window.windowResized = () =>
    update(resizeCanvas(viewport.offsetWidth, viewport.offsetHeight));

window.setup = function setup() {
    bg_image = createImage(1,1); // Just to avoid background-image drawing errors.
    setTool('remover');
    canvas = createCanvas(viewport.offsetWidth, viewport.offsetHeight);
    canvas.parent(viewport);

    document.oncontextmenu = () => false;
    update();
}

var updateCounter = 2;
window.update = function update() {
    updateCounter = 2;
}

window.draw = function draw() {
    if (updateCounter > 0) updateCounter--;
    else return;

    //const srdate = new Date();
    background(17);
    translate(getTranslateX(), getTranslateY());

    scale(getZoom());
    image(bg_image, 0, 0);

    for (let i = objects.length-1; i > -1; i--) {
        push(); objects[i].draw(); pop();
    }
    //const renderTime = new Date()-srdate;
    //console.log(`${renderTime} millisecond${renderTime==1?'':'s'} render time.`);
}

function changeMap(name) {
    if (name !== '-----') {
        bg_image = loadImage(`${resourceURL}assets/maps/${name}.jpg`, focusToImage);
        
        function focusToImage(img) {
            // Focus the viewport to the background-image.
            setTranslateX(-(img.width/2 - width/2));
            setTranslateY(0);

            // Alter the zoom.
            setZoom(1);
            const zoom = getZoom();
            let zoomDelta = (height / img.height)-zoom;
            /*if (zoom + zoomDelta < minZoom)
                zoomDelta += minZoom-(zoom+zoomDelta);*/

            // Keep the translation focused onto the
            // same point with the new zoom.
            setTranslateX(getTranslateX()-(width/2-getTranslateX())/zoom * zoomDelta);
            setZoom(zoom+zoomDelta);

            update();
        }
    }
}
window.changeMap = changeMap;

export {
    imageobj_size,
    objects,
    changeMap
};