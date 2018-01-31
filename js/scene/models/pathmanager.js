import NodeControl from "./nodecontrol"
import * as THREE from "../../libs/three"

const degtorad = Math.PI / 180,
    boxcolors = ["#bc2849", "#4a7778", "#ffba6f", "#007ebe", "#ba6689", "#db8d41", "#3dadc2"],
    colorcount = 6,
    boxcount = 16,
    changetime = 3,
    childrencount = 16,
    hstep = 0.5,
    vstep = 0.25,
    initcount = 6,
    dropheight = 4,
    dropnum = 4,
    crosscount = 12;
let state, playercontrol, boxpool = [],
    boxindex = 0,
    boxmat,
    colorindex = THREE.Math.randInt(0, colorcount),
    boxmatcolor = new THREE.Color(boxcolors[colorindex]),
    canchange = false,
    changetimer = 0,
    childrenpool = [],
    childrenindex = 0,
    crosspool = [],
    crossindex = 0,
    dropindex = 0,
    droptime = 0.4,
    droptimer = 0,
    crosstimes = 0,
    lastnum = 0,
    spanxdir = false,
    lastdir = spanxdir,
    lastpos = new THREE.Vector3(0, 0, 0),
    boxnextcolor = new THREE.Color(boxcolors[colorindex]);
let childrenpos = new THREE.Vector3(),
    targetchildrenpos = new THREE.Vector3();
export let nodespool = boxpool;
export let playerindex = {
    value: 0
};
export let count = boxcount;

export function init(gamestate, assets, curplayercontrol, scene) {
    state = gamestate;
    playercontrol = curplayercontrol;
    createPrefabs(assets, scene);
    initSpanBox();
}
export function update(dt) {
    updateAllBox(dt);
    boxcolorchange(dt);

    if (state.curstate.value !== state.states.control) {
        return;
    }

    autoDrop(dt);
}
export function reset() {
    dropindex = 0;
    droptime = 0.4;
    droptimer = 0;
    boxindex = 0;
    childrenindex = 0;
    crossindex = 0;
    lastpos.set(0, 0, 0);
    crosstimes = 0;
    canchange = false;
    lastnum = 0;
    spanxdir = false;
    lastdir = spanxdir;
    playerindex.value = 0;

    colorindex = THREE.Math.randInt(0, colorcount);
    boxmatcolor = new THREE.Color(boxcolors[colorindex]);
    boxmat.color.copy(boxmatcolor);

    let i = 0;
    for (i = 0; i < boxcount; i++) {
        boxpool[i].init();
    }
    for (i = 0; i < childrencount; i++) {
        childrenpool[i].visible = false;
    }
    for (i = 0; i < crosscount; i++) {
        crosspool[i].visible = false;
    }
    initSpanBox();
}
export function spanBox() {

    boxindex = boxindex >= boxcount ? 0 : boxindex;

    let opts = {},
        nodecontrol = boxpool[boxindex];
    opts.xdir = spanxdir;

    if (crosstimes > 0) {
        crossindex = crossindex >= crosscount ? 0 : crossindex;
        opts.hasChildren = true;
        opts.childrennode = crosspool[crossindex];

        childrenpos.copy(lastpos);

        spanxdir ? (childrenpos.x += (4 - crosstimes) * hstep, childrenpos.z -= (5 - crosstimes) * hstep) : (childrenpos.x -= (5 - crosstimes) * hstep, childrenpos.z += (4 - crosstimes) * hstep);
        childrenpos.y += vstep;

        opts.childrenPos = new THREE.Vector3(childrenpos.x, childrenpos.y + dropheight, childrenpos.z);
        opts.childrennextPos = childrenpos;
        opts.hit = false;
        if (crosstimes > 3) {
            opts.cross = true;
            opts.hit = true;
        }
        crossindex++;
        crosstimes--;
        if (spanxdir) {
            lastpos.x -= hstep;
        } else {
            lastpos.z -= hstep;
        }
        lastpos.y += vstep;
        opts.pos = new THREE.Vector3(lastpos.x, lastpos.y + dropheight, lastpos.z);
        opts.nextPos = lastpos;
    } else {
        let cross = Math.random() > 0.8;
        if (cross) { crosstimes = 4; }
        let haschildren = cross ? false : Math.random() > 0.5;

        if (haschildren) {
            childrenindex = childrenindex >= childrencount ? 0 : childrenindex;
            opts.hasChildren = haschildren;
            opts.childrennode = childrenpool[childrenindex];

            childrenpos.copy(lastpos);
            spanxdir ? childrenpos.z -= hstep : childrenpos.x -= hstep;
            childrenpos.y += vstep;

            let hit = Math.random() > 0.5;
            if (!hit) {
                let offset = THREE.Math.randInt(1, 3);
                spanxdir ? childrenpos.z -= offset * hstep : childrenpos.x -= offset * hstep;
            }
            opts.hit = hit;
            targetchildrenpos.set(childrenpos.x, childrenpos.y + dropheight, childrenpos.z);
            opts.childrenPos = targetchildrenpos;
            opts.childrennextPos = childrenpos;
            childrenindex++;
        }

        if (spanxdir) {
            lastpos.x -= hstep;
        } else {
            lastpos.z -= hstep;
        }
        lastpos.y += vstep;
        opts.pos = new THREE.Vector3(lastpos.x, lastpos.y + dropheight, lastpos.z);
        opts.nextPos = lastpos;

        spanxdir = Math.random() > 0.5;
        if (spanxdir && lastdir || !spanxdir && !lastdir) {
            lastnum++;
            if (lastnum > 3) {
                lastnum = 0;
                spanxdir = !spanxdir;
            }
        }
        lastdir = spanxdir;
    }

    nodecontrol.reset(opts);
    nodecontrol.upMove();
    boxindex++;
    showCross();
    limitDrop();
    levelchange();
}

