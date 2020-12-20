
const sidebar_left = document.getElementById('sidebar-left');
const sidebar_right = document.getElementById('sidebar-right');
var sidebar_left_toggle;
var sidebar_right_toggle;

var subtools_container;
var tools_tools;
var attacker_tools;
var defender_tools;

function preload() {
    //let left_content = fs.readFileSync(__dirname + '/UI/sidebar-left.html', 'utf8').trim();

    // temp
    {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/UI/sidebar-left.html');
        xhr.send();
        xhr.onload = function() {
            if (xhr.status != 200) {
                console.log(`Error ${xhr.status}: ${xhr.statusText}`);
            } else {
                console.log(`Done, got ${xhr.response.length} bytes`);
                sidebar_left.innerHTML = xhr.responseText;
                sidebar_left_toggle = document.getElementById('sidebar-left-toggle');
            }
        };
    }
    {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/UI/sidebar-right.html');
        xhr.send();
        xhr.onload = function() {
            if (xhr.status != 200) {
                console.log(`Error ${xhr.status}: ${xhr.statusText}`);
            } else {
                console.log(`Done, got ${xhr.response.length} bytes`);
                sidebar_right.innerHTML = xhr.responseText;
                sidebar_right_toggle = document.getElementById('sidebar-right-toggle');
                subtools_container = document.getElementById('subtools-container');
                createTools();
                createAttackerTools();
                createDefenderTools();
                setSubTools('tools');
            }
        };
    }
    loadAssets();
}

function createTools() {
    tools_tools = document.createElement('div');
    tools_tools.appendChild(createToolButton('Remover'));
}

function createToolButton(title) {
    let elem = document.createElement('button');
    elem.setAttribute('class', 'toolbutton');
    elem.setAttribute('onclick', `setTool('${title.toLowerCase()}')`);
    elem.innerHTML = title;
    return elem;
}

function createHeader(text) {
    let elem = document.createElement('p');
    elem.setAttribute('class', 'sidebar-header');
    elem.innerHTML = text;
    return elem;
}
function createHR() {
    let elem = document.createElement('hr');
    elem.setAttribute('class', 'sidebar-hr');
    return elem;
}
function createDivCenter() {
    let elem = document.createElement('div');
    elem.setAttribute('class', 'center');
    return elem;
}
function createImageTool(title, path, filename, tint, scale) {
    if(!filename) filename = title.toLowerCase();
    if(!path) path = 'assets/';
    let elem = document.createElement('label');
    elem.setAttribute('class', 'imagetool');
    let r = document.createElement('input');
    r.setAttribute('type', 'radio');
    r.setAttribute('name', 'tool');
    r.setAttribute('onchange', `setImageTool('${filename}',${tint},${scale})`);
    let i = document.createElement('img');
    i.setAttribute('src', `${path+filename}.png`);
    i.setAttribute('title', title);
    elem.appendChild(r);
    elem.appendChild(i);
    return elem;
}

function createAttackerTools() {
    attacker_tools = document.createElement('div');
    attacker_tools.appendChild(createHeader('Attacker Icons:'));
    var center = createDivCenter();
    center.appendChild(createImageTool('Sledge'));
    center.appendChild(createImageTool('Thatcher'));
    center.appendChild(createImageTool('Ash'));
    center.appendChild(createImageTool('Thermite'));
    center.appendChild(createImageTool('Twitch'));
    center.appendChild(createImageTool('Montagne'));
    attacker_tools.appendChild(center);
    center = createDivCenter();
    center.appendChild(createImageTool('Glaz'));
    center.appendChild(createImageTool('Fuze'));
    center.appendChild(createImageTool('Blitz'));
    center.appendChild(createImageTool('IQ'));
    center.appendChild(createImageTool('Buck'));
    center.appendChild(createImageTool('Black Beard', 'assets/', 'blackbeard'));
    attacker_tools.appendChild(center);
    center = createDivCenter();
    center.appendChild(createImageTool('Capitão'));
    center.appendChild(createImageTool('Hibana'));
    center.appendChild(createImageTool('Jackal'));
    center.appendChild(createImageTool('Ying'));
    center.appendChild(createImageTool('Zofia'));
    center.appendChild(createImageTool('Dokkaebi'));
    attacker_tools.appendChild(center);
    center = createDivCenter();
    center.appendChild(createImageTool('Lion'));
    center.appendChild(createImageTool('Finka'));
    center.appendChild(createImageTool('Maverick'));
    center.appendChild(createImageTool('Nomad'));
    center.appendChild(createImageTool('Ash'));
    attacker_tools.appendChild(center);
    attacker_tools.appendChild(createHR());
    center = createDivCenter();
    center.appendChild(createImageTool('Breach Charge','assets/default_gadgets/','breachcharge', true));
    center.appendChild(createImageTool('Claymore', 'assets/default_gadgets/',undefined, true));
    center.appendChild(createImageTool('Stun Grenade', 'assets/default_gadgets/', 'stungrenade', true));
    center.appendChild(createImageTool('Smoke Grenade', 'assets/default_gadgets/', 'smokegrenade', true));
    attacker_tools.appendChild(center);
    attacker_tools.appendChild(createHR());
    center = createDivCenter();
    center.appendChild(createImageTool('Exothermic Charge','assets/special_gadgets/','exothermiccharge', false));
    center.appendChild(createImageTool('X-KAIROS','assets/special_gadgets/','x-kairos', true));
    center.appendChild(createImageTool('Breaching Torch','assets/special_gadgets/','breachingtorch', true));
    center.appendChild(createImageTool('TAC Mk0','assets/special_gadgets/','tacmk0', true));
    center.appendChild(createImageTool('Candela','assets/special_gadgets/',undefined, true));
    attacker_tools.appendChild(center);
}

