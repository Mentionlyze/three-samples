import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeContext } from '@three-samples/core'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const wrapper = document.getElementById('19_raging_sea_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)
camera.position.x = 3
camera.position.y = 2

const geometry = new THREE.PlaneGeometry(5, 5, 128, 128)
const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
})
const mesh = new THREE.Mesh(geometry, material)
mesh.rotation.x = -Math.PI * 0.5
scene.add(mesh)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const clock = new THREE.Clock()
let lastFrameTime = 0

function tick() {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - lastFrameTime
  lastFrameTime = elapsedTime

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
