
const ToolHandler = {

    subtools_container: undefined,
    toolGroups: new Map([
        [ 'basic', document.createElement('div') ]
    ]),

    tool: undefined,
    tools: [],

    // Doesn't need setter and getter.
    saveTint: undefined,
    getTint() {return this.saveTint},
    setTint(tint) {this.saveTint = tint},

    setTool(name) {
        for (let i = 0; i < this.tools.length; i++) {
            if (this.tools[i].name == name) {
                this.tool = this.tools[i];
                //console.log(this.tool);
            }
        }
    },

    setImageTool(name) {
        this.tool = new function() {
            this.onRelease = function() {
                if (!onObject) {
                    const img = preloadedImages.get(name);
                    var aspect_ratio = img.width / img.height;
                    objects.unshift(new ImageObject(
                        (mouseX - translateX)/zoom - imageobj_size*aspect_ratio/2, (mouseY - translateY)/zoom - imageobj_size/2,
                        imageobj_size*aspect_ratio, imageobj_size, img, ToolHandler.getTint()
                    ));
                }
            }
        }
    },

    setSubTools(group) {
        this.clearSelectedTool();
        if (this.subtools_container.firstChild) this.subtools_container.removeChild(this.subtools_container.firstChild);
        this.subtools_container.appendChild(this.toolGroups.get(group));
    },

    clearSelectedTool() {
        const elem = document.getElementsByName("tool");
        for (let i=0;i<elem.length;i++)
            elem[i].checked = false;
    }
}

// Temporary way of initializing the remover tool.
ToolHandler.tools.push(new function() {
    this.name = 'remover';
    this.onRelease = function() {
        if (onObject && !dragged) {
            let index = objects.indexOf(onObject);
            objects.splice(index, 1);
        }
    }
});
