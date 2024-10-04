import * as THREE from 'three'
import { createThreeContext } from '@three-samples/core'

const wrapper = document.getElementById('01_transform_object_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)

camera.position.set(3, 1, 5)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(1, -0.6, 1)
scene.add(mesh)

const axesHelper = new THREE.AxesHelper(3)
camera.lookAt(axesHelper.position)

scene.add(axesHelper)

function tick() {
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()