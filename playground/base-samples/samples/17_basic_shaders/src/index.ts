import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeContext } from '@three-samples/core'
import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'
import GUI from 'lil-gui'

const gui = new GUI({
  width: 300,
})

const wrapper = document.getElementById('17_basic_shaders_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)
camera.position.x = 3
camera.position.y = 2

const plane = new THREE.PlaneGeometry(5, 5, 32, 32)

const count = plane.attributes.position.count
const randoms = new Float32Array(Array.from({ length: count }, () => Math.random()))
plane.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./static/textures/flag-french.jpg')

const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    u_Fraquency: { value: new THREE.Vector2(10, 10) },
    u_Time: { value: 0 },
    u_Color: { value: new THREE.Color('orange') },
    u_Texture: { value: texture },
  },
})
material.side = THREE.DoubleSide
gui.add(material.uniforms.u_Fraquency.value, 'x', 0, 20, 0.1).name('fraquency x')
gui.add(material.uniforms.u_Fraquency.value, 'y', 0, 20, 0.1).name('fraquency y')

const mesh = new THREE.Mesh(plane, material)
mesh.scale.y = 2 / 3
scene.add(mesh)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const clock = new THREE.Clock()
let lastFrameTime = 0

function tick() {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - lastFrameTime
  lastFrameTime = elapsedTime

  material.uniforms.u_Time.value = elapsedTime * 2

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
