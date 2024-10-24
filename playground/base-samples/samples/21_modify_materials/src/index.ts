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

const updateAllMaterial = () => {
  scene.traverse((child) => {
    if ((<THREE.Mesh>child).isMesh && (<THREE.Mesh>child).material instanceof THREE.MeshStandardMaterial) {
      ;((<THREE.Mesh>child).material as THREE.MeshStandardMaterial).envMapIntensity = 1
      ;((<THREE.Mesh>child).material as THREE.MeshStandardMaterial).needsUpdate = true
      ;(<THREE.Mesh>child).castShadow = true
      ;(<THREE.Mesh>child).receiveShadow = true
    }
  })
}

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

const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
})

const customeUniforms = {
  uTime: { value: 0 },
}

material.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customeUniforms.uTime
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
      #include <common>

      uniform float uTime;

      mat2 get2dRotateMatrix(float _angle) {
        return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
      }
    `
  )

  shader.vertexShader = shader.vertexShader.replace(
    '#include <beginnormal_vertex>',
    `
      #include <beginnormal_vertex> 
      float angle = (sin(position.y) + uTime) * 0.9;
      mat2 rotateMatrix = get2dRotateMatrix(angle);

      objectNormal.xz = rotateMatrix * objectNormal.xz;
    `
  )

  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
      #include <begin_vertex> 


      transformed.xz = rotateMatrix * transformed.xz;
    `
  )
}

depthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customeUniforms.uTime
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
      #include <common>

      uniform float uTime;

      mat2 get2dRotateMatrix(float _angle) {
        return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
      }
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
      #include <begin_vertex> 

      float angle = (sin(position.y) + uTime) * 0.9;
      mat2 rotateMatrix = get2dRotateMatrix(angle);
      transformed.xz = rotateMatrix * transformed.xz;
    `
  )
}

gltfLoader.load('./static/models/LeePerrySmith/LeePerrySmith.glb', (gltf) => {
  const mesh = gltf.scene.children[0] as THREE.Mesh
  mesh.rotation.y = Math.PI * 0.5
  mesh.material = material
  mesh.customDepthMaterial = depthMaterial
  scene.add(mesh)

  updateAllMaterial()
})

const plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15, 15), new THREE.MeshStandardMaterial())
plane.rotation.y = -Math.PI
plane.position.y = -5
plane.position.z = 5
scene.add(plane)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.5, 4, -4.5)
scene.add(directionalLight)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1)
scene.add(directionalLightHelper)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const clock = new THREE.Clock()
let lastFrameTime = 0

function tick() {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - lastFrameTime
  lastFrameTime = elapsedTime

  customeUniforms.uTime.value = elapsedTime

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
