import * as THREE from 'three'

const cubeTextureLoader = new THREE.CubeTextureLoader()

export const environmentMapTexture = cubeTextureLoader.load([
    './static/textures/environmentMaps/0/px.png',
    './static/textures/environmentMaps/0/nx.png',
    './static/textures/environmentMaps/0/py.png',
    './static/textures/environmentMaps/0/ny.png',
    './static/textures/environmentMaps/0/pz.png',
    './static/textures/environmentMaps/0/nz.png'
])

export const meshMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})