function createDefenderTools() {
    defender_tools = document.createElement('div');
    defender_tools.appendChild(createHeader('Defender Icons:'));
    var center = createDivCenter();
    center.appendChild(createImageTool('Smoke'));
    center.appendChild(createImageTool('Mute'));
    center.appendChild(createImageTool('Castle'));
    center.appendChild(createImageTool('Pulse'));
    center.appendChild(createImageTool('Doc'));
    center.appendChild(createImageTool('Rook'));
    defender_tools.appendChild(center);
    center = createDivCenter();
    center.appendChild(createImageTool('Kapkan'));
    center.appendChild(createImageTool('Tachanka'));
    center.appendChild(createImageTool('Jäger'));
    center.appendChild(createImageTool('Bandit'));
    center.appendChild(createImageTool('Frost'));
    center.appendChild(createImageTool('Valkyrie'));
    defender_tools.appendChild(center);
    center = createDivCenter();
    center.appendChild(createImageTool('Caveira'));
    center.appendChild(createImageTool('Echo'));
    center.appendChild(createImageTool('Mira'));
    center.appendChild(createImageTool('Lesion'));
    center.appendChild(createImageTool('Ela'));
    center.appendChild(createImageTool('Vigil'));
    defender_tools.appendChild(center);
    center = createDivCenter();
    center.appendChild(createImageTool('Maestro'));
    center.appendChild(createImageTool('Alibi'));
    center.appendChild(createImageTool('Clash'));
    center.appendChild(createImageTool('Kaid'));
    center.appendChild(createImageTool('Ash'));
    defender_tools.appendChild(center);
    defender_tools.appendChild(createHR());
    center = createDivCenter();
    center.appendChild(createImageTool('Reinforcement', 'assets/default_gadgets/', undefined, true));
    center.appendChild(createImageTool('Barricade', 'assets/default_gadgets/', undefined, true));
    center.appendChild(createImageTool('Nitrocell', 'assets/default_gadgets/', undefined, true));
    center.appendChild(createImageTool('Deployable Shield', 'assets/default_gadgets/', 'deployableshield', true));
    center.appendChild(createImageTool('Barbed Wire', 'assets/default_gadgets/', 'barbedwire', true));
    center.appendChild(createImageTool('Impact Grenade', 'assets/default_gadgets/', 'impactgrenade', true));
    defender_tools.appendChild(center);
    defender_tools.appendChild(createHR());
    center = createDivCenter();
    center.appendChild(createImageTool('Remote Gas Grenade', 'assets/special_gadgets/', 'remotegasgrenade'));
    center.appendChild(createImageTool('Signal disruptor', 'assets/special_gadgets/', 'signaldisruptor'));
    center.appendChild(createImageTool('Armor Panel', 'assets/special_gadgets/', 'armorpanel'));
    center.appendChild(createImageTool('Active Defense System', 'assets/special_gadgets/', 'activedefensesystem'));
    defender_tools.appendChild(center);
    center = createDivCenter();
    center.appendChild(createImageTool('Shock Wire', 'assets/special_gadgets/', 'shockwire'));
    center.appendChild(createImageTool('Welcome Mat', 'assets/special_gadgets/', 'welcomemat', true, 0.7));
    center.appendChild(createImageTool('Black Eye', 'assets/special_gadgets/', 'blackeye', true, 0.9));
    center.appendChild(createImageTool('Yokai', 'assets/special_gadgets/', 'yokai', true, 0.8));
    center.appendChild(createImageTool('Black Mirror', 'assets/special_gadgets/', 'blackmirror', true, 0.6));
    defender_tools.appendChild(center);
    center = createDivCenter();
    center.appendChild(createImageTool('Gu', 'assets/special_gadgets/', undefined, true, 0.9));
    center.appendChild(createImageTool('Grzmot Mine', 'assets/special_gadgets/', 'grzmotmine', true, 0.9));
    center.appendChild(createImageTool('Evil Eye', 'assets/special_gadgets/', 'evileye', true));
    center.appendChild(createImageTool('Prisma', 'assets/special_gadgets/', undefined, true));
    defender_tools.appendChild(center);
}
