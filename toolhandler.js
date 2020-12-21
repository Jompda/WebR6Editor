
class ToolHandler {

    static subtools_container;
    static basic_tools; // Wtf is this name?
    static attacker_tools;
    static defender_tools;

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
        if(this.subtools_container.firstChild) this.subtools_container.removeChild(this.subtools_container.firstChild);
        let toolsPage;
        switch (name) {
            case 'tools': toolsPage = this.basic_tools; break;
            case 'attacker': toolsPage = this.attacker_tools; break;
            case 'defender': toolsPage = this.defender_tools; break;
            default: return;
        }
        this.subtools_container.appendChild(toolsPage);
    }

    static clearSelectedTool() {
        const elem = document.getElementsByName("tool");
        for(let i=0;i<elem.length;i++)
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
