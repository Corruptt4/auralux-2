import { settings } from "./MODULES/global.js";
import { Star, StarFusePlaceholder } from "./MODULES/ENTITIES/star.js";
import { Camera } from "./MODULES/camera.js"
import { DragBox } from "./MODULES/MECHANICS/dragBox.js";
import { SelectType } from "./MODULES/UI.js"

export let playerTeam = 1
export const cns = document.getElementById("canvas"),
                          ctx = cns.getContext("2d"),
                          frictionFactor = 0.94

export let selectType = 0

let selectTypeBox = new SelectType(10, 10, 50, selectType)
/** SELECT TYPE:
 * 0 - UNITS
 * 1 - STARS
 * 2 - ALL
 */

export let globalUnits = new Map()
export let globalStars = new Map()
export let flashes = []
export let starFuses = []
let dragBox = null;
let worldMouseX = null,
      worldMouseY = null;
    
let setX = null,
      setY = null;

let stars = [
    new Star(1500, -1500, 3, "rgb(0, 0, 205)", 1),
    new Star(-1500, 1500, 3, "rgb(205, 0, 0)", 2)
]

stars.forEach((star) => {
    if (star.team != playerTeam) star.AIControl = true;
    globalStars.set(star.id, star)
})

const set = settings
let camera = new Camera(stars[0].x, stars[0].y)
let keys = {}
let canSpawnFuse = true

document.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true
    
    if (e.keyCode === 80 && canSpawnFuse) {
        let blueTeamFusing = new StarFusePlaceholder(worldMouseX, worldMouseY, 4, playerTeam, "rgb(0, 0, 205)")
        starFuses.push(blueTeamFusing)
        canSpawnFuse = false
    }
    
    if (keys[69]) {
        if (selectType == 2) {
            selectType = 0
        } else {
            selectType++
        }
    }
    
    if (keys[81]) {
        if (selectType == 0) {
            selectType = 2
        } else {
            selectType--
        }
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
    if (dragBox) {
        dragBox.px2 = worldMouseX-setX
        dragBox.py2 = worldMouseY-setY
    }
});
document.addEventListener("mousedown", (e) => {
    e.preventDefault()
    if (e.button == 0) {
        let setX = worldMouseX
        let setY = worldMouseY
        dragBox = new DragBox(worldMouseX, worldMouseY, setX, setY, worldMouseX, worldMouseY)
    }
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
cns.addEventListener("mouseup", () => {
    switch (selectType) {
        case 0: {
            const left = Math.min(dragBox.px1, dragBox.px2);
            const right = Math.max(dragBox.px1, dragBox.px2);
            const top = Math.min(dragBox.py1, dragBox.py2);
            const bottom = Math.max(dragBox.py1, dragBox.py2);
            let units = [...globalUnits].filter(([id]) => id.startsWith(playerTeam))
            globalStars.forEach((star) => {
                if (star.team == playerTeam) {
                    units.forEach(([id, unit]) => {
                        let cX = Math.max(left, Math.min(unit.x, right))
                        let cY = Math.max(top, Math.min(unit.y, bottom))

                        let dx = unit.x - cX
                        let dy = unit.y - cY
                        let dist = dx*dx+dy*dy
                        let r = unit.size*unit.size

                        if (dist <= r) {
                            unit.isSelected = true
                        }
                    })
                }
            })
        }
        break;
        case 1: {
                const left = Math.min(dragBox.px1, dragBox.px2);
                const right = Math.max(dragBox.px1, dragBox.px2);
                const top = Math.min(dragBox.py1, dragBox.py2);
                const bottom = Math.max(dragBox.py1, dragBox.py2);
                let stars = [...globalStars].filter(([id]) => id.startsWith(playerTeam))
                stars.forEach(([id, star]) => {
                    let cX = Math.max(left, Math.min(star.x, right))
                    let cY = Math.max(top, Math.min(star.y, bottom))

                    let dx = star.x-cX
                    let dy = star.y-cY
                    let dist = dx*dx+dy*dy
                    let r = star.size*star.size

                    if (dist <= r) {
                        star.isSelected = true
                    }
                })
        }
        break;
    }
    dragBox = null
})
let speed = 10

setInterval(() => {
    
    selectTypeBox.selectType = selectType
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
    ctx.save()
    camera.apply()
    flashes.forEach((flash) => {
        flash.draw()
    })
    starFuses.forEach((starFusing) => {
        starFusing.draw()
    })
    globalStars.forEach((star) => {
        star.draw()
    })
    globalUnits.forEach((unit) => {
        unit.draw()
    })
    if (dragBox) { dragBox.draw(); }

    ctx.restore()
    selectTypeBox.draw()

    requestAnimationFrame(render)
}

render()