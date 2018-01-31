import * as THREE from "../libs/three"
import * as pathmanager from "./models/pathmanager"
import * as camerafollow from "./models/camerafollow"
import * as playercontrol from "./models/playercontrol"
const orthoheight = 6;
let state, camera, scene;

export function init(gamestate, assets, input) {
    state = gamestate;
    scene = new THREE.Scene();

    let aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(orthoheight * aspect / -2, orthoheight * aspect / 2, orthoheight / 2, orthoheight / -2, 0.1, 100);
    scene.add(camera);

    pathmanager.init(state, assets, playercontrol, scene);
    playercontrol.init(state, assets, pathmanager, input, scene);
    camerafollow.init(state, camera, playercontrol.getPlayer(), scene, assets);
}
export function getScene() {
    return scene;
}
export function getCamera() {
    return camera;
}

export function update(dt) {
    pathmanager.update(dt);
    playercontrol.update(dt);
    camerafollow.update(dt);
}

export function resize() {
    let aspect = window.innerWidth / window.innerHeight;
    camera.left = -orthoheight * aspect / 2;
    camera.right = orthoheight * aspect / 2;
    camera.top = orthoheight / 2;
    camera.bottom = -orthoheight / 2;
    camera.updateProjectionMatrix();
}

export function reset() {
    pathmanager.reset();
    camerafollow.reset();
    playercontrol.reset();
    state.reset();
}