
const tools = [];
var saveTint = undefined;
function getTint() {return saveTint;}
function setTint(tint) {saveTint = tint;}

function setTool(name) {
    for(let i = 0; i < tools.length; i++) {
        if(tools[i].name == name) {
            tool = tools[i];
            console.log(tool);
        }
    }
}

function setImageTool(name) {
    tool = new function() {
        this.onRelease = function() {
            if(!onObject) {
                const scale = 1, img = preloadedImages.get(name);
                var aspect_ratio = img.width / img.height;
                objects.unshift(new ImageObject(
                    (mouseX - translateX)/zoom, (mouseY - translateY)/zoom,
                    imageobj_size*aspect_ratio*scale, imageobj_size*scale, img, getTint()
                ));
            }
        }
    }
}

function setSubTools(name) {
    clearSelectedTool();
    if(subtools_container.firstChild) subtools_container.removeChild(subtools_container.firstChild);
    if(name == 'attacker') {
        subtools_container.appendChild(attacker_tools);
    }
    else if(name == 'defender') {
        subtools_container.appendChild(defender_tools);
    }
    else if(name == 'tools') {
        subtools_container.appendChild(tools_tools);
    }
}

function clearSelectedTool() {
    var elem = document.getElementsByName("tool");
    for(var i=0;i<elem.length;i++)
        elem[i].checked = false;
}


tools[tools.length] = new function() {
    this.name = 'remover';
    this.onRelease = function() {
        if(onObject && !dragged) {
            let index = objects.indexOf(onObject);
            objects.splice(index, 1);
        }
    }
}
