import {
  PerspectiveCamera,
  Scene,
  MeshBasicMaterial,
  Mesh,
  BoxBufferGeometry,
  WebGLRenderer,
  TextureLoader
} from 'three'
import arina_hashimoto1215 from './assets/arina_hashimoto1215.jpg'
import arina_hashimoto1215_2 from './assets/arina_hashimoto1215-02.jpg'

let camera: PerspectiveCamera,
    scene: Scene,
    material: MeshBasicMaterial,
    mesh: Mesh,
    renderer: WebGLRenderer

const init = () => {
  camera = new PerspectiveCamera(50, window.innerHeight / window.innerHeight, 1 , 2000)
  camera.position.z = 500

  scene = new Scene()

  new TextureLoader().load(arina_hashimoto1215, texture => {
    material = new MeshBasicMaterial({ map: texture })
    mesh = new Mesh(new BoxBufferGeometry(200, 200, 200), material)
    scene.add(mesh)
    renderer.render(scene, camera)
  })

  new TextureLoader().load(arina_hashimoto1215_2, texture => {
    scene.background = texture
    renderer.render(scene, camera)
  })

  renderer = new WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerHeight, window.innerHeight)
  document.body.appendChild(renderer.domElement)
}

init()

document.addEventListener('mousemove', event => {
  const centerX = window.innerHeight / 2
  const centerY = window.innerHeight / 2
  const moveY = (event.x - centerX) / centerX
  const moveX = (event.y - centerY) / centerY
  mesh.rotation.x = moveX
  mesh.rotation.y = moveY
  renderer.render(scene, camera)
})
