import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeContext } from '@three-samples/core'
import GUI from 'lil-gui'
import * as CANNON from 'cannon-es'
import { meshMaterial, environmentMapTexture } from './geometryAndMaterial'

const gui = new GUI({
    width: 300
})

const hitSound = new Audio('./static/sounds/hit.mp3')
const playHitSound = (collision: any) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if (impactStrength > 1.5) {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}

const wrapper = document.getElementById('13_physics_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)
camera.position.x = -3
camera.position.y = 3
camera.position.z = 3

/**
 * Physics
 */
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82, 0)

const concreteMaterial = new CANNON.Material('concrete')
const plasticMaterial = new CANNON.Material('plastic')

const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(concretePlasticContactMaterial)
/**
 * Textures
 */

/**
 * Floor
 */
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({
    mass: 0,
    shape: planeShape,
    material: concreteMaterial
})
// planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
planeBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI / 2
)
world.addBody(planeBody)


const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)


const objects: { mesh: THREE.Mesh, body: CANNON.Body }[] = []

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
export const createBox = (width: number, height: number, depth: number, position: CANNON.Vec3) => {
    const mesh = new THREE.Mesh(boxGeometry, meshMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const body = new CANNON.Body({
        shape,
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        material: plasticMaterial
    })
    body.position.copy(position)
    world.addBody(body)
    body.addEventListener('collide', playHitSound)

    objects.push({
        mesh,
        body
    })
}

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
export const createSphere = (radius: number, position: CANNON.Vec3) => {
    const mesh = new THREE.Mesh(sphereGeometry, meshMaterial)
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        shape,
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        material: plasticMaterial
    })
    body.position.copy(position)
    world.addBody(body)
    body.addEventListener('collide', playHitSound)

    objects.push({
        mesh,
        body
    })
}


const debugParams = {
    createBox() {
        createBox(Math.random(), Math.random(), Math.random(), new CANNON.Vec3(
            (Math.random() - 0.5) * 3,
            3,
            (Math.random() - 0.5) * 3,
        ))
    },
    createSphere() {
        createSphere(Math.random() * 0.3 + 0.2, new CANNON.Vec3(
            (Math.random() - 0.5) * 3,
            3,
            (Math.random() - 0.5) * 3,
        ))
    },
    reset() {
        for (let { mesh, body } of objects) {
            scene.remove(mesh)
            body.removeEventListener('collide', playHitSound)
            world.removeBody(body)
        }

        objects.splice(0, objects.length)
    }
}

gui.add(debugParams, 'createBox')
gui.add(debugParams, 'createSphere')
gui.add(debugParams, 'reset')
gui.add(directionalLight, 'intensity', 0.1, 3, 0.001)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true


const clock = new THREE.Clock()
let oldElpasedTime = clock.getElapsedTime()

function tick() {

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElpasedTime
    oldElpasedTime = elapsedTime;

    for (let { mesh, body } of objects) {
        mesh.position.copy(body.position)
        mesh.quaternion.copy(body.quaternion)
    }

    world.step(1 / 60, deltaTime, 3)

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()