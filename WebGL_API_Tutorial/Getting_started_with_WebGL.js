const cans = document.getElementById('cans')
const gl = cans.getContext('webgl')

let now = -1000

const main = (times) => {
  if (times - now > 1000) {
    now = times
    const r = Math.random(0, 1)
    const g = Math.random(0, 1)
    const b = Math.random(0, 1)

    gl.clearColor(r, g, b, 1)

    gl.clear(gl.COLOR_BUFFER_BIT)
  }
  window.requestAnimationFrame(main)
}

window.requestAnimationFrame(main)
