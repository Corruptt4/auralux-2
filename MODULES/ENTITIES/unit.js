import { ctx } from "../../main.js"

class Unit {
    constructor(x, y, team, color) {
        this.x = x;
        this.y = y;
        this.team = team;
        this.color = color;
        this.health = 1;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.damage = 1;
    }
}