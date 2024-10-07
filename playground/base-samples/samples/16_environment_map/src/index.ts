import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js'
import { createThreeContext } from '@three-samples/core'
import GUI from 'lil-gui'

const gui = new GUI({
    width: 300
})

const wrapper = document.getElementById('16_environment_map_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)
camera.position.x = 0
camera.position.y = 3
camera.position.z = 20

const torusGeometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
const torusMaterial = new THREE.MeshStandardMaterial({ roughness: 0, metalness: 1 })

const textureLoader = new RGBELoader()
const envMapTexture = textureLoader.load(
    './static/textures/environmentMaps/2k.hdr',
    (enviromentMap) => {
        enviromentMap.mapping = THREE.EquirectangularReflectionMapping
        scene.background = enviromentMap
        // scene.environment = enviromentMap
    }
)

const torus = new THREE.Mesh(torusGeometry, torusMaterial)
torus.position.set(-4, 3, 0)
scene.add(torus)

const gLTFLoader = new GLTFLoader()
gLTFLoader.load(
    './static/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(10, 10, 10)
        scene.add(gltf.scene)
        camera.lookAt(gltf.scene.position)
    }
)

const holyDonut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({ color: 'white' })
)
holyDonut.position.y = 3.5
holyDonut.layers.enable(1)
scene.add(holyDonut)

/**
 * Cube Target
 */
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
    256,
    {
        type: THREE.HalfFloatType
    }
)
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)
scene.environment = cubeRenderTarget.texture

const debugParams = {
    envMapIntensity: 3,
    backgroundBluriness: 0,
    backgroundIntensity: 0.4
}


const updateAllMaterial = () => {
    scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
            ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).envMapIntensity = debugParams.envMapIntensity
        }
    })
}

gui.add(debugParams, 'envMapIntensity').min(0).max(10).onFinishChange(updateAllMaterial)
gui.add(debugParams, 'backgroundBluriness').min(0).max(10).onFinishChange((v) => {
    scene.backgroundBlurriness = v
})
gui.add(debugParams, 'backgroundIntensity').min(0).max(10).onFinishChange((v) => {
    scene.backgroundIntensity = v
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const clock = new THREE.Clock()
let lastFrameTime = 0

function tick() {

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastFrameTime
    lastFrameTime = elapsedTime

    if (holyDonut) {
        holyDonut.rotation.x = Math.sin(elapsedTime)

        cubeCamera.update(renderer, scene)
    }

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()