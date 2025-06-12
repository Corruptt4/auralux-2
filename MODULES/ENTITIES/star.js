import { ctx, globalUnits, frictionFactor, flashes } from "../../main.js"
import { Unit } from "./unit.js";

export class PlasmaFlash {
    constructor(x, y, size, maxSize, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color
        this.maxSize = maxSize;
        this.alpha = 0.5
    }
    update() {
        this.size += (this.maxSize - this.size) * 0.02
        this.alpha = 0.5 - 0.5 * (this.size/this.maxSize)
        if (this.alpha <= 0.03) {
            flashes.splice(flashes.indexOf(this), 1)
        }
    }
    draw() {
        ctx.beginPath()
        ctx.globalAlpha = 0.5 - 0.5 * (this.size/this.maxSize)
        ctx.strokeStyle = this.color
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        ctx.lineWidth = 50
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.closePath()
    }
}
export class Star {
    constructor(x, y, level, color, team) {
        this.x = x;
        this.y = y;
        this.team = team;
        this.level = level;
        this.speed = 0.3;
        this.color = color;
        this.health = Math.ceil(150 * (Math.pow(1.5, (level-1))).toFixed(2));
        this.size = Math.ceil(35 * (Math.pow(1.4, (level-1))).toFixed(2));
        this.regularSize = Math.ceil(35 * (Math.pow(1.4, (level-1))).toFixed(2));
        this.maxFlashSize = Math.ceil(40 * (Math.pow(1.4, (level-1))).toFixed(2));
        this.spawnTick = 80 * (Math.pow(0.85, (level-1))).toFixed(2);
        this.regularSpawnTick = 80 * (Math.pow(0.85, (level-1))).toFixed(2);
        this.offsetAngle = Math.random() * (Math.PI*2)
        this.id = `${team}_${Math.floor(Math.random()*1e8)+1}`
        this.flashing = false
        this.moving = true
        this.segments = 30 
        this.segmentWidth = Math.PI * 2 / this.segments * 0.6
        this.isSelected = false;
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.target = {
            x: x,
            y: y
        }
        this.maxLevel = 3
        this.rotateANG = 0
    }

    update() {
        if (!this.flashing) {this.size = 35 * (Math.pow(1.4, (this.level-1))).toFixed(2)};
        this.spawnTick--

        if (this.spawnTick <= 0) {
            this.offsetAngle = Math.random() * (Math.PI*2)
            this.spawnTick = this.regularSpawnTick
            this.flashing = true
            this.size = this.maxFlashSize;
            setTimeout(() => {
                this.size = this.regularSize
                this.flashing = false
            }, 100)
            let flash = new PlasmaFlash(this.x, this.y, this.size, this.size*3, this.color)
            flashes.push(flash)
            for (let i = 0; i < this.level; i++) {
                let ang = (i * (360 / this.level)) * (Math.PI / 180)
                let unit = new Unit(this.x + this.size*Math.cos(ang+this.offsetAngle), this.y+this.size*Math.sin(ang+this.offsetAngle), this.team, this.color)
                unit.ang = ang + this.offsetAngle
                unit.mouseSelectedTarget = true;
                globalUnits.set(unit.id, unit)
            }
        }
    }
    move() {
        let ang = Math.atan2(this.target.y - this.y, this.target.x - this.x)

        let dx = this.target.x - this.x
        let dy = this.target.y - this.y
        let dist = dx*dx+dy*dy

        if (dist < this.size/20) {
            this.moving = false
        }

        if (this.moving) {
            this.velocity.x += this.speed * Math.cos(ang)
            this.velocity.y += this.speed * Math.sin(ang)
        }
        this.x += this.velocity.x
        this.y += this.velocity.y


        this.velocity.x *= frictionFactor
        this.velocity.y *= frictionFactor
    }
    /**
     * GOOD STAR TEAM COLORS:
     * BLUE: (R - 0, G - 0, B - 205)
     * RED: (R - 205, G - 0, B - 0)
     * GREEN: (R - 0, G - 205, B - 0)
     * WHITE: (R - 255, G - 255, B - 255)
     * up to 10 teams
     */

    draw() {
        ctx.beginPath()
        ctx.shadowBlur = this.size;
        ctx.shadowColor = this.color;
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
                ctx.strokeStyle = "white"
                ctx.lineWidth = 0.3
                ctx.arc(this.x, this.y, this.size*1.3, startANG+this.rotateANG, endANG+this.rotateANG)
                ctx.stroke()
                ctx.closePath()
            }
        }
    }
}

export class StarForgePlaceholder {
    constructor(x, y, level) {
        this.x = x
    }
}