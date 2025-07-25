import { ctx } from "../../main.js";

export class DragBox {
    constructor(x, y, px1, py1, px2, py2, playerStar) {
        this.x = x;
        this.y = y;
        this.px1 = px1;
        this.py1 = py1;
        this.px2 = px2;
        this.py2 = py2;
        this.px;
        this.py;
        this.playerStar = playerStar
    }
    draw() {
        ctx.beginPath()
        ctx.strokeStyle = "rgb(255, 255, 255)"
        this.px = this.px2-this.px1
        this.py = this.py2-this.py1
        ctx.strokeRect(this.x, this.y, this.px, this.py)
        ctx.closePath()
    }
}