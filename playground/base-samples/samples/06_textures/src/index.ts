import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeContext } from '@three-samples/core'
import GUI from 'lil-gui'

const gui = new GUI()

const wrapper = document.getElementById('06_textures_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)
camera.position.x = 3
camera.position.y = 2

const loadManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadManager)

loadManager.onStart = () => {
    console.log('on start')
}

loadManager.onProgress = () => {
    console.log('on progress')
}

loadManager.onLoad = () => {
    console.log('on load')
}

loadManager.onError = () => {
    console.log('on error')
}

const colorTexture = textureLoader.load('./static/textures/door/color.jpg')
const alphaTexture = textureLoader.load('./static/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('./static/textures/door/height.jpg')
const normalTexture = textureLoader.load('./static/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('./static/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('./static/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('./static/textures/door/roughness.jpg')

const material = new THREE.MeshStandardMaterial({ map: colorTexture, aoMap: ambientOcclusionTexture, alphaMap: alphaTexture, normalMap: normalTexture, metalnessMap: metalnessTexture, roughnessMap: roughnessTexture })
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true
material.side = THREE.DoubleSide

const sphereGeometryParams = {
    radius: 0.5,
    widthSegments: 16,
    heightSegments: 16
}

const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64)
const sphereMesh = new THREE.Mesh(sphereGeometry, material)
gui.add(sphereGeometryParams, 'radius').min(0.5).max(5).step(0.1).onFinishChange(v => {
    sphereMesh.geometry = new THREE.SphereGeometry(v, sphereGeometryParams.widthSegments, sphereGeometryParams.heightSegments)
})
gui.add(sphereGeometryParams, 'widthSegments').min(1).max(32).step(1).onFinishChange(v => {
    sphereMesh.geometry = new THREE.SphereGeometry(sphereGeometryParams.radius, v, sphereGeometryParams.heightSegments)
})
gui.add(sphereGeometryParams, 'heightSegments').min(1).max(64).step(1).onFinishChange(v => {
    sphereMesh.geometry = new THREE.SphereGeometry(sphereGeometryParams.radius, sphereGeometryParams.widthSegments, v)
})
sphereMesh.position.x = -2
const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material)
const torusMesh = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material)
torusMesh.position.x = 2
scene.add(sphereMesh, planeMesh, torusMesh)

const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }))
groundMesh.position.y = -1
groundMesh.rotation.x = -Math.PI / 2
scene.add(groundMesh)

const light = new THREE.AmbientLight(0x404040, 1)
const pointLight = new THREE.PointLight(0xffffff)
scene.add(light, pointLight)

gui.add(light, 'intensity').min(0).max(10).step(0.1)
gui.add(pointLight.position, 'x').min(-5).max(5).step(0.5).name('ambient light position')

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function tick() {
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()