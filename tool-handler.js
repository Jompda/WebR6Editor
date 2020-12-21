
class ToolHandler {
    static tool;
    static tools = [];

    // Doesn't need setter and getter.
    static saveTint = undefined;
    static getTint() {return this.saveTint;}
    static setTint(tint) {this.saveTint = tint;}

    static setTool(name) {
        for(let i = 0; i < this.tools.length; i++) {
            if(this.tools[i].name == name) {
                this.tool = this.tools[i];
                //console.log(this.tool);
            }
        }
    }

    static setImageTool(name) {
        this.tool = new function() {
            this.onRelease = function() {
                if(!onObject) {
                    const scale = 1, img = preloadedImages.get(name);
                    var aspect_ratio = img.width / img.height;
                    objects.unshift(new ImageObject(
                        (mouseX - translateX)/zoom, (mouseY - translateY)/zoom,
                        imageobj_size*aspect_ratio*scale, imageobj_size*scale, img, ToolHandler.getTint()
                    ));
                }
            }
        }
    }

    static setSubTools(name) {
        this.clearSelectedTool();
        if(subtools_container.firstChild) subtools_container.removeChild(subtools_container.firstChild);
        var tools_page;
        switch (name) {
            case 'tools': tools_page = tools_tools; break;
            case 'attacker': tools_page = attacker_tools; break;
            case 'defender': tools_page = defender_tools; break;
            default: return;
        }
        subtools_container.appendChild(tools_page);
    }

    static clearSelectedTool() {
        var elem = document.getElementsByName("tool");
        for(var i=0;i<elem.length;i++)
            elem[i].checked = false;
    }
}

ToolHandler.tools.push(new function() {
    this.name = 'remover';
    this.onRelease = function() {
        if(onObject && !dragged) {
            let index = objects.indexOf(onObject);
            objects.splice(index, 1);
        }
    }
});
