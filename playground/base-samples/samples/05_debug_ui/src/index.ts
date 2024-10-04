import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeContext } from '@three-samples/core'
import GUI from 'lil-gui'
import gsap from 'gsap'

const gui = new GUI({
    width: 400,
    title: 'cube debug'
})
// gui.close()
// gui.hide()

window.addEventListener('keypress', (e) => {
    console.log(e.key)
    if (e.key === 'q') {
        gui.show(gui._hidden)
    }
})

const debugObject: Record<string, any> = {
    subDivision: 2
}

const wrapper = document.getElementById('05_debug_ui_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)

camera.position.x = 3
camera.position.y = 2
camera.position.z = 3

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

debugObject.spin = () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 })
}

const properies = gui.addFolder('awesome cube')

properies.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation')
properies.add(mesh, 'visible')
properies.add(material, 'wireframe')
properies.addColor(material, 'color').onChange((v) => console.log(v))
properies.add(debugObject, 'spin')
properies.add(debugObject, 'subDivision').min(1).max(20).step(1).onFinishChange(v => {
    mesh.geometry.dispose()
    mesh.geometry = new THREE.BoxGeometry(1, 1, 1, v, v, v)
})


const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function tick() {
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()