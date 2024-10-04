import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeContext } from '@three-samples/core'

const wrapper = document.getElementById('04_geometries_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)

const vertices = new Float32Array(Array.from({ length: 3000 }, () => {
    return Math.random() * 4 - 2
}))

const vertexArray = new THREE.BufferAttribute(vertices, 3)
console.log(vertexArray)
const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', vertexArray)

const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }))
scene.add(mesh)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function tick() {
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()