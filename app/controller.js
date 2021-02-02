import { getObjects, getIntersectingObject, update } from './main.js';
import { getTool } from './toolhandler.js';
import { setSelectedObject } from './gui.js';
import Obj from './objects/obj.js';

/* BEGIN SEGMENT
 * Filtering events outside the viewport.
 */
var dragOriginatedFromViewport = false
const isDragOriginatedFromViewport = () => dragOriginatedFromViewport;
{
	var dragging = false;
	var mouseOnViewport = false;

	const viewport = document.getElementById('viewport');
	viewport.onmouseenter = () => mouseOnViewport = true;
	viewport.onmouseleave = () => mouseOnViewport = false;
	window.onmousedown = (e) =>
		(dragOriginatedFromViewport = mouseOnViewport) ? mousePressed(e) : 0;
	window.onmouseup = (e) => {
		dragging = false;
		if (mouseOnViewport) mouseReleased(e);
	};
	window.mouseDragged = (e) => {
		dragging = true;
		if (!mouseOnViewport && !dragOriginatedFromViewport) return;
		e.preventDefault();
		mouseDragged(e);
	}
	window.mouseWheel = (e) => {
		if (!mouseOnViewport) return;
		e.preventDefault();
		mouseWheel(e);
	}
}
/*
 * END SEGMENT
 */


/* BEGIN SEGMENT
 * Placeholder for media key controls -support.
 */
window.enableMediaKeys = function () {
	if (!('mediaSession' in navigator)) return alert(`The current browser doesn't support mediakeys. ` + navigator.appVersion);
	document.getElementById('mk').play();
	navigator.mediaSession.metadata = new MediaMetadata({
		artist: 'Jompda',
		artwork: [
			{
				src: 'https://Jompda.github.io/WebR6Editor/assets/operators/ash.png', sizes: '100x100'
			}
		]
	});
	[
		[ 'play', () => console.log('play') ],
		[ 'pause', () => console.log('pause') ],
		[ 'stop', () => console.log('stop') ],
		[ 'seekbackward', () => console.log('previous') ],
		[ 'seekforward', () => console.log('next') ],
		[ 'seekto', () => console.log('idk what') ],
		[ 'previoustrack', () => console.log('previous') ],
		[ 'nexttrack', () => console.log('next') ]
	].forEach((handler) => navigator.mediaSession.setActionHandler(handler[0], handler[1]));
}
/* 
 * END SEGMENT
 */


/* BEGIN SEGMENT
 * Viewport controls.
 */
var translateX = 0, translateY = 0;
const getTranslateX = () => translateX;
function setTranslateX(tx) { translateX = tx }
const getTranslateY = () => translateY;
function setTranslateY(ty) { translateY = ty }

var zoom = 1, minZoom = 0.2;
const getZoom = () => zoom;
function setZoom(z) { zoom = z }

var lastMouseX, lastMouseY;
/**@type {Obj} */
var onObject = undefined;
var controlPoint = undefined;
const isOnObject = () => onObject;
var dragged = false;
const isDragged = () => dragged;

function mousePressed(event) {
	onObject = undefined;
	dragged = false;
	updateLastMousePosition();

	const tool = getTool();

	// Check for intersection.
	setSelectedObject(undefined);
	const intersecting = getIntersectingObject((mouseX - translateX)/zoom, (mouseY - translateY)/zoom);
	if (intersecting) {
		setSelectedObject(onObject = intersecting.obj);
		if (tool.editAllowed) controlPoint = onObject.getControlPoint((mouseX - translateX)/zoom, (mouseY - translateY)/zoom);
		// Move to first for rendering purposes.
		getObjects().splice(intersecting.i, 1);
		getObjects().unshift(onObject);
	}
	update();
	
	tool.mousePressed(event, onObject);
}

function mouseDragged(event) {
	dragged = true;

	if (mouseButton === CENTER) dragViewport();
	else {
		const tool = getTool();
		if (tool.editAllowed && controlPoint) controlPoint.drag((lastMouseX - translateX)/zoom, (lastMouseY - translateY)/zoom, (mouseX - translateX)/zoom, (mouseY - translateY)/zoom);
		else tool.mouseDragged(event, onObject);
	}
	
	updateLastMousePosition();
}

function mouseReleased(event) {
	getTool().mouseReleased(event, onObject);
	controlPoint = undefined;
	onObject = undefined;
	dragged = false;
	updateLastMousePosition();
}

/*function mouseMoved() {
	if(filterSidebars()) return;
	if(tool.onMove) tool.onMove();
}*/

function mouseWheel(event) {
	let zoomDelta = -event.delta*zoom/750;
	if (zoom + zoomDelta < minZoom)
		zoomDelta += minZoom-(zoom+zoomDelta);

	adjustTranslation();
	zoom += zoomDelta;

	update();

	function adjustTranslation() {
		// Relative to cursor.
		translateX -= (mouseX-translateX)/zoom * zoomDelta;
		translateY -= (mouseY-translateY)/zoom * zoomDelta;
		// Relative to the camera position AKA center of the viewport.
		//translateX -= (width/2-translateX)/zoom * zoomDelta;
		//translateY -= (height/2-translateY)/zoom * zoomDelta;
	}
}

function dragViewport() {
	const deltaX = mouseX - lastMouseX, deltaY = mouseY - lastMouseY;
	translateX += deltaX; translateY += deltaY;
	update();
}

function dragObject(obj) {
	const deltaX = mouseX - lastMouseX, deltaY = mouseY - lastMouseY;
	obj.x += deltaX/zoom; obj.y += deltaY/zoom;
	update();
}

const updateLastMousePosition = () => { lastMouseX = mouseX; lastMouseY = mouseY; };
/*
 * END SEGMENT
 */

export {
	isDragOriginatedFromViewport,
	mousePressed, mouseDragged, mouseReleased, mouseWheel,
	getTranslateX, setTranslateX,
	getTranslateY, setTranslateY,
	getZoom, setZoom,
	isOnObject,
	isDragged,
	dragViewport,
	dragObject,
	updateLastMousePosition
};