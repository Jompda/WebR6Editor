
const imageobj_size = 42;
const images = [];

var bg_image;
function changeMap(name) {
    if(!name.includes('-----'))
        bg_image = loadImage(`assets/maps/${name}.jpg`);
}

function getImageByName(name) {
    for(let i = 0; i < images.length; i++) {
        if(images[i].name == name) return images[i].image;
    }
    return undefined;
}

function loadAssets() {
    //DEFAULT GADGETS
    //ATTACKER
    images[images.length] = new function() {
        this.name = 'breachcharge';
        this.image = loadImage(`assets/default_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'claymore';
        this.image = loadImage(`assets/default_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'stungrenade';
        this.image = loadImage(`assets/default_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'smokegrenade';
        this.image = loadImage(`assets/default_gadgets/${this.name}.png`);
    }
    //DEFENDER
    images[images.length] = new function() {
        this.name = 'reinforcement';
        this.image = loadImage(`assets/default_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'barricade';
        this.image = loadImage(`assets/default_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'nitrocell';
        this.image = loadImage(`assets/default_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'deployableshield';
        this.image = loadImage(`assets/default_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'barbedwire';
        this.image = loadImage(`assets/default_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'impactgrenade';
        this.image = loadImage(`assets/default_gadgets/${this.name}.png`);
    }
    //OPERATOR SPECIFIC GADGETS
    //ATTACKER
    images[images.length] = new function() {
        this.name = 'exothermiccharge';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'x-kairos';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'breachingtorch';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'tacmk0';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'candela';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    //DEFENDER
    images[images.length] = new function() {
        this.name = 'remotegasgrenade';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'signaldisruptor';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'armorpanel';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'activedefensesystem';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'shockwire';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'welcomemat';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'blackeye';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'yokai';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'blackmirror';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'gu';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'grzmotmine';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'evileye';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
    images[images.length] = new function() {
        this.name = 'prisma';
        this.image = loadImage(`assets/special_gadgets/${this.name}.png`);
    }
}
