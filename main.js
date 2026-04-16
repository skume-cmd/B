// :white_check_mark: CDN版 three.js
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js'

// --------------------------------------------------------------------
// 基本セットアップ
// --------------------------------------------------------------------
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x202020)

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(0, 1.5, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

// --------------------------------------------------------------------
// ライト
// --------------------------------------------------------------------
scene.add(new THREE.AmbientLight(0xffffff, 0.6))

const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.position.set(5, 10, 5)
scene.add(dirLight)

// --------------------------------------------------------------------
// モデル & アニメーション
// --------------------------------------------------------------------
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

    // 複数アニメーションを登録
    gltf.animations.forEach((clip) => {
        actions[clip.name] = mixer.clipAction(clip)
        console.log('Animation:', clip.name)
    })

    // 最初のアニメーション（例）
    currentAction = actions['Idle']
    if (currentAction) {
        currentAction.play()
    }
})

// --------------------------------------------------------------------
// アニメーション切り替え関数
// --------------------------------------------------------------------
function playAction(name) {
    const nextAction = actions[name]
    if (!nextAction || nextAction === currentAction) return

    currentAction.fadeOut(0.3)
    nextAction.reset().fadeIn(0.3).play()
    currentAction = nextAction
}

// --------------------------------------------------------------------
// キー操作（例）
// --------------------------------------------------------------------
window.addEventListener('keydown', (e) => {
    if (!model) return

    switch (e.code) {
        case 'KeyW':
            playAction('Walk')
            break
        case 'KeyS':
            playAction('Idle')
            break
    }
})

// --------------------------------------------------------------------
// リサイズ対応
// --------------------------------------------------------------------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// --------------------------------------------------------------------
// ループ
// --------------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate)

    const delta = clock.getDelta()
    if (mixer) mixer.update(delta)

    renderer.render(scene, camera)
}

animate()