import * as THREE from 'three'
import { createThreeContext } from '@three-samples/core'

const wrapper = document.getElementById('02_animations_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)

camera.position.y = 1

const group = new THREE.Group()
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
)
group.add(mesh)
scene.add(group)

const clock = new THREE.Clock()

function tick() {
    // Time
    // const currentTime = Date.now()
    // const deltaTime = currentTime - time
    // time = currentTime
    const elapsedTime = clock.getElapsedTime()

    mesh.position.y = Math.sin(elapsedTime)
    mesh.position.x = Math.cos(elapsedTime)
    camera.lookAt(mesh.position)

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()