import { ctx } from "../../main.js"

class Star {
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
}