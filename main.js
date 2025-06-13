import { settings } from "./MODULES/global.js";
import { Star, StarFusePlaceholder } from "./MODULES/ENTITIES/star.js";
import { Camera } from "./MODULES/camera.js"

let playerTeam = 1
export const cns = document.getElementById("canvas"),
                          ctx = cns.getContext("2d"),
                          frictionFactor = 0.94

export let globalUnits = new Map()
export let globalStars = new Map()
export let flashes = []
export let starFuses = []
let worldMouseX = null,
      worldMouseY = null

let star = new Star(0, 0, 1, "rgb(0, 0, 205)", 1)
globalStars.set(star.id, star)

const set = settings
let camera = new Camera(0, 0)
let keys = {}
let canSpawnFuse = true

document.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true
    
    if (e.keyCode === 80 && canSpawnFuse) {
        let blueTeamFusing = new StarFusePlaceholder(worldMouseX, worldMouseY, 4, playerTeam, "rgb(0, 0, 205)")
        starFuses.push(blueTeamFusing)
        canSpawnFuse = false
    }
})
document.addEventListener("keyup", (e) => {
    keys[e.keyCode] = false
    if (e.keyCode === 80 && !canSpawnFuse) {
        canSpawnFuse = true
    }
})
document.addEventListener("wheel", (e) => {
    camera.zoom -= e.deltaY / 1000
})
cns.addEventListener('mousemove', function (event) {
    const mouseX = event.clientX - cns.width / 2;
    const mouseY = event.clientY - cns.height / 2;

    const worldX = camera.x + mouseX / camera.zoom;
    const worldY = camera.y + mouseY / camera.zoom;

    const halfMap = set.MAP_SIZE / 2;
    const clampedX = Math.max(-halfMap, Math.min(halfMap, worldX));
    const clampedY = Math.max(-halfMap, Math.min(halfMap, worldY));
    worldMouseX = clampedX
    worldMouseY = clampedY
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
            if (star.team == playerTeam) {
                let dx = worldMouseX - star.x
                let dy = worldMouseY - star.y
                let dist = dx*dx+dy*dy
                let range = star.size**2
                if (dist < range) {
                    globalUnits.forEach((unit) => {
                         if (unit.team == playerTeam && unit.isSelected) {
                            star.unitsToAbsorb.push(unit)
                        }
                    })
                }
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

        star.unitsToAbsorb.forEach((unit) => {
            let dx = unit.x-star.x
            let dy = unit.y-star.y
            let dist = dx*dx+dy*dy
            let range = (star.size+unit.size)**2
            if (dist < range && star.level < 3) {
                star.absorb(unit)
            }
        })
    })
    globalUnits.forEach((unit) => {
        unit.move()
    })
    flashes.forEach((flash) => {
        flash.update()
    })
    for (let i = 0; i < starFuses.length; i++) {
        let starFusing = starFuses[i]
        starFusing.upd()
        let inRange = []
        globalUnits.forEach((unit) => {
            if (unit.team == starFusing.team) {
                let dx = unit.x - starFusing.x
                let dy = unit.y - starFusing.y
                let dist = dx*dx+dy*dy
                let range = starFusing.size + unit.size
                if (dist < Math.pow(range, 2)) {
                    inRange.push(unit)
                } else if (dist > Math.pow(range, 2) && inRange.includes(unit)) {
                    inRange.splice(inRange.indexOf(unit), 1)
                }
            }
        })
        starFusing.inRangeUnits = inRange.length
        if (inRange.length >= starFusing.neededToFuse) {
            inRange.forEach((unit) => {
                globalUnits.delete(unit.id)
            })
            let level = 1
            if (starFusing.inRangeUnits > starFusing.neededToFuse) {
                level = Math.random() < 0.05 ? 2 : 1
            }
            let star = new Star(starFusing.x, starFusing.y, level, starFusing.color, starFusing.team)
            globalStars.set(star.id, star)
            starFusing.delete = true
        }
        if (starFusing.delete) {
            starFuses.splice(starFuses.indexOf(starFusing), 1)
        }
    }

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
    starFuses.forEach((starFusing) => {
        starFusing.draw()
    })
    flashes.forEach((flash) => {
        flash.draw()
    })

    requestAnimationFrame(render)
}

render()