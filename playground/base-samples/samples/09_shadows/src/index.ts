import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeContext } from '@three-samples/core'
import GUI from 'lil-gui'

const gui = new GUI({
    width: 300
})

const wrapper = document.getElementById('09_shadows_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)

renderer.shadowMap.type = THREE.PCFSoftShadowMap

camera.position.x = 3
camera.position.y = 2

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
gui.add(ambientLight, 'intensity', 0, 1, 0.01)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 5
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.radius = 8


const directionalLightCamera = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCamera)

const directionalLightFolder = gui.addFolder('directionalLight ')

directionalLightFolder.add(directionalLight, 'intensity', 0, 1, 0.01)
directionalLightFolder.add(directionalLight.position, 'x', -5, 5, 0.01)
directionalLightFolder.add(directionalLight.position, 'y', -5, 5, 0.01)
directionalLightFolder.add(directionalLight.position, 'z', -5, 5, 0.01)
scene.add(directionalLight)

const spotLight = new THREE.SpotLight(0xffffff, 10, 10, Math.PI * 0.3)
spotLight.position.set(0, 2, 2)
spotLight.castShadow = true
const spotLightFolder = gui.addFolder('spotLight')
spotLightFolder.add(spotLight, 'intensity', 0, 10, 0.01)
spotLightFolder.add(spotLight.position, 'x', -5, 5, 0.01)
spotLightFolder.add(spotLight.position, 'y', -5, 5, 0.01)
spotLightFolder.add(spotLight.position, 'z', -5, 5, 0.01)

const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLight, spotLightHelper)
scene.add(spotLight.target)
console.log(spotLight.target)

const material = new THREE.MeshStandardMaterial({ roughness: 0.5 })
material.side = THREE.DoubleSide
const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphereMesh.castShadow = true


const materialFolder = gui.addFolder('material')
materialFolder.add(material, 'metalness', 0, 1, 0.01)
materialFolder.add(material, 'roughness', 0, 1, 0.01)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5, 20, 20), material)
plane.rotation.x = -Math.PI / 2
plane.position.y = -0.65


scene.add(sphereMesh, plane)
// plane.receiveShadow = true

const textureLoader = new THREE.TextureLoader()
const shadowTexture = textureLoader.load('./static/textures/simpleShadow.jpg')
const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: shadowTexture
}))
shadowPlane.rotation.x = -Math.PI / 2
shadowPlane.position.y = plane.position.y + 0.01
scene.add(shadowPlane)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const clock = new THREE.Clock()

function tick() {
    const elapsedTime = clock.getElapsedTime()

    sphereMesh.position.x = Math.cos(elapsedTime) * 1.5
    sphereMesh.position.z = Math.sin(elapsedTime) * 1.5
    sphereMesh.position.y = Math.abs(Math.sin(elapsedTime * 3))

    shadowPlane.position.x = sphereMesh.position.x
    shadowPlane.position.z = sphereMesh.position.z
    shadowPlane.material.opacity = (1 - Math.abs(sphereMesh.position.y)) * 0.6


    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()