function createPrefabs(assets, scene) {
    boxmat = new THREE.MeshStandardMaterial();
    boxmat.color.copy(boxmatcolor);
    let boxgeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1),
        planegeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    let i = 0;

    for (i = 0; i < boxcount; i++) {
        let boxprefab = new THREE.Mesh(boxgeometry, boxmat);
        boxprefab.scale.set(hstep, vstep, hstep);
        boxprefab.visible = false;
        scene.add(boxprefab);
        let nodecontrol = new NodeControl(boxprefab);
        boxpool.push(nodecontrol);
    }

    let crossmat = new THREE.MeshBasicMaterial();
    crossmat.transparent = true;
    crossmat.lights = false;
    crossmat.map = assets.getTexture("cross");
    for (i = 0; i < crosscount; i++) {
        let boxprefab = new THREE.Mesh(boxgeometry, boxmat);
        boxprefab.scale.set(hstep, vstep, hstep);
        boxprefab.visible = false;
        if (i % 4 === 0) {
            let crossprefab = new THREE.Mesh(planegeometry, crossmat);
            crossprefab.scale.set(0.7, 1.3, 1);
            crossprefab.position.set(0, 1, 0);
            crossprefab.rotation.set(degtorad * -35, degtorad * 45, 0, "YXZ");
            boxprefab.add(crossprefab);
        }
        crosspool.push(boxprefab);
        scene.add(boxprefab);
    }


    let settings = [
        { color: "#12A4CA", scale: new THREE.Vector3(1.1, 1.6, 1), pos: new THREE.Vector3(0.33, 0.55, 0.3) },
        { color: "#C7F1EA", scale: new THREE.Vector3(1, 1.7, 1), pos: new THREE.Vector3(0.1, 1, 0) },
        { color: "#C7F1EA", scale: new THREE.Vector3(1, 1.7, 1), pos: new THREE.Vector3(0.1, 1, 0) },
        { color: "#0AF6F6", scale: new THREE.Vector3(1, 1.5, 1), pos: new THREE.Vector3(0.3, 1.58, 0.25) },
        { color: "#F8650C", scale: new THREE.Vector3(1.2, 2.5, 1), pos: new THREE.Vector3(0.12, 1.9, 0.2) },
        { color: "#66E660", scale: new THREE.Vector3(1.1, 1.7, 1), pos: new THREE.Vector3(0.05, 1.2, 0.07) },
        { color: "#C4DFC0", scale: new THREE.Vector3(0.8, 1.8, 1), pos: new THREE.Vector3(-0.02, 1.2, -0.03) },
        { color: "#988C87", scale: new THREE.Vector3(0.8, 1.8, 1), pos: new THREE.Vector3(-0.08, 1.2, -0.08) },
    ];
    for (i = 0; i < 8; i++) {

        let proptex = assets.getTexture("prop" + (i + 1).toString()),
            scale = settings[i].scale,
            pos = settings[i].pos,
            planemat = new THREE.MeshBasicMaterial(),
            childrenboxmat = new THREE.MeshStandardMaterial();
        childrenboxmat.color.set(settings[i].color);
        planemat.transparent = true;
        planemat.lights = false;
        planemat.map = proptex;
        for (let j = 0; j < 2; j++) {

            let boxprefab = new THREE.Mesh(boxgeometry, childrenboxmat);
            boxprefab.scale.set(hstep, vstep, hstep);
            boxprefab.visible = false;
            let propprefab = new THREE.Mesh(planegeometry, planemat);
            propprefab.position.copy(pos);
            propprefab.scale.copy(scale);
            propprefab.rotation.set(degtorad * -35, degtorad * 45, 0, "YXZ");
            boxprefab.add(propprefab);
            scene.add(boxprefab);
            childrenpool.push(boxprefab);

        }

    }
}

