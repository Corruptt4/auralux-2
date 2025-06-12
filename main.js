import { settings } from "./MODULES/global.js";
import { Star } from "./MODULES/ENTITIES/star.js";
import { Camera } from "./MODULES/camera.js"


export const cns = document.getElementById("canvas"),
                          ctx = cns.getContext("2d"),
                          frictionFactor = 0.9

export let globalUnits = new Map()
export let globalStars = new Map()
export let flashes = []

let star = new Star(0, 0, 3, "rgb(0, 0, 205)", 1)
globalStars.set(star.id, star)

const set = settings
let camera = new Camera(0, 0)

setInterval(() => {
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