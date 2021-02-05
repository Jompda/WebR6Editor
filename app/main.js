import { initRoomFromURL } from './roomhandler.js' // Just to initialize the roomhandler.
import { getTool } from './toolhandler.js'
import {
	getTranslateX, setTranslateX,
	getTranslateY, setTranslateY,
	getZoom, setZoom
} from './controller.js'
import { resourceURL } from './preload.js'
import { getSelectedObject, showObjectProperties } from './gui.js'
import Obj from './objects/obj.js'
import ImagePlacer from './tools/imageplacer.js'

/* BEGIN SEGMENT
 * Set up the DOM.
 */
document.getElementsByTagName('body')[0].setAttribute('onresize', 'windowResized()')
const viewport = document.getElementById('viewport')
const imageobj_size = 100
/**@type {String} */
var backgroundImageUrl
const getBackgroundImageUrl = () => backgroundImageUrl
var backgroundImage
var canvas
/**@type {Obj[]}*/
const objects = []
const getObjects = () => objects

window.windowResized = () =>
	update(resizeCanvas(viewport.offsetWidth, viewport.offsetHeight))
document.oncontextmenu = () => false
/*
 * END SEGMENT
 */


/* BEGIN SEGMENT
 * Various functions related to drawing and interacting with the slide.
 */
/**
 * Called the by p5js library right before the draw-loop begins.
 * It is in charge of creating the canvas and making the software ready for use.
 */
window.setup = function() {
	backgroundImage = createImage(1,1) // Just to avoid background-image drawing errors.
	canvas = createCanvas(viewport.offsetWidth, viewport.offsetHeight)
	canvas.parent(viewport)
	update()
}

/**Determines whether or not the slide needs to be redrawn.*/
var scheduledUpdate = false
/**Redraw the slide.*/
const update = window.update = () => scheduledUpdate = true

/**
 * Called by the p5js library in a continuous loop.
 */
window.draw = function() {
	if (!scheduledUpdate) return;
	scheduledUpdate = false

	showObjectProperties(getSelectedObject())

	//const srdate = new Date();

	// Basic setup.
	clear()
	translate(getTranslateX(), getTranslateY())
	scale(getZoom())
	
	// Background image.
	image(backgroundImage, 0, 0)

	// Objects.
	for (let i = objects.length-1; i > -1; i--) {
		push()
		const tempObj = objects[i]
		translate(tempObj.x, tempObj.y)
		tempObj.draw()
		pop()
	}

	// Selected object's highlight.
	const selobj = getSelectedObject()
	if (selobj) {
		push()
		selobj.drawEditMode(getTool().editAllowed)
		pop()
	}

	//const renderTime = new Date()-srdate;
	//console.log(`${renderTime} millisecond${renderTime==1?'':'s'} render time.`);
}

/**
 * @param {Number} x 
 * @param {Number} y 
 */
function getIntersectingObject(x, y) {
	for (let i = 0; i < objects.length; i++)
		if (objects[i].intersects(x, y))
			return { obj: objects[i], i }
}

/**
 * @param {String} mapUrl 
 */
const changeMap = window.changeMap = (mapUrl) => {
	if (mapUrl !== '-----') {
		const loadingbg = createGraphics(viewport.offsetWidth, viewport.offsetHeight)
		loadingbg.fill(255, 0, 0); loadingbg.textSize(64); loadingbg.textAlign(CENTER)
		loadingbg.text('Loading background image..', loadingbg.width/2, loadingbg.height/2)
		focusToImage(loadingbg)

		loadImage(resourceURL+(backgroundImageUrl=mapUrl), focusToImage)
		
		function focusToImage(img) {
			backgroundImage = img
			// Focus the viewport to the background-image.
			const tx = -(img.width/2 - width/2), zoom = 1
			setTranslateX(tx)
			setTranslateY(0)

			// Alter the zoom.
			setZoom(zoom)
			let zoomDelta = (height / img.height)-zoom

			// Keep the translation focused on the
			// same point with the new zoom.
			setTranslateX(tx-(width/2-tx)/zoom * zoomDelta)
			setZoom(zoom+zoomDelta)

			update()
		}
	}
}

/**
 * Loads images and possibly strats from json files in the future.
 * NOTE: Saving a slide which has a custom image currently destroys the save file.
 * @param {DragEvent} event 
 */
window.dropHandler = function(event) {
	event.preventDefault()

	if (event.dataTransfer.items) {
		const fileArray = event.dataTransfer.items
		for (let i = 0; i < fileArray.length; i++)
			if (fileArray[i].kind === 'file')
				handleFile(fileArray[i].getAsFile())
	} else {
		const fileArray = event.dataTransfer.files
		for (let i = 0; i < fileArray.length; i++)
			handleFile(fileArray[i].getAsFile())
	}

	/**
	 * @param {File} file 
	 */
	function handleFile(file) {
		console.log(`Processing file '${file.name}'.`)

		if (!file.name.endsWith('.png') && !file.name.endsWith('.jpg'))
			return console.log('Currently the only supported file types are png and jpg.')

		const reader = new FileReader()
		reader.onload = (file) => {
			// Save the target location until the image is loaded.
			const posX = mouseX, posY = mouseY
			// Temporary hack, doesn't support saving the slide.
			loadImage(file.target.result, (img) => ImagePlacer.placeImage(img, posX, posY, { path: '', filename: file.target.result }))
		}
		reader.readAsDataURL(file)
	}
}
/*
 * END SEGMENT
 */

export {
	imageobj_size,
	getObjects,
	update,
	getIntersectingObject,
	changeMap,
	getBackgroundImageUrl
}
