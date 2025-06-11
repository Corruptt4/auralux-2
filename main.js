import { settings } from "./MODULES/global"


export const cns = document.getElementById("canvas"),
                          ctx = cns.getContext("2d");

let globalUnits = new Map()
let globalStars = new Map()

const set = settings


function render() {
    ctx.clearRect(0, 0, cns.width, cns.height)

    requestAnimationFrame(render)
}
