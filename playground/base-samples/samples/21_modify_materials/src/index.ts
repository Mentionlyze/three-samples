import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeContext } from '@three-samples/core'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const wrapper = document.getElementById('21_modify_materials_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)
camera.position.x = 3
camera.position.y = 2
camera.position.z = 8

const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const cubeTextureLoad = new THREE.CubeTextureLoader()

const environmentMap = cubeTextureLoad.load([
  './static/textures/environmentMaps/0/px.jpg',
  './static/textures/environmentMaps/0/nx.jpg',
  './static/textures/environmentMaps/0/py.jpg',
  './static/textures/environmentMaps/0/ny.jpg',
  './static/textures/environmentMaps/0/pz.jpg',
  './static/textures/environmentMaps/0/nz.jpg',
])
environmentMap.colorSpace = THREE.SRGBColorSpace

scene.background = environmentMap
scene.environment = environmentMap

const mapTexture = textureLoader.load('./static/models/LeePerrySmith/color.jpg')
environmentMap.colorSpace = THREE.SRGBColorSpace

const normalTexture = textureLoader.load('./static/models/LeePerrySmith/normal.jpg')

const material = new THREE.MeshStandardMaterial({
  map: mapTexture,
  normalMap: normalTexture,
})

material.onBeforeCompile = (shader) => {
  console.log(shader)
}

gltfLoader.load('./static/models/LeePerrySmith/LeePerrySmith.glb', (gltf) => {
  const mesh = gltf.scene.children[0] as THREE.Mesh
  mesh.rotation.y = Math.PI * 0.5
  mesh.material = material
  scene.add(mesh)
})

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, -2.25)
scene.add(directionalLight)

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
