import { getObjects } from "./main.js";

function loadScene() {

}
window.loadScene = loadScene;

function saveScene() {
    const objs = getObjects();
    objs.forEach(obj => {
        const cache = [];
        const str = JSON.stringify({ class: obj.constructor.name, instance: obj }, function replacer(key, value) {
            if (key === 'image' || key === 'controlPoints' || (key === 'outlineImage' && typeof value === 'object')) return;
            if (key === 'outline' && value) {
                return { type: 'rgbColor', levels: value.levels };
            }
            if (typeof value === 'object' && value !== null) {
                if (cache.includes(value)) return;
                cache.push(value);
            }
            return value;
        });
        console.log(str);
    });

}
window.saveScene = saveScene;

export {
    loadScene,
    saveScene
}
