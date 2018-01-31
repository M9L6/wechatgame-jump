import * as THREE from './libs/three';
import * as gamestate from './gamestate';
import * as renderermanager from './render/render';
import * as scenemanager from './scene/scene';
import * as resources from './resource/preload';
import Input from "./input/input"
import * as splash from "./resource/splash"
let scene, renderer,
    clock, camera, input;

function preload() {
    resources.preload(init, splash.onProgress, splash.onError);
}

function init() {
    clock = new THREE.Clock();
    createScene();
    createUI();
    animate();
    splash.onLoad();
}

function createScene() {
    gamestate.curstate.value = gamestate.states.idle;
    renderermanager.init(canvas);
    renderer = renderermanager.getRenderer();

    input = new Input(renderer.domElement);
    scenemanager.init(gamestate, resources, input);

    scene = scenemanager.getScene();
    camera = scenemanager.getCamera();

    window.addEventListener("resize", resize);

}


let dt = 0;
///time /s
function animate() {
    dt = clock.getDelta() * 1000;
    update(dt);
    render(dt);
    requestAnimationFrame(animate);
}

function update(dt) {
    scenemanager.update(dt);
}

function render(dt) {
    renderermanager.update(dt);
    renderer.render(scene, camera);
}

function reset() {
    scenemanager.reset();
    wx.triggerGC();
}

function resize() {
    scenemanager.resize();
    renderermanager.resize();
}

const degtorad = Math.PI / 180;
let startbtn, clickpoint = new THREE.Vector2(),
    ray = new THREE.Raycaster();

function createUI() {
    let geo = new THREE.PlaneBufferGeometry(1, 1, 1, 1),
        mat = new THREE.MeshBasicMaterial();
    mat.transparent = true;
    mat.lights = false;
    mat.map = resources.getTexture("startbtn");
    startbtn = new THREE.Mesh(geo, mat);
    startbtn.scale.set(0.5, 0.5, 0.5);
    startbtn.position.set(0, -1, -1);
    camera.add(startbtn);
    input.on('touchstart', (e) => {

        if (!startbtn.visible) {
            return;
        }
        let touch0 = e.changedTouches[0];
        clickpoint.x = (touch0.clientX / window.innerWidth) * 2 - 1;
        clickpoint.y = -(touch0.clientY / window.innerHeight) * 2 + 1;
        ray.setFromCamera(clickpoint, camera);

        let intersects = ray.intersectObjects([startbtn], false);
        if (intersects.length <= 0) {
            return;
        }
        switch (gamestate.curstate.value) {
            case gamestate.states.idle:
                gamestate.start();
                break;
            case gamestate.states.dropover:
            case gamestate.states.hitover:
            case gamestate.states.timeoutover:
                reset();
                gamestate.reset();
                break;
        }
    });
    gamestate.setUI(startbtn);
}
preload();