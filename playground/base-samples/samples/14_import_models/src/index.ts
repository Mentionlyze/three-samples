import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { createThreeContext } from '@three-samples/core'

const wrapper = document.getElementById('14_import_models_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)
camera.position.x = 3
camera.position.y = 2

const loader = new GLTFLoader()
const dRACOLoader = new DRACOLoader()
dRACOLoader.setDecoderPath('/static/draco/')
loader.setDRACOLoader(dRACOLoader)

let mixer

loader.load(
    './static/models/Fox/glTF/Fox.gltf',
    (gltf) => {
        console.log(gltf)

        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[2])

        console.log(action)
        action.play()

        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene)
    },
    () => { console.log('progress') },
    () => { console.log('error') },
)


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const clock = new THREE.Clock()
let lastFrameTime = 0

function tick() {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastFrameTime
    lastFrameTime = elapsedTime

    if (mixer) (
        mixer.update(deltaTime)
    )

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()