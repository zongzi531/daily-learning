import { mat4 } from 'gl-matrix'

const cans = document.getElementById('cans')
const gl = cans.getContext('webgl')

let now = -1000

const loadShader = (gl, type, source) => {
  const shader = gl.createShader(type)

  gl.shaderSource(shader, source)

  gl.compileShader(shader)

  return shader
}

const initShaderProgram = (gl, vsSource, fsSource) => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  return shaderProgram
}

const initBuffers = (gl) => {
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const vertices = [
     1,  1,  0,
    -1,  1,  0,
     1, -1,  0,
    -1, -1,  0,
  ]

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  return { position: positionBuffer }
}

const drawScene = (gl, programInfo, buffers) => {
  gl.clearColor(0, 0, 0, 1)
  gl.clearDepth(1)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  
  const fieldOfView = 45 * Math.PI / 180
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 100
  const projectionMatrix = mat4.create()

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

  const modelViewMatrix = mat4.create()
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0, 0, -6])

  {
    const numComponents = 3
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset)
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
  }

  gl.useProgram(programInfo.program)

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)

  {
    const offset = 0
    const vertexCount = 4
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
  }
}

const createProgramInfo = (gl, shaderProgram) => ({
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
    modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
  }
})

const step = 0.01
let r = 0
let g = 0
let b = 0

const main = (times) => {
  if (times - now > 1000 || true) {
    now = times

    if (r < 1) { r += step }
    if (r >= 1 && g < 1) { g += step }
    if (g >= 1 && b < 1) { b += step }

    if (r >= 1 && g >= 1 && b >= 1) {
      r = 0
      g = 0
      b = 0
    }

    const vsSource = `
      attribute vec4 aVertexPosition;

      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;

      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      }
    `

    const fsSource = `
      void main() {
        gl_FragColor = vec4(${r}, ${g}, ${b}, 1.0);
      }
    `

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource)

    const programInfo = createProgramInfo(gl, shaderProgram)

    const buffers = initBuffers(gl)

    drawScene(gl, programInfo, buffers)
  }
  window.requestAnimationFrame(main)
}

window.requestAnimationFrame(main)
