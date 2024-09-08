import * as Three from 'three'
import { createThreeContext } from '@three-samples/core'

const { scene, camera, renderer } = createThreeContext(document.body)


const geometry = new Three.BoxGeometry()
const material = new Three.MeshBasicMaterial({ color: 0xffff3355 })
const mesh = new Three.Mesh(geometry, material)
const group = new Three.Group()
group.add(mesh)

scene.add(group)

function tick() {
    camera.lookAt(mesh.position)
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}
tick()