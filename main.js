import { settings } from "./MODULES/global.js";
import { Star } from "./MODULES/ENTITIES/star.js";
import { Camera } from "./MODULES/camera.js"

let playerTeam = 1
export const cns = document.getElementById("canvas"),
                          ctx = cns.getContext("2d"),
                          frictionFactor = 0.94

export let globalUnits = new Map()
export let globalStars = new Map()
export let flashes = []
let worldMouseX = null,
      worldMouseY = null

let star = new Star(0, 0, 3, "rgb(0, 0, 205)", 1)
globalStars.set(star.id, star)

const set = settings
let camera = new Camera(0, 0)
let keys = {}

document.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true
})
document.addEventListener("keyup", (e) => {
    keys[e.keyCode] = false
})
document.addEventListener("wheel", (e) => {
    camera.zoom -= e.deltaY / 1000
})
cns.addEventListener('mousemove', function (event) {
    const mouseX = event.clientX - cns.width / 2;
    const mouseY = event.clientY - cns.height / 2;

    const worldX = camera.x + mouseX;
    const worldY = camera.y + mouseY;

    const halfMap = set.MAP_SIZE / 2;
    const clampedX = Math.max(-halfMap, Math.min(halfMap, worldX));
    const clampedY = Math.max(-halfMap, Math.min(halfMap, worldY));
    worldMouseX = clampedX/camera.zoom
    worldMouseY = clampedY/camera.zoom
});
document.addEventListener("mousedown", (e) => {
    e.preventDefault()
    if (e.button == 2) {
        globalUnits.forEach((unit) => {
            if (unit.team == playerTeam && unit.isSelected) {
                unit.target.x = worldMouseX
                unit.target.y = worldMouseY
                unit.mouseSelectedTarget = true
            }
        })
        globalStars.forEach((star) => {
            if (star.team == playerTeam && star.isSelected) {
                star.target.x = worldMouseX
                star.target.y = worldMouseY
                star.moving = true
            }
        })
    }
    if (e.button == 0) {
        globalUnits.forEach((unit) => {
            if (unit.isSelected) unit.isSelected = false
        })
        globalStars.forEach((star) => {
            if (star.team == playerTeam) star.isSelected = false
        })
    }
})
let speed = 10

setInterval(() => {
    if (keys[37] || keys[65]) {
        camera.x -= speed/camera.zoom
    }
    if (keys[39] || keys[68]) {
        camera.x += speed/camera.zoom
    }
    if (keys[38] || keys[87]) {
        camera.y -= speed/camera.zoom
    }
    if (keys[40] || keys[83]) {
        camera.y += speed/camera.zoom
    }
    if (keys[84]) {
        globalUnits.forEach((unit) => {
            if (unit.team == playerTeam) unit.isSelected = true
        })
    }
    if (keys[89]) {
        globalStars.forEach((star) => {
            if (star.team == playerTeam) star.isSelected = true
        })
    }
    globalStars.forEach((star) => {
        star.update()
        star.move()
    })
    globalUnits.forEach((unit) => {
        unit.move()
    })
    flashes.forEach((flash) => {
        flash.update()
    })
    camera.follow()
}, 1000/60)

function render() {
    ctx.clearRect(0, 0, cns.width, cns.height)
    cns.width = window.innerWidth
    cns.height = window.innerHeight

    camera.apply()

    globalStars.forEach((star) => {
        star.draw()
    })
    globalUnits.forEach((unit) => {
        unit.draw()
    })
    flashes.forEach((flash) => {
        flash.draw()
    })

    requestAnimationFrame(render)
}

render()