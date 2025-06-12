import { ctx, frictionFactor } from "../../main.js"

export class Unit {
    constructor(x, y, team, color) {
        this.x = x;
        this.y = y;
        this.team = team;
        this.id = `${team}_${Math.floor(Math.random()*1e8)+1}`
        this.color = color;
        this.health = 1;
        this.speed = 0.2;
        this.maxSpeed = 0.2;
        this.mouseSelectedTarget = false
        this.idleTick = 80
        this.size = 6
        this.target = {
            x: x,
            y: y
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.damage = 1;
        this.ang = 0
    }
    draw() {
        ctx.shadowBlur = this.size*3;
        ctx.shadowColor = this.color;
        ctx.beginPath()
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
    move() {
        if (!this.mouseSelectedTarget) {
            this.idleTick--
            if (this.idleTick <= 0) {
                this.idleTick = 80
                this.ang = Math.random() * (Math.PI * 2)
            }
            this.velocity.x += this.speed * Math.cos(this.ang)
            this.velocity.y += this.speed * Math.sin(this.ang)
        }
        if (this.mouseSelectedTarget) {
            this.speed = this.maxSpeed
            let angle = Math.atan2(this.target.y - this.y, this.target.x - this.x)
            this.velocity.x += this.speed * Math.cos(angle)
            this.velocity.y += this.speed * Math.sin(angle)
        }
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.velocity.x *= frictionFactor
        this.velocity.y *= frictionFactor
    }
}