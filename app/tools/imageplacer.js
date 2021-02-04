import { getTranslateX, getTranslateY, getZoom, isDragged, isOnObject } from '../controller.js'
import { setSelectedObject } from '../gui.js'
import ImageObj from '../objects/imageobj.js'
import { imageobj_size, getObjects, update } from '../main.js'
import { getOutline } from '../toolhandler.js'
import Tool from './tool.js'
import { assets, resourceURL } from '../preload.js'

class ImagePlacer extends Tool {

	mouseReleased() {
		if (isOnObject() || isDragged() || mouseButton !== LEFT) return;
		// Save the target location until the image is loaded.
		const posX = mouseX, posY = mouseY
		const asset = assets.get(this.options.assetId)
		loadImage(resourceURL + asset.path + asset.filename + '.png',
			(img) => ImagePlacer.placeImage(img, posX, posY, asset))
	}

	static placeImage(img, posX, posY, asset) {
		const aspect_ratio = img.width / img.height
		const imgobj = new ImageObj(
			(posX - getTranslateX())/getZoom() - imageobj_size*aspect_ratio/2, (posY - getTranslateY())/getZoom() - imageobj_size/2,
			imageobj_size*aspect_ratio, imageobj_size, img, getOutline(), asset
		)
		getObjects().unshift(imgobj)
		setSelectedObject(imgobj)
		update()
	}

}

export default ImagePlacer