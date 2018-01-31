import * as THREE from "../../libs/three"
import * as SPE from "../../libs/spe.min"

let state, camera, player, light;
const degtorad = Math.PI / 180;
let initpos = new THREE.Vector3(2, 3.5, 2),
    initrot = new THREE.Euler(-35 * degtorad, 45 * degtorad, 0, "YXZ"),
    targetPos = new THREE.Vector3(),
    lightpos = new THREE.Vector3(0, 1.5, -3),
    bgparticle, particlepos = new THREE.Vector3(0, -1, -10);
let movespeed = 2,
    shaketimer = 0,
    lrmove = 12,
    udmove = 12;
export function init(gamestate, curcamera, curplayer, scene, assets) {
    state = gamestate;
    camera = curcamera;
    player = curplayer;

    camera.position.copy(initpos);
    camera.position.y -= 1.2;
    camera.rotation.copy(initrot);

    light = new THREE.PointLight(0xffffff, 1, 20);
    light.position.copy(initpos).add(lightpos);
    camera.add(light);

    bgparticle = new SPE.Group({
        texture: { value: assets.getTexture('particle') },
        maxParticleCount: 100
    });
    let emitter = new SPE.Emitter({
        maxAge: {
            value: 3
        },
        type: SPE.distributions.BOX,
        position: {
            value: new THREE.Vector3(0, 0, 0),
            spread: new THREE.Vector3(5, 6, 0),
            randomise: true
        },
        opacity: {
            value: [0, 1, 0],
            randomize: true
        },

        size: {
            value: [0.1, 0.2, 0.1],
            randomize: true
        },

        particleCount: 50,
        activeMultiplier: 0.5
    });
    bgparticle.addEmitter(emitter);
    bgparticle.mesh.position.copy(particlepos);
    camera.add(bgparticle.mesh);

}

export function update(dt) {
    bgparticle.tick(dt);
    switch (state.curstate.value) {
        case state.states.start:
        case state.states.control:
            camera.position.lerp(targetPos.copy(player.position).add(initpos), dt * movespeed);
            break;
        case state.states.hitover:
            shaketimer += dt;
            if (shaketimer > 0.1 && shaketimer < 0.5) {
                lrmove = -lrmove;
                udmove = -udmove;
                if (lrmove > 0) lrmove -= 48 * dt;
                if (udmove > 0) udmove -= 48 * dt;
                camera.position.x += lrmove * dt;
                camera.position.z += udmove * dt;
            }
            break;
    }
}

export function reset() {
    camera.position.copy(initpos);
    camera.position.y -= 1.2;
    light.position.copy(initpos).add(lightpos);
    bgparticle.mesh.position.copy(particlepos);
    shaketimer = 0;
    lrmove = 12;
    udmove = 12;
}