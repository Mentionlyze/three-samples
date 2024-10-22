import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeContext } from '@three-samples/core'
import GUI from 'lil-gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const gui = new GUI({
  width: 300,
})

const debugParams = {
  depthColor: '#186691',
  surfaceColor: '#9bd8ff',
}

const wrapper = document.getElementById('19_raging_sea_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)
camera.position.x = 3
camera.position.y = 2
camera.position.z = 1

const geometry = new THREE.PlaneGeometry(2, 2, 128, 128)
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  // wireframe: true,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 2) },
    uWaveSpeed: { value: 0.7 },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4.0 },

    uDepthColor: { value: new THREE.Color(debugParams.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugParams.surfaceColor) },
    uColorOffset: { value: 0.18 },
    uColorMultipler: { value: 5 },
  },
})

gui.add(material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
gui.add(material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.01).name('uBigWavesElevationX')
gui.add(material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.01).name('uBigWavesElevationY')
gui.add(material.uniforms.uWaveSpeed, 'value').min(0).max(10).step(0.01).name('uWaveSpeed')

gui.add(material.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(material.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
gui.add(material.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
gui.add(material.uniforms.uSmallWavesIterations, 'value').min(0).max(5).step(1).name('uSmallWavesIterations')

gui
  .addColor(debugParams, 'depthColor')
  .name('depthColor')
  .onFinishChange((value) => {
    material.uniforms.uDepthColor.value.set(value)
  })
gui
  .addColor(debugParams, 'surfaceColor')
  .name('surfaceColor')
  .onFinishChange((value) => {
    material.uniforms.uSurfaceColor.value.set(value)
  })
gui.add(material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(material.uniforms.uColorMultipler, 'value').min(0).max(10).step(0.01).name('uColorMultipler')

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

  material.uniforms.uTime.value = elapsedTime

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
