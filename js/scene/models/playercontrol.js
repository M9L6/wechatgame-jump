import * as THREE from "../../libs/three"
import * as SPE from "../../libs/spe.min"
const jptime = 0.2,
    hstep = 0.5,
    vstep = 0.25,
    degtorad = Math.PI / 180;
let state,
    player, playerbody, playerparticle,
    shadow, playermat, playerltex, playerrtex, pathmanager, input, sound,
    jumpup, jptimer = 0,
    nextdir, nexthasChildren, nextPos = new THREE.Vector3(0, 0, 0),
    lparticlepos = new THREE.Vector3(-0.2, 0.6, 0.2),
    rparticlepos = new THREE.Vector3(0.5, 0.8, 0.2),
    playerpos = new THREE.Vector3(0, 0, 0),
    shadowpos = new THREE.Vector3(0.02, 0.13, 0.05);
export function init(gamestate, assets, curpathmanager, curinput, scene) {
    sound = assets;
    pathmanager = curpathmanager;
    input = curinput;
    state = gamestate;
    if ("ontouchstart" in window) input.on("touchstart", control);
    else input.on("mousedown", control);
    createObjs(assets, scene);
    nextdir = pathmanager.nodespool[1].xdir;
    nexthasChildren = false;
    playbgm();
}
let audiopause = false;

function playbgm() {
    wx.onAudioInterruptionBegin(() => {
        audiopause = true;
    });
    wx.onAudioInterruptionEnd(() => {
        if (audiopause) {
            audiopause = false;
            playsound('bgm');
        }
    });

    wx.onShow(() => {
        if (audiopause) {
            audiopause = false;
            playsound('bgm');
        }
    });
    wx.onHide(() => {
        audiopause = true;
    });

}

export function getPlayer() {
    return player;
}

export function update(dt) {
    playerparticle.tick(dt);

    switch (state.curstate.value) {
        case state.states.control:
            jump(dt);
            break;
        case state.states.dropover:
            dropanim(dt);
            break;
        case state.states.hitover:
            hitanim(dt);
            break;
        case state.states.timeoutover:
            timeoutanim(dt);
            break;
    }
}
export function reset() {
    state.score.value = 0;
    player.position.copy(playerpos);
    playermat.map = playerrtex;

    playerbody.visible = true;

    jptimer = 0;
    nextdir = pathmanager.nodespool[1].xdir;
    nexthasChildren = false;
    nextPos.set(0, 0, 0),

        jumpup = false;
    shadow.scale.set(0.3, 0.3, 0.3);
    shadow.position.copy(shadowpos);
    shadow.rotation.y = 45 * degtorad;
    shadow.visible = true;
}
export function playchange() {
    playsound("change");
}
export function timeoutlose() {
    shadow.visible = false;
    playsound("lose");
    state.curstate.value = state.states.timeoutover;
    state.end();
    //console.log('timeroutlose');
}

function createObjs(assets, scene) {
    playerltex = assets.getTexture("playerl");
    playerrtex = assets.getTexture("playerr");
    playermat = new THREE.MeshBasicMaterial();

    playermat.transparent = true;
    playermat.lights = false;
    playermat.map = playerrtex;

    player = new THREE.Group();
    player.position.set(0, 0, 0);
    let planegeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1),
        shadowmat = new THREE.MeshBasicMaterial();

    shadowmat.color.set(0x000000);
    shadowmat.transparent = true;
    shadowmat.lights = false;
    shadowmat.map = assets.getTexture("shadow");
    shadowmat.opacity = 0.3;
    shadow = new THREE.Mesh(planegeometry, shadowmat);
    shadow.position.copy(shadowpos);
    shadow.rotation.set(-90 * degtorad, 45 * degtorad, 0, "YXZ");
    shadow.scale.set(0.3, 0.3, 0.3);
    scene.add(shadow);

    playerbody = new THREE.Mesh(planegeometry, playermat);
    playerbody.position.set(-0.03, 0.42, 0);
    playerbody.rotation.set(-35 * degtorad, 45 * degtorad, 0, "YXZ");
    playerbody.scale.set(0.35, 0.65, 1);

    player.add(playerbody);

    playerparticle = new SPE.Group({
        texture: {
            value: assets.getTexture("particle")
        },
        depthTest: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        maxParticleCount: 50
    });
    let emitterSettings = {
        maxAge: {
            value: 0.5
        },
        position: {
            value: new THREE.Vector3(0, 0, 0),
        },
        velocity: {
            value: new THREE.Vector3(1, 1, 1),
            spread: new THREE.Vector3(3, 3, 3),
            randomize: true
        },
        size: {
            value: [0.01, 0.1, 0.01]
        },
        opacity: {
            value: [0, 1, 0]
        },
        duration: 0.5,
        particleCount: 30,
        activeMultiplier: 1
    };

    playerparticle.addPool(1, emitterSettings, false);
    playerparticle.mesh.position.copy(lparticlepos);

    player.add(playerparticle.mesh);
    scene.add(player);
}


