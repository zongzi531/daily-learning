import {
  PerspectiveCamera,
  Scene,
  MeshBasicMaterial,
  Mesh,
  BoxBufferGeometry,
  WebGLRenderer,
  CanvasTexture,
  Texture
} from 'three'
import arina_hashimoto1215 from './assets/arina_hashimoto1215.jpg'

let camera: PerspectiveCamera,
    scene: Scene,
    material: MeshBasicMaterial,
    mesh: Mesh,
    renderer: WebGLRenderer

const init = () => {
  camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1 , 2000)
  camera.position.z = 500

  scene = new Scene()

  material = new MeshBasicMaterial()

  mesh = new Mesh(new BoxBufferGeometry(200, 200, 200), material)

  scene.add(mesh)

  renderer = new WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
}

const setupCanvas = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  material.map = new CanvasTexture(canvas)
  const img = document.createElement('img')
  img.src = arina_hashimoto1215
  img.onload = () => {
    context.drawImage(img, 0, 0, 128, 128)
    ;(material.map as Texture).needsUpdate = true
    renderer.render(scene, camera)
  }
}

const animate = () => {
  requestAnimationFrame(animate)
  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.01
  renderer.render(scene, camera)
}

init()
setupCanvas()
animate()
