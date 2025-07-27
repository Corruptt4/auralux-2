import { ctx } from "../main.js";

export class SelectType {
    constructor(x, y, width, selectType) {
        this.selectType = selectType;
        this.selectText = ["UNITS", "STARS", "ALL"];
        this.selectTextColors = ["rgb(230, 255, 125)", "rgb(255, 185, 0)", "rgb(0, 255, 255)"]
        this.x = x;
        this.y = y;
        this.width = width*3;
        this.height = width;
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)"
        ctx.roundRect(this.x, this.y, this.width, this.height, this.width/10)
        ctx.fill()

        ctx.font = "20px Arial"
        ctx.fillStyle = this.selectTextColors[this.selectType]
        ctx.fillText(this.selectText[this.selectType] + ` (${this.selectType})`, this.x + this.width / 8, this.y + this.height/1.5)
        ctx.closePath()
    }
}