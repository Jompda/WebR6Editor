/**
 * Obj representing any object on the canvas.
 */
class Obj {

	/**
	 * @param {number} x 
	 * @param {number} y 
	 * @param {color=} outline 
	 */
	constructor(x, y, outline) {
		this.x = x; this.y = y
		this.outline = outline
		this.rotation = 0
		/**@type {ControlPoint[]} */
		this.controlPoints = []
	}

	/**
	 * Draw this object on the canvas.
	 */
	draw() {}

	/**
	 * Draw edit mode of this object.
	 */
	drawEditMode() {}

	/**
	 * Checks if a point is intersecting this object.
	 * @param {number} x 
	 * @param {number} y 
	 * @returns {boolean}
	 */
	intersects(x, y) {}

	/**
	 * Returns a control point which can be used to edit the object.
	 * @returns {ControlPoint}
	 */
	getControlPoint() {
		return {
			drag: function() {}
		}
	}

	/**
	 * @returns {HTMLElement}
	 */
	getObjectPropertiesGUI() {}

	/**
	 * @param {string} outline 
	 */
	parseOutline(outline) {
		if (outline === '') {
			this.outline = undefined
			return true
		}
		this.outline = color(outline)
		return true
	}

}

// TODO
export class ControlPoint {

	constructor() {}

	draw() {}

	intersects(oldX, oldY, newX, newY) {}

	drag() {}

}

export default Obj