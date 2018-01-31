import * as THREE from "../libs/three"
let renderer,
    colors = ["#423e40", "#bc2849", "#4a7778", "#ffba6f", "#007ebe", "#5c515d", "#1b3b4e", "#ba6689", "#2b1c40", "#db8d41", "#3dadc2"],
    maxcount = 10,
    curindex = THREE.Math.randInt(0, maxcount),
    curcolor = new THREE.Color(colors[curindex]),
    timer = 0,
    changespeed = 0.2,
    changetime = 15;
curindex = curindex === maxcount ? curindex - 1 : curindex + 1;

let nextcolor = new THREE.Color(colors[curindex]);

export function init(canvas) {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio === 1 ? 1 : 2);
    renderer.setClearColor(curcolor);
}

export function getRenderer() {
    return renderer;
}

export function update(dt) {
    timer += dt;
    if (timer > changetime) {
        timer = 0;
        let index = THREE.Math.randInt(0, maxcount);
        curindex = curindex === index ? (curindex === maxcount ? curindex - 1 : curindex + 1) : index;
        nextcolor.set(colors[curindex]);
    } else {
        if (timer > changetime / 3 && timer < changetime * 2 / 3) {
            curcolor.lerp(nextcolor, changespeed * dt);
            renderer.setClearColor(curcolor);
        }
    }
}

export function resize() {
    renderer.setPixelRatio(window.devicePixelRatio === 1 ? 1 : 2);
    renderer.setSize(window.innerWidth, window.innerHeight);
}