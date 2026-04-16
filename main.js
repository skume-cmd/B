import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader";
import { OrbitControls } from "OrbitControls";

console.log('THREE OK')

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(0, 1.5, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// ライト
scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(5, 10, 5)
scene.add(light)

// モデル読み込み
const loader = new GLTFLoader()
loader.load(
    './models/character.glb',
    (gltf) => {
        console.log('GLTF loaded', gltf)
        scene.add(gltf.scene)
    },
    undefined,
    (error) => {
        console.error('GLTF error', error)
    }
)

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

animate()