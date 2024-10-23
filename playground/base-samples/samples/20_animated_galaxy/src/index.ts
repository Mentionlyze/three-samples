import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeContext } from '@three-samples/core'
import GUI from 'lil-gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const gui = new GUI({
  width: 300,
})

const wrapper = document.getElementById('20_animated_galaxy_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)
camera.position.x = 3
camera.position.y = 2

const params = {
  count: 200000,
  size: 0.02,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.5,
  randomnessPower: 3,

  insideColor: '#ffd500',
  outsideColor: '#0048ff',
}

let geometry: THREE.BufferGeometry | null = null
let material: THREE.ShaderMaterial | null = null
let points: THREE.Points | null = null

const generateGalaxy = () => {
  if (points !== null) {
    geometry!.dispose()
    material!.dispose()
    scene.remove(points)
  }

  geometry = new THREE.BufferGeometry()
  const vertices = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)
  const scales = new Float32Array(params.count)
  const randomness = new Float32Array(params.count * 3)

  const colorInside = new THREE.Color(params.insideColor)
  const colorOutside = new THREE.Color(params.outsideColor)

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3

    const radius = Math.random() * params.radius

    const spinAngle = radius * params.spin
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2

    // const randomX = (Math.random() - 0.5) * params.randomness
    // const randomY = (Math.random() - 0.5) * params.randomness
    // const randomZ = (Math.random() - 0.5) * params.randomness

    vertices[i3] = Math.cos(branchAngle) * radius
    vertices[i3 + 1] = 0.0
    vertices[i3 + 2] = Math.sin(branchAngle) * radius

    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / params.radius)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b

    scales[i] = Math.random()

    const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius
    const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius
    const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius

    randomness[i3] = randomX
    randomness[i3 + 1] = randomY
    randomness[i3 + 2] = randomZ
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))
  material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    // vertexColors: true,
    vertexShader,
    fragmentShader,
    uniforms: {
      uSize: { value: 30.0 * renderer.getPixelRatio() },
      uTime: { value: 0.0 },
    },
  })
  points = new THREE.Points(geometry, material)
  scene.add(points)
}

gui.add(params, 'count', 100, 1000000, 1).onFinishChange(generateGalaxy)
gui.add(params, 'size', 0, 0.1, 0.001).onFinishChange(generateGalaxy)
gui.add(params, 'radius', 0.1, 20, 0.01).onFinishChange(generateGalaxy)
gui.add(params, 'branches', 3, 9, 1).onFinishChange(generateGalaxy)
gui.add(params, 'spin', -5, 5, 0.001).onFinishChange(generateGalaxy)
gui.add(params, 'randomness', 0, 2, 0.001).onFinishChange(generateGalaxy)
gui.add(params, 'randomnessPower', 1, 10, 0.001).onFinishChange(generateGalaxy)
gui.addColor(params, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(params, 'outsideColor').onFinishChange(generateGalaxy)

generateGalaxy()

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const clock = new THREE.Clock()
let lastFrameTime = 0

function tick() {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - lastFrameTime
  lastFrameTime = elapsedTime

  material!.uniforms.uTime.value = elapsedTime

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
