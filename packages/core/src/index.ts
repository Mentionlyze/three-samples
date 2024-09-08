import * as Three from 'three'

const defaultCameraConfig = {
    fov: 75,
    aspectRatio: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000
}

const defaultRendererConfig: Three.WebGLRendererParameters = {
    antialias: true
}

export function createThreeContext(dom: HTMLElement | HTMLBodyElement, cameraConfig: Record<string, any> = defaultCameraConfig, rendererConfig: Three.WebGLRendererParameters = defaultRendererConfig) {
    const scene = new Three.Scene()
    const camera = new Three.PerspectiveCamera(cameraConfig.fov, cameraConfig.aspectRatio, cameraConfig.near, cameraConfig.far)
    camera.position.z = 5
    const renderer = new Three.WebGLRenderer(rendererConfig)

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(dom.clientWidth, dom.clientHeight)

    dom.appendChild(renderer.domElement)

    dom.addEventListener('resize', () => {
        renderer.setSize(dom.clientWidth, dom.clientHeight)
        camera.aspect = dom.clientWidth / dom.clientHeight
        camera.updateProjectionMatrix()
    })

    return { scene, camera, renderer }
}