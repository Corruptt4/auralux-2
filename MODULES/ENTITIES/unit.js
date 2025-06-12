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
        this.segments = 3
        this.segmentWidth = Math.PI * 2 / this.segments * 0.6
        this.isSelected = false;
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
        this.rotateANG = 0
    }
    draw() {
        ctx.shadowBlur = this.size;
        ctx.shadowColor = this.color;
        ctx.beginPath()
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
        if (this.isSelected) {
            this.rotateANG += 0.04
            for (let i = 0; i < this.segments; i++) {
                let startANG = (i / this.segments) * Math.PI * 2
                let endANG = startANG + this.segmentWidth
                ctx.beginPath()
                ctx.shadowBlur = this.size;
                ctx.shadowColor = this.color;
                ctx.strokeStyle = "white"
                ctx.lineWidth = 0.3
                ctx.arc(this.x, this.y, this.size*1.5, startANG+this.rotateANG, endANG+this.rotateANG)
                ctx.stroke()
                ctx.closePath()
            }
        }
    }
    move() {
        if (!this.mouseSelectedTarget) {
            this.idleTick--
            if (this.idleTick <= 0) {
                this.idleTick = 80
                this.ang = Math.random() * (Math.PI * 2)
                if (this.speed < 0.02) {
                    this.speed = this.maxSpeed
                }
            }
            this.speed *= 0.965
            this.velocity.x += this.speed * Math.cos(this.ang)
            this.velocity.y += this.speed * Math.sin(this.ang)
        }
        if (this.mouseSelectedTarget) {
            this.speed = this.maxSpeed
            let angle = Math.atan2(this.target.y - this.y, this.target.x - this.x)
            this.velocity.x += this.speed * Math.cos(angle)
            this.velocity.y += this.speed * Math.sin(angle)
            let dx = this.target.x - this.x
            let dy = this.target.y - this.y
            let dist = dx*dx+dy*dy
            if (dist < Math.pow(8, 2)) {
                this.mouseSelectedTarget = false
            }
        }
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.velocity.x *= frictionFactor
        this.velocity.y *= frictionFactor
    }
}