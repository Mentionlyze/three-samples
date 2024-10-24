import * as THREE from 'three'

const defaultCameraConfig = {
  fov: 75,
  aspectRatio: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 1000,
}

const defaultRendererConfig: THREE.WebGLRendererParameters = {
  antialias: true,
}

export function createThreeContext(
  dom: HTMLCanvasElement,
  cameraConfig: Record<string, any> = defaultCameraConfig,
  rendererConfig: THREE.WebGLRendererParameters = defaultRendererConfig
) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(cameraConfig.fov, cameraConfig.aspectRatio, cameraConfig.near, cameraConfig.far)
  camera.position.z = 5
  const renderer = new THREE.WebGLRenderer({ ...rendererConfig, canvas: dom })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1

  document.body.appendChild(renderer.domElement)

  window.addEventListener('resize', () => {
    console.log('resize')
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = dom.clientWidth / dom.clientHeight
    camera.updateProjectionMatrix()
  })

  return { scene, camera, renderer }
}