function initSpanBox() {
    for (let i = 0; i < initcount; i++) {
        let opts = {},
            nodecontrol = boxpool[boxindex];

        opts.xdir = spanxdir;
        if (i != 0) {
            if (spanxdir) {
                lastpos.x -= hstep;
            } else {
                lastpos.z -= hstep;
            }
            lastpos.y += vstep;
            spanxdir = Math.random() > 0.5;
        }
        opts.pos = lastpos;
        opts.nextPos = lastpos;
        nodecontrol.reset(opts);
        boxindex++;
    }
}

function boxcolorchange(dt) {
    if (!canchange) {
        return;
    }
    changetimer += dt;
    if (changetimer > changetime) {
        changetimer = 0;
        canchange = false;
    } else {
        boxmatcolor.lerp(boxnextcolor, dt);
        boxmat.color.copy(boxmatcolor);
    }

}

function updateAllBox(dt) {
    for (let i = 0; i < boxcount; i++) {
        let nodecontrol = boxpool[i];
        if (!nodecontrol.active) {
            continue;
        }
        nodecontrol.update(dt);
    }
}

function autoDrop(dt) {
    droptimer += dt;
    if (droptimer > droptime) {
        boxpool[dropindex].downMove();
        if (playerindex.value === dropindex) {
            playercontrol.timeoutlose();
        }
        droptimer = 0;
        dropindex = dropindex >= boxcount - 1 ? 0 : dropindex + 1;
    }

}

function showCross() {
    let index = playerindex.value >= boxcount - 4 ? 4 - (boxcount - playerindex.value) : playerindex.value + 4;
    if (boxpool[index].cross) boxpool[index].scaleMove();
}

function limitDrop() {
    let num = playerindex.value >= dropindex ? playerindex.value - dropindex : boxcount - dropindex + playerindex.value;
    if (num >= dropnum) {

        boxpool[dropindex].downMove();
        dropindex = dropindex >= boxcount - 1 ? 0 : dropindex + 1;
    }
}

function levelchange() {
    if (state.score.value % 50 === 0) {
        playercontrol.playchange();
        let index = THREE.Math.randInt(0, colorcount);
        colorindex = colorindex === index ? colorindex === colorcount ? colorindex - 1 : colorindex + 1 : index;
        boxnextcolor.set(boxcolors[colorindex]);
        canchange = true;
        droptime = state.score.value > 150 ? 0.18 : (state.score.value > 100 ? 0.2 : 0.3);
    }
}