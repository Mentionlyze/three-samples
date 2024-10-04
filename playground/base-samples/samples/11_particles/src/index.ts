import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeContext } from '@three-samples/core'

const wrapper = document.getElementById('11_particles_wrapper') as HTMLCanvasElement

const { scene, camera, renderer } = createThreeContext(wrapper)
camera.position.x = 3
camera.position.y = 2

const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('./static/textures/particles/2.png')
console.log(particlesTexture)


const particlesGeometry = new THREE.BufferGeometry()
const count = 1000
const vertices = new Float32Array(Array.from({ length: count * 3 }, () => {
    return (Math.random() - 0.5) * 10
}))
const colors = new Float32Array(Array.from({ length: count * 3 }, () => {
    return Math.random()
}))
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.1
particlesMaterial.sizeAttenuation = true
particlesMaterial.color = new THREE.Color('#ff88cc')
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particlesTexture
// particlesMaterial.alphaTest = 0.01
// particlesMaterial.depthTest = false
// particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const clock = new THREE.Clock()

function tick() {

    const elapsedTime = clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
        const x = particlesGeometry.attributes.position.array[i * 3]
        particlesGeometry.attributes.position.array[i * 3 + 1] = Math.sin(x + elapsedTime) * 0.6
    }

    particlesGeometry.attributes.position.needsUpdate = true

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()