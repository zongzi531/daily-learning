import {
  PerspectiveCamera,
  Scene,
  Color,
  Fog,
  BoxBufferGeometry,
  MeshNormalMaterial,
  Group,
  Mesh,
  WebGLRenderer,
} from 'three'

let camera: PerspectiveCamera
let scene: Scene
let renderer: WebGLRenderer
let group: Group

let mouseX = 0
let mouseY = 0

let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2

const init = () => {
  camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
  camera.position.z = 500

  scene = new Scene()
  scene.background = new Color(0xffffff)
  scene.fog = new Fog(0xffffff, 1, 10000)

  const geometry = new BoxBufferGeometry(100, 100, 100)
  const material = new MeshNormalMaterial()

  group = new Group()

  for (let i = 0; i < 1000; i++) {
    const mesh = new Mesh(geometry, material)
    mesh.position.x = Math.random() * 2000 - 1000
    mesh.position.y = Math.random() * 2000 - 1000
    mesh.position.z = Math.random() * 2000 - 1000

    mesh.rotation.x = Math.random() * 2 * Math.PI
    mesh.rotation.y = Math.random() * 2 * Math.PI

    mesh.matrixAutoUpdate = true
    mesh.updateMatrix()

    group.add(mesh)
  }

  scene.add(group)

  renderer = new WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  document.addEventListener('mousemove', onDocumentMouseMove, false)
  window.addEventListener('resize', onWindowResize, false)
}

const onWindowResize = () => {
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const onDocumentMouseMove = (event: MouseEvent) => {
  mouseX = (event.clientX - windowHalfX) * 10
  mouseY = (event.clientY - windowHalfY) * 10
}

const render = () => {
  const time = Date.now() * 0.001
  const rx = Math.sin(time * 0.7) * 0.5
  const ry = Math.sin(time * 0.3) * 0.5
  const rz = Math.sin(time * 0.2) * 0.5
  camera.position.x += (mouseX - camera.position.x) * 0.05
  camera.position.y += (-mouseY - camera.position.y) * 0.05
  group.rotation.x = rx
  group.rotation.y = ry
  group.rotation.z = rz
  renderer.render(scene, camera)
}

const animate = () => {
  requestAnimationFrame(animate);
  render()
}

init()
animate()
