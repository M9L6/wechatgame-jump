export default class input {
    constructor(target) {
        this.target = target;
    }

    on(type, listener) {
        this.target.addEventListener(type, listener);
    }

    off(type, listener) {
        this.target.removeEventListener(type, listener);
    }
}