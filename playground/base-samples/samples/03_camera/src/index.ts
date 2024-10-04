import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeContext } from '@three-samples/core'


const wrapper = document.getElementById('03_camera_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)

const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }))
scene.add(mesh)

const obitControl = new OrbitControls(camera, renderer.domElement)
obitControl.enableDamping = true

function tick() {
    obitControl.update()

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()