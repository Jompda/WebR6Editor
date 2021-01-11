import { getObjects } from "./main.js";

let lastSave = '';

function loadScene() {
    const struct = JSON.parse(lastSave);
    console.log();
}
window.loadScene = loadScene;

function saveScene() {
    const objs = getObjects();
    let result = '[', separator = '';
    objs.forEach(obj => {
        const tempCache = [];
        result += separator + JSON.stringify({ class: obj.constructor.name, instance: obj }, function replacer(key, value) {
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
    console.log(result += ']');
    lastSave = result;
}
window.saveScene = saveScene;

export {
    loadScene,
    saveScene
}
