import { ctx } from "../../main.js"

export class Star {
    constructor(x, y, level, color, team) {
        this.x = x;
        this.y = y;
        this.team = team;
        this.level = level;
        this.color = color;
        this.health = Math.ceil(150 * (Math.pow(1.5, (level-1))).toFixed(2));
        this.size = Math.ceil(45 * (Math.pow(1.5, (level-1))).toFixed(2));
        this.spawnTick = 80 * (Math.pow(0.85, (level-1))).toFixed(2);
        this.regularSpawnTick = 80 * (Math.pow(0.85, (level-1))).toFixed(2);
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.maxLevel = 3
    }

    update() {
        this.size = 45 * (Math.pow(1.5, (this.level-1))).toFixed(2);
        this.spawnTick--

        if (this.spawnTick <= 0) {
            this.spawnTick = this.regularSpawnTick
        }
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
    }
}