import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0, 1.5, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// ライト
scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.position.set(5, 10, 5)
scene.add(dirLight)

// モデル・アニメーション
let mixer
let model
const actions = {}
let currentAction
const clock = new THREE.Clock()

const loader = new GLTFLoader()
loader.load('./models/character.glb', (gltf) => {
    model = gltf.scene
    scene.add(model)

    mixer = new THREE.AnimationMixer(model)

    gltf.animations.forEach((clip) => {
        actions[clip.name] = mixer.clipAction(clip)
    })

    currentAction = actions['idle']
    currentAction.play()
})

function playAction(name) {
    const next = actions[name]
    if (!next || next === currentAction) return

    currentAction.fadeOut(0.3)
    next.reset().fadeIn(0.3).play()
    currentAction = next
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyW') playAction('walk')
    if (e.code === 'KeyS') playAction('idle')
})

function animate() {
    requestAnimationFrame(animate)

    const delta = clock.getDelta()
    if (mixer) mixer.update(delta)

    renderer.render(scene, camera)
}

animate()