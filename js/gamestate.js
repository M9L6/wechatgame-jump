export let score = { value: 0 }
export let curstate = { value: -1 }


export const states = {
    idle: -1,
    start: 0,
    startgame: 1,
    control: 2,
    dropover: 3,
    hitover: 4,
    timeoutover: 5
}
let uistartbtn;
export function setUI(startbtn) {
    uistartbtn = startbtn;
}
export function reset() {
    uistartbtn.visible = false;
    score.value = 0;
    curstate.value = states.start;
    scoreChange();
}
export function start() {
    uistartbtn.visible = false;
    curstate.value = states.start;
}

export function startgame() {
    curstate.value = states.control;
}

export function end() {
    uistartbtn.visible = true;
    console.log(score.value);
}

export function scoreChange() {
    //console.log(score.value);
}