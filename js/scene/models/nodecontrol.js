import * as THREE from "../../libs/three"
export default class NodeControl {
    constructor(obj) {
        this.active = false;
        this.obj = obj;
        this.xdir = false;
        this.hasChildren = false;
        this.hit = false;
        this.childrennode = null;
        this.crossnode = null;
        this.canup = false;
        this.candown = false;
        this.uptime = 0.2;
        this.downtime = 0.5;

        this.downspeed = 8;
        this.upspeed = 20;

        this.uptimer = 0;
        this.downtimer = 0;
        this.scaletime = 0.2;
        this.scaletimer = 0;
        this.canscale = false;
        this.cross = false;
        this.nextPos = new THREE.Vector3(0, 0, 0);
        this.childrennextPos = new THREE.Vector3(0, 0, 0);
        this.crossscale = new THREE.Vector3(0.7, 1.3, 1);
        this.maxscale = 1;
        this.nowscale = 0.5;
    }

    update(dt) {
        if (!this.active) {
            return;
        }
        this.upAnim(dt);
        this.downAnim(dt);
        this.scaleAnim(dt);

    }

    upAnim(dt) {
        if (!this.canup) {
            return;
        }
        this.uptimer += dt;
        if (this.uptimer > this.uptime) {
            this.canup = false;
            this.obj.position.copy(this.nextPos);
            if (this.hasChildren)
                this.childrennode.position.copy(this.childrennextPos);
        } else {
            this.obj.position.y -= this.upspeed * dt;
            if (this.hasChildren) this.childrennode.position.y -= this.upspeed * dt;
        }

    }
    downAnim(dt) {
        if (!this.candown) {
            return;
        }
        this.downtimer += dt;
        if (this.downtimer > this.downtime) {
            this.candown = false;

            this.active = false;
            this.obj.visible = false;
            if (this.hasChildren)
                this.childrennode.visible = false;

        } else {
            this.obj.position.y -= this.downspeed * dt;
            if (this.hasChildren) this.childrennode.position.y -= this.downspeed * dt;
        }
    }
    scaleAnim(dt) {
        if (!this.canscale) {
            return;
        }
        this.scaletimer += dt;
        if (this.scaletimer > this.scaletime) {
            this.canscale = false;
            this.crossnode.scale.copy(this.crossscale);
        } else {
            var t = this.scaletimer / this.scaletime;
            this.nowscale = (1 - t) * 0.5 + t * this.maxscale;
            this.crossnode.scale.copy(this.crossscale).multiplyScalar(this.nowscale);
        }
    }
    upMove() {
        this.canup = true;
        this.uptimer = 0;
    }
    downMove() {
        this.candown = true;
        this.downtimer = 0;
    }
    scaleMove() {
        this.canscale = true;
        this.scaletimer = 0;
        this.crossnode.visible = true;
    }
    reset(opts) {
        this.active = true;
        this.obj.visible = this.active;

        this.obj.position.copy(opts.pos);
        this.nextPos.copy(opts.nextPos);
        this.xdir = opts.xdir;

        this.hasChildren = opts.hasChildren === undefined ? false : opts.hasChildren;
        this.canup = false;
        this.candown = false;
        this.canscale = false;

        if (!this.hasChildren) {
            this.childrennode = null;
            this.cross = false;
            this.crossnode = null;
            this.hit = false;
            return;
        }
        this.childrennode = opts.childrennode;
        this.childrennode.position.copy(opts.childrenPos);
        this.childrennode.visible = true;

        this.hit = opts.hit;
        this.childrennextPos.copy(opts.childrennextPos);

        this.cross = opts.cross === undefined ? false : opts.cross;
        if (!this.cross) {
            this.crossnode = null;
            return;
        }

        this.nowscale = 0.5;
        this.crossnode = this.childrennode.children[0];
        this.crossnode.visible = false;
        this.crossnode.scale.copy(this.crossscale).multiplyScalar(this.nowscale);
    }
    init() {
        this.active = false;
        this.obj.visible = this.active;
        this.canup = false;
        this.candown = false;
        this.canscale = false;
        this.hasChildren = false;
        this.childrennode = null;
        this.hit = false;
        this.cross = false;
        this.crossnode = null;
    }

}