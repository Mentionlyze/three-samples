import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeContext } from '@three-samples/core'

const wrapper = document.getElementById('15_raycaster_and_mouse_events_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)
camera.position.x = 3
camera.position.y = 2

const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 2, 2, 2), new THREE.MeshBasicMaterial({
    color: 0xffff00
}))
scene.add(mesh)

const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()
let focus = false
let targetChosen = false
window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = 1 - (e.clientY / window.innerHeight) * 2
})

window.addEventListener('click', () => {
    if (focus && !targetChosen) {
        targetChosen = true
        return
    }

    if (focus && targetChosen) {
        targetChosen = false
    }
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const clock = new THREE.Clock()
let lastFrameTime = 0

function tick() {

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastFrameTime
    lastFrameTime = elapsedTime

    raycaster.setFromCamera(mouse, camera)

    const intersectObjects = raycaster.intersectObjects([mesh])
    mesh.material.color.set(0xffff00)
    if (targetChosen) {
        mesh.material.color.set(0xff00ff)
    }
    if (intersectObjects.length) {
        focus = true

    } else {
        focus = false
    }

    mesh.position.y = Math.sin(elapsedTime) * 2

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()