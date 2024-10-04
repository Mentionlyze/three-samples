import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry, TextGeometryParameters } from 'three/examples/jsm/geometries/TextGeometry.js'
import { createThreeContext } from '@three-samples/core'
import GUI from 'lil-gui'

const gui = new GUI()

const wrapper = document.getElementById('07_texts_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)
camera.position.x = 3
camera.position.y = 2

const axes = new THREE.AxesHelper(2)
scene.add(axes)

const fontLoader = new FontLoader()
const textParams: Partial<TextGeometryParameters> = {
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 1
}

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('./static/textures/matcaps/4.png')
console.log(matcapTexture)

const text = new THREE.Mesh()
const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
text.material = textMaterial
fontLoader.load('./static/fonts/helvetiker_regular.typeface.json', (font) => {
    console.log(font)
    let textGeometry = new TextGeometry("Hello Three.js", {
        font,
        ...textParams
    })
    text.geometry = textGeometry
    textGeometry.center()
    scene.add(text)

    gui.add(textParams, 'size').min(0.1).max(2.0).step(0.1).onFinishChange(() => {
        textGeometry.dispose()
        textGeometry = new TextGeometry("Hello Three.js", {
            font,
            ...textParams
        })
        textGeometry.center()
        text.geometry = textGeometry
    })

    gui.add(textParams, 'curveSegments').min(1).max(32).step(0.1).onFinishChange(() => {
        textGeometry.dispose()
        textGeometry = new TextGeometry("Hello Three.js", {
            font,
            ...textParams
        })
        textGeometry.center()
        text.geometry = textGeometry
    })

    gui.add(textParams, 'bevelThickness').min(0.01).max(0.1).step(0.01).onFinishChange(() => {
        textGeometry.dispose()
        textGeometry = new TextGeometry("Hello Three.js", {
            font,
            ...textParams
        })
        textGeometry.center()
        text.geometry = textGeometry
    })

    gui.add(textParams, 'bevelSize').min(0.01).max(0.1).step(0.01).onFinishChange(() => {
        textGeometry.dispose()
        textGeometry = new TextGeometry("Hello Three.js", {
            font,
            ...textParams
        })
        textGeometry.center()
        text.geometry = textGeometry
    })
})


const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 40)
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

console.time('donuts')
for (let i = 0; i < 500; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial)

    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random() * 0.5 + 0.2
    donut.scale.x = scale
    donut.scale.y = scale
    donut.scale.z = scale

    scene.add(donut)
}
console.timeEnd('donuts')

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function tick() {
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()