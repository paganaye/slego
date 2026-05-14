import * as THREE from 'three'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'

type Vec3Like = { x: number; y: number; z: number }

const ENABLE_IMAGE_BASED_LIGHTING = true
// ── Scene ───────────────────────────────────────────────────
export const SCENE_BG = 0x04080F //0x101828
export const TONE_EXPOSURE = 0.5

// ── Lights ──────────────────────────────────────────────────
const AMBIENT_INTENSITY = 0.5
const KEY_LIGHT_INTENSITY = 1.0
const BOARD_SPOT_INTENSITY = 12.2
const BOARD_SPOT_ANGLE = Math.PI / 4
const BOARD_SPOT_PENUMBRA = 0.35
const BOARD_SPOT_DECAY = 1.35
const FILL_LIGHT_INTENSITY = 0.4
const RIM_LIGHT_INTENSITY = 0.45
const SPARKLE_LIGHT_INTENSITY = 0.3

export function applySceneEnvironment(scene: THREE.Scene, envTexture: THREE.Texture) {
    scene.environment = ENABLE_IMAGE_BASED_LIGHTING ? envTexture : null
}

export async function loadHDREnvironment(scene: THREE.Scene, renderer: THREE.WebGLRenderer, hdrPath: string): Promise<void> {
    const loader = new HDRLoader()
    const texture = await loader.loadAsync(hdrPath)
    
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    const envMap = pmremGenerator.fromEquirectangular(texture).texture
    pmremGenerator.dispose()
    
    scene.background = envMap
    scene.environment = envMap
}

export function addSceneLights(parent: THREE.Object3D, boardPos: Vec3Like): THREE.Group {
    const boardLightTarget = { x: boardPos.x, y: 0.2, z: 0 }

    const ambient = new THREE.AmbientLight(0xffffff, AMBIENT_INTENSITY)

    const key = new THREE.DirectionalLight(0xffffff, KEY_LIGHT_INTENSITY)
    key.position.set(3.5, 5.5, 6)
    key.target.position.set(boardLightTarget.x, boardLightTarget.y, boardLightTarget.z)

    const boardSpot = new THREE.SpotLight(
        0xffffff,
        BOARD_SPOT_INTENSITY,
        24,
        BOARD_SPOT_ANGLE,
        BOARD_SPOT_PENUMBRA,
        BOARD_SPOT_DECAY
    )
    boardSpot.position.set(boardPos.x + 0.8, 6, 5.5)
    boardSpot.target.position.set(boardLightTarget.x, boardLightTarget.y, boardLightTarget.z)

    const fill = new THREE.DirectionalLight(0x9ec5ff, FILL_LIGHT_INTENSITY)
    fill.position.set(-4, 1.5, 2)

    const rim = new THREE.DirectionalLight(0xffeccf, RIM_LIGHT_INTENSITY)
    rim.position.set(-1, 2.5, 4)

    const sparkle = new THREE.PointLight(0xffffff, SPARKLE_LIGHT_INTENSITY, 20)
    sparkle.position.set(boardPos.x + 0.5, 1.8, 4.8)

    const group = new THREE.Group()
    group.add(
        ambient,
        //     key,
        //     key.target,
        boardSpot,
        //     boardSpot.target,
        //     fill,
        //     rim,
        //     sparkle
    )
    parent.add(group)
    return group
}
