import { setSelectedObject, showObjectProperties } from "./gui.js";
import { getBackgroundImageUrl, getObjects, update } from "./main.js";
import ImageObj from "./objects/imageobj.js";

let lastSave = '';

function loadScene() {
    showObjectProperties(setSelectedObject());
    const objects = getObjects();
    objects.splice(0, objects.length);

    const saveData = JSON.parse(lastSave);
    console.log(saveData);
    
    saveData.objects.forEach(obj => {
        switch (obj.class) {
            case 'ImageObj': objects.push(ImageObj.fromObject(obj.instance)); break;
            default: break;
        }
    });

    update();
}
window.loadScene = loadScene;

function saveScene() {
    const objs = getObjects();
    const cache = []; // Used to avoid circular structures in the JSON.
    lastSave = JSON.stringify({
        creator: 'Jompda', // Placeholder for a user system.
        timestamp: new Date(),
        backgroundImageUrl: getBackgroundImageUrl(),
        objects: objs
    }, replacer);
    console.log(lastSave);

    function replacer(key, value) {
        if (key === 'image' || key === 'outlineImage' || key === 'controlPoints') return;
        if (key === 'outline' && value) return { type: 'p5RgbColor', levels: value.levels };
        if (typeof value === 'object' && value !== null) {
            if (key !== 'instance' && value.constructor.name === 'ImageObj') return { class: value.constructor.name, instance: value };

            // avoid cycles
            if (cache.includes(value)) return;
            cache.push(value);
        }
        return value;
    }
}

/*function saveScene() {
    const objs = getObjects();
    let objList = '[', separator = '';
    objs.forEach(obj => {
        const tempCache = [];
        objList += separator + JSON.stringify({ class: obj.constructor.name, instance: obj }, function replacer(key, value) {
            if (key === 'image' || key === 'outlineImage' || key === 'controlPoints') return;
            if (key === 'outline' && value) return { type: 'p5RgbColor', levels: value.levels };
            if (typeof value === 'object' && value !== null) {
                if (tempCache.includes(value)) return;
                tempCache.push(value);
            }
            return value;
        });
        separator = ',';
    });
    objList += ']'
    lastSave = JSON.stringify({
        creator: 'Jompda', // Placeholder for a user system.
        timestamp: new Date(),
        backgroundImageUrl: getBackgroundImageUrl(),
        objects: objList
    });
    console.log(lastSave);
}*/
window.saveScene = saveScene;

export {
    loadScene,
    saveScene
}