let vectorzero = new THREE.Vector3(0, 0, 0);

function control(e) {
    if (state.curstate.value < 0 || state.curstate.value > 2) {
        return;
    }
    if (state.curstate.value === state.states.start) {
        state.startgame();
    }

    var Ldir = false;
    if (e.touches === null) {
        if (e.clientX < window.innerWidth / 2)
            Ldir = true;
    } else {
        if (e.touches[0].clientX < window.innerWidth / 2)
            Ldir = true;
    }

    if (Ldir) {
        playermat.map = playerltex;
        shadow.rotation.y = -45 * degtorad;
    } else {
        playermat.map = playerrtex;
        shadow.rotation.y = 45 * degtorad;
    }
    if (jumpup) {
        jumpEnd();
    }
    if (Ldir && nextdir || !Ldir && !nextdir) {
        scoreChange();
        jumpup = true;
        nextPos.set(nextdir ? nextPos.x - hstep : nextPos.x, nextPos.y + vstep, nextdir ? nextPos.z : nextPos.z - hstep);
        pathmanager.spanBox();
    } else {
        if (nexthasChildren) {
            if (Ldir) {
                playerparticle.mesh.position.copy(lparticlepos);
                playerparticle.triggerPoolEmitter(1, vectorzero);
            } else {
                playerparticle.mesh.position.copy(rparticlepos);
                playerparticle.triggerPoolEmitter(1, vectorzero);
            }
            hitlose();
        } else {
            droplose();
        }
    }
}

function scoreChange() {
    state.score.value++;
    state.scoreChange();
}

function jumpEnd() {
    player.position.copy(nextPos);
    jptimer = 0;
    jumpup = false;
    pathmanager.playerindex.value = state.score.value % pathmanager.count;
    shadow.position.copy(nextPos).add(shadowpos);
    shadow.scale.set(0.3, 0.3, 0.3);
    let nextIndex = pathmanager.playerindex.value < (pathmanager.count - 1) ? pathmanager.playerindex.value + 1 : 0,
        nodecontrol = pathmanager.nodespool[nextIndex];
    nextdir = nodecontrol.xdir;
    nexthasChildren = nodecontrol.hit;
}

function jump(dt) {
    if (!jumpup) {
        return;
    }
    jptimer += dt;
    if (jptimer > jptime) {
        jumpEnd();
    } else {
        if (nextdir) {
            player.position.x -= hstep / jptime * dt;
        } else {
            player.position.z -= hstep / jptime * dt;
        }
        var scale = 0.2 * (jptimer - jptime * 0.5) / jptime * 2;
        if (jptimer > jptime / 2) {
            player.position.y -= 0.4 / jptime * dt;
            shadow.position.copy(nextPos).add(shadowpos);
            shadow.scale.set(0.1 + scale, 0.1 + scale, 0.1 + scale);
        } else {
            player.position.y += (0.4 + 2 * vstep) / jptime * dt;
            shadow.position.copy(nextPos).add(shadowpos);
            shadow.position.y -= vstep;
            if (nextdir) {
                shadow.position.x += hstep;
            } else {
                shadow.position.z += hstep;
            }
            shadow.scale.set(0.1 - scale, 0.1 - scale, 0.1 - scale);
        }
    }
}

function dropanim(dt) {
    jptimer += dt;
    if (jptimer > jptime) {
        player.position.y -= 8 * dt;
    } else {
        if (!nextdir) {
            player.position.x -= hstep / jptime * dt;
        } else {
            player.position.z -= hstep / jptime * dt;
        }
        if (jptimer > jptime / 2) {
            player.position.y -= 0.4 / jptime * dt;
        } else {
            player.position.y += (0.4 + 2 * vstep) / jptime * dt;
        }
    }
}

function hitanim(dt) {
    jptimer += dt;
    let scale = 0.2 * (jptimer - jptime * 0.5) / jptime * 2;
    if (jptimer < jptime / 2) {
        if (!nextdir) {
            player.position.x -= hstep / jptime * dt;
        } else {
            player.position.z -= hstep / jptime * dt;
        }
        player.position.y += (vstep * 2 + 0.2) / jptime * dt;
    } else {
        if (playerbody.visible) {
            shadow.visible = false;
            playerbody.visible = false;
        }

    }

}

function timeoutanim(dt) {

    jptimer += dt;
    if (jptimer > jptime / 2) {
        player.position.y -= 8 * dt;
    }

}

function hitlose() {

    playsound("hit");
    state.curstate.value = state.states.hitover;
    state.end();
    console.log('hitlose');
}

function droplose() {
    shadow.visible = false;
    playsound("lose");
    state.curstate.value = state.states.dropover;
    state.end();
    //console.log('droplose');
}

function playsound(name) {
    sound.getSound(name).play();
}