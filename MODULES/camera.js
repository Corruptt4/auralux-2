import { cns, ctx } from "../main.js"

export class Camera {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.x2 = x;
        this.y2 = y;
        this.zoom = 1
    }
    follow() {
        this.x2 += (this.x - this.x2) * 0.05
        this.y2 += (this.y - this.y2) * 0.05
    }
    apply() {
        ctx.translate(cns.width/2, cns.height/2)
        ctx.scale(this.zoom, this.zoom)
        ctx.translate(-this.x2, -this.y2)
    }
}