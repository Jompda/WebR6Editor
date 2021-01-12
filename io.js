import { setSelectedObject, showObjectProperties } from "./gui.js";
import { changeMap, getBackgroundImageUrl, getObjects, update } from "./main.js";
import ImageObj from "./objects/imageobj.js";
import { getHttpResource } from "./preload.js";

function loadScene() {
    showObjectProperties(setSelectedObject());
    const objects = getObjects();
    objects.splice(0, objects.length);
    
    const sceneName = document.getElementById('scene-name').value;
    getHttpResource(`saved/${sceneName}.json`, (xhr) => {
        const saveData = JSON.parse(xhr.responseText);
        console.log(saveData);

        changeMap(saveData.backgroundImageUrl);
        
        saveData.objects.forEach(obj => {
            switch (obj.class) {
                case 'ImageObj': objects.push(ImageObj.fromObject(obj.instance)); break;
                default: break;
            }
        });
    
        update();
    });
}
window.loadScene = loadScene;

function saveScene() {
    const objs = getObjects();
    const cache = []; // Used to avoid circular structures in the JSON.
    const saveData = JSON.stringify({
        creator: 'Jompda', // Placeholder for a user system.
        timestamp: new Date(),
        backgroundImageUrl: getBackgroundImageUrl(),
        objects: objs
    }, replacer);
    //console.log(saveData);

    const sceneName = document.getElementById('scene-name').value;

    // Save the strat
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `saved/${sceneName}.json`); xhr.send(saveData);
    xhr.onerror = () => console.log(`Error ${xhr.status}: ${xhr.statusText}`);
    xhr.onload = () => {
        if (xhr.status != 200) return;
    }

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
window.saveScene = saveScene;

export {
    loadScene,
    saveScene
}