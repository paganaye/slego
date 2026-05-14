import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { BOARD_SIZE, currentPiece, pieceTiles } from './Game'
import type { GameState, Position } from './Game'
import { Board3D } from './Board3D'
import { Piece3D } from './Piece3D'
import { PieceZone3D } from './PieceZone3D'
import { Stack3D } from './Stack3D'
import { TOKEN_SIZE } from './Token'
import type { MeshUserData } from './MeshUserData'
import { AnimationPhase } from './AnimationPhase'

// ── Scene ───────────────────────────────────────────────────
const SCENE_BG = 0x101828
const TONE_EXPOSURE = 0.5

// ── Floor ──────────────────────────────────────────────────
const FLOOR_COLOR = 0x1e5b3d
const FLOOR_POS = { x: 0, y: -3.35, z: 0 }
const FLOOR_SIZE = { x: 20, y: 0.2, z: 20 }

// ── Camera ──────────────────────────────────────────────────
const CAM_POS = { x: 0, y: 0, z: 10 }
const ORBIT_TARGET = { x: 0.0, y: 0, z: 0 }

// ── Lights ──────────────────────────────────────────────────
const AMBIENT_INTENSITY = 0.58
const KEY_LIGHT_INTENSITY = 1.75
const FILL_LIGHT_INTENSITY = 1.05
const RIM_LIGHT_INTENSITY = 1.1
const SPARKLE_LIGHT_INTENSITY = 0.8

const NEXT_SPAWN_FROM = { x: 7.0, y: 0, z: 1.8 }
const NEXT_SPAWN_TO = { x: 3.7, y: 0, z: 0 }
const NEXT_SPAWN_DURATION = 0.55
const NEXT_SPAWN_ARC_Y = 0.45

const BOARD_POS = { x: -2.5, y: 0, z: 0 }
const CELL_DIST = 1
const PLAYER_MOVE_IN_DURATION = 0.35
const PLAYER_STAMP_DURATION = 0.25
const OVERWRITE_PUSH_BACK_Y_DISTANCE = 1.2

const ANIMATION_MULTIPLIER = 0.1

type NextPieceSpawnAnim = {
    elapsed: number
    duration: number
    from: THREE.Vector3
    to: THREE.Vector3
    startRotX: number
    startRotZ: number
}

type PlayerMoveInAnim = {
    elapsed: number
    duration: number
    from: THREE.Vector3
    to: THREE.Vector3
    targetPos: Position
}

type PlayerStampAnim = {
    elapsed: number
    duration: number
    targetPos: Position
    fromZ: number
    toZ: number
}

type OverwritenFallAnim = {
    elapsed: number
    duration: number
}

// ─── Scene3D ──────────────────────────────────────────────────

export class Scene3D {
    private scene: THREE.Scene
    private camera: THREE.PerspectiveCamera
    private renderer: THREE.WebGLRenderer
    private controls: OrbitControls
    private pmremGenerator: THREE.PMREMGenerator
    private envTexture: THREE.Texture
    private disposables: Array<THREE.BufferGeometry | THREE.Material> = []
    private board3d: Board3D
    private cross3d: Piece3D
    private pieceZone3d: PieceZone3D
    private stack3d: Stack3D
    private raycaster = new THREE.Raycaster()
    private pointer = new THREE.Vector2()
    private animationPhase: AnimationPhase | null = null
    private nextPieceSpawnAnim: NextPieceSpawnAnim | null = null
    private playerMoveInAnim: PlayerMoveInAnim | null = null
    private playerStampAnim: PlayerStampAnim | null = null
    private playerStampTargetPos: Position | null = null
    private overwritenFallAnim: OverwritenFallAnim | null = null
    private animationFrameId = 0
    private previousTime = performance.now()
    private gameState: GameState

    constructor(
        container: HTMLElement,
        state: GameState,
        private onBoardCellClick: (pos: Position) => void
    ) {
        this.gameState = state
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(SCENE_BG)

        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
        this.camera.position.set(CAM_POS.x, CAM_POS.y, CAM_POS.z)
        this.camera.lookAt(3.2, 0, 0)

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(container.clientWidth, container.clientHeight)
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = TONE_EXPOSURE
        container.appendChild(this.renderer.domElement)

        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
        this.envTexture = this.pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture
        this.scene.environment = this.envTexture

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.target.set(ORBIT_TARGET.x, ORBIT_TARGET.y, ORBIT_TARGET.z)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.08
        this.controls.update()

        this._addFloor()
        this._addLights()

        this.board3d = new Board3D(this.scene, this.disposables)
        this.cross3d = new Piece3D(this.scene, this.disposables)
        this.pieceZone3d = new PieceZone3D(this.scene, this.disposables)
        this.stack3d = new Stack3D(this.scene, this.disposables)

        this.board3d.build(state)
        this.stack3d.build(state)
        this._startNextPieceSpawn(state)

        window.addEventListener('resize', this._onResize)
        this.renderer.domElement.addEventListener('click', this._onCanvasClick)
        this._renderLoop()
    }

    private _findMeshUserData(object: THREE.Object3D | null): MeshUserData | null {
        let current: THREE.Object3D | null = object
        while (current && current !== this.scene) {
            const data = current.userData as MeshUserData | undefined
            if (data && typeof data === 'object' && 'type' in data) return data
            current = current.parent
        }
        return null
    }

    private _onCanvasClick = (event: MouseEvent) => {
        if (this.animationPhase) return

        const canvas = this.renderer.domElement
        const rect = canvas.getBoundingClientRect()
        this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

        this.raycaster.setFromCamera(this.pointer, this.camera)
        const hits = this.raycaster.intersectObjects(this.scene.children, true)

        for (const hit of hits) {
            const data = this._findMeshUserData(hit.object)
            if (!data) continue

            if (data.type === 'board') {
                this._startPlayerMoveIn(data.pos)
                return
            }
        }
    }

    private _boardWorldPos(pos: Position): THREE.Vector3 {
        return new THREE.Vector3(
            BOARD_POS.x + (pos.tx - 2) * CELL_DIST,
            (2 - pos.ty) * CELL_DIST,
            0
        )
    }

    private _onResize = () => {
        const container = this.renderer.domElement.parentElement
        if (!container) return
        this.camera.aspect = container.clientWidth / container.clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(container.clientWidth, container.clientHeight)
    }

    private _addFloor() {
        const geo = new THREE.BoxGeometry(FLOOR_SIZE.x, FLOOR_SIZE.y, FLOOR_SIZE.z)
        const mat = new THREE.MeshPhysicalMaterial({
            color: FLOOR_COLOR, roughness: 0.9, metalness: 0.02,
            clearcoat: 0.08, clearcoatRoughness: 0.65,
        })
        const floor = new THREE.Mesh(geo, mat)
        floor.position.set(FLOOR_POS.x, FLOOR_POS.y - FLOOR_SIZE.y / 2, FLOOR_POS.z)
        this.scene.add(floor)
        this.disposables.push(geo, mat)
    }

    private _addLights() {
        const ambient = new THREE.AmbientLight(0xffffff, AMBIENT_INTENSITY)
        const key = new THREE.DirectionalLight(0xffffff, KEY_LIGHT_INTENSITY)
        key.position.set(3, 4, 6)
        const fill = new THREE.DirectionalLight(0x9ec5ff, FILL_LIGHT_INTENSITY)
        fill.position.set(-4, 2, 3)
        const rim = new THREE.DirectionalLight(0xffeccf, RIM_LIGHT_INTENSITY)
        rim.position.set(0, 3, 5)
        const sparkle = new THREE.PointLight(0xffffff, SPARKLE_LIGHT_INTENSITY, 20)
        sparkle.position.set(0, 2, 7)
        this.scene.add(ambient, key, fill, rim, sparkle)
    }

    /** Call after each game state change to refresh board and piece display */
    update(state: GameState) {
        this.gameState = state
        this.board3d.build(state)
        this.stack3d.build(state)
        this.playerMoveInAnim = null
        this.playerStampAnim = null
        this.playerStampTargetPos = null
        this.overwritenFallAnim = null
        this._startNextPieceSpawn(state)
    }

    private _overwrittenCells(targetPos: Position): Position[] {
        const piece = currentPiece(this.gameState)
        if (!piece) return []

        const cells: Position[] = []
        for (const tile of pieceTiles(piece)) {
            const tx = targetPos.tx + tile.dx
            const ty = targetPos.ty + tile.dy
            if (tx < 0 || tx >= BOARD_SIZE || ty < 0 || ty >= BOARD_SIZE) continue
            if (this.gameState.board.getCell(tx, ty) === null) continue
            cells.push({ tx, ty })
        }
        return cells
    }

    private _startPlayerMoveIn(pos: Position) {
        const from = this.cross3d.group.position.clone()
        const to = this._boardWorldPos(pos)
        to.z = TOKEN_SIZE.z * 0.5

        this.animationPhase = AnimationPhase.PlayerMoveIn
        this.playerMoveInAnim = {
            elapsed: 0,
            duration: PLAYER_MOVE_IN_DURATION,
            from,
            to,
            targetPos: pos,
        }
    }

    private _startPlayerStamp(targetPos: Position) {
        this.animationPhase = AnimationPhase.PlayerStamp
        this.playerStampTargetPos = targetPos
        this.playerStampAnim = {
            elapsed: 0,
            duration: PLAYER_STAMP_DURATION,
            targetPos,
            fromZ: this.cross3d.group.position.z,
            toZ: 0,
        }
        this._startStampWithYPushBackParallel(targetPos)
    }

    private _startStampWithYPushBackParallel(targetPos: Position) {
        const cells = this._overwrittenCells(targetPos)
        if (cells.length === 0) return
        this.board3d.startPushBack(cells, PLAYER_STAMP_DURATION, OVERWRITE_PUSH_BACK_Y_DISTANCE)
    }

    private _startNextPieceSpawn(state: GameState) {
        const piece = currentPiece(state)
        if (!piece) {
            this.cross3d.group.visible = false
            this.animationPhase = null
            this.nextPieceSpawnAnim = null
            return
        }

        this.cross3d.group.visible = true
        this.cross3d.buildAt(piece, NEXT_SPAWN_FROM.x, NEXT_SPAWN_FROM.y, NEXT_SPAWN_FROM.z)

        const startRotX = -0.25
        const startRotZ = (Math.random() - 0.5) * 0.22
        this.cross3d.group.rotation.set(startRotX, 0, startRotZ)

        this.animationPhase = AnimationPhase.NextPieceSpawn
        this.nextPieceSpawnAnim = {
            elapsed: 0,
            duration: NEXT_SPAWN_DURATION,
            from: new THREE.Vector3(NEXT_SPAWN_FROM.x, NEXT_SPAWN_FROM.y, NEXT_SPAWN_FROM.z),
            to: new THREE.Vector3(NEXT_SPAWN_TO.x, NEXT_SPAWN_TO.y, NEXT_SPAWN_TO.z),
            startRotX,
            startRotZ,
        }
    }

    private _tickNextPieceSpawn(dt: number) {
        const anim = this.nextPieceSpawnAnim
        if (!anim) return

        anim.elapsed = Math.min(anim.duration, anim.elapsed + dt)
        const t = anim.elapsed / anim.duration
        const eased = 1 - Math.pow(1 - t, 3)

        this.cross3d.group.position.lerpVectors(anim.from, anim.to, eased)
        this.cross3d.group.position.y += Math.sin(Math.PI * eased) * NEXT_SPAWN_ARC_Y
        this.cross3d.group.rotation.x = anim.startRotX * (1 - eased)
        this.cross3d.group.rotation.z = anim.startRotZ * (1 - eased)

        if (t >= 1) {
            this.cross3d.group.position.set(anim.to.x, anim.to.y, anim.to.z)
            this.cross3d.group.rotation.set(0, 0, 0)
            this.nextPieceSpawnAnim = null
            this.animationPhase = null
        }
    }

    private _tickPlayerMoveIn(dt: number) {
        const anim = this.playerMoveInAnim
        if (!anim) return

        anim.elapsed = Math.min(anim.duration, anim.elapsed + dt)
        const t = anim.elapsed / anim.duration
        const eased = 1 - Math.pow(1 - t, 3)

        this.cross3d.group.position.lerpVectors(anim.from, anim.to, eased)
        this.cross3d.group.rotation.x = -0.1 * (1 - eased)

        if (t >= 1) {
            this.cross3d.group.position.set(anim.to.x, anim.to.y, anim.to.z)
            this.playerMoveInAnim = null
            this._startPlayerStamp(anim.targetPos)
        }
    }

    private _tickPlayerStamp(dt: number) {
        const anim = this.playerStampAnim
        if (!anim) return

        anim.elapsed = Math.min(anim.duration, anim.elapsed + dt)
        const t = anim.elapsed / anim.duration
        const c1 = 1.70158
        const c3 = c1 + 1
        const eased = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)

        this.cross3d.group.position.z = anim.fromZ + (anim.toZ - anim.fromZ) * eased
        this.cross3d.group.rotation.x = -0.04 * (1 - t)

        if (t >= 1) {
            this.cross3d.group.position.z = anim.toZ
            this.cross3d.group.rotation.x = 0
            this.playerStampAnim = null
            if (!this.board3d.isPushBackActive()) {
                this.animationPhase = null
                if (this.playerStampTargetPos) this.onBoardCellClick(this.playerStampTargetPos)
                this.playerStampTargetPos = null
            }
        }
    }

    private _tickPlayerStampAndPushBack() {
        if (this.board3d.isPushBackActive()) return
        this.animationPhase = AnimationPhase.OverwritenFall
        this.overwritenFallAnim = {
            elapsed: 0,
            duration: 0.01,
        }
        this.board3d.transitionToFall()
    }

    private _tickOverwritenFall() {
        const anim = this.overwritenFallAnim
        if (!anim) return
        anim.elapsed += 0.016
        if (anim.elapsed >= anim.duration) {
            this.overwritenFallAnim = null
            this.animationPhase = null
            const pos = this.playerStampTargetPos
            this.playerStampTargetPos = null
            if (pos) this.onBoardCellClick(pos)
        }
    }

    private _renderLoop = () => {
        const now = performance.now()
        let dt = Math.min(0.033, (now - this.previousTime) / 1000)
        if (dt > 0.2) dt = 0.2;
        this.previousTime = now

        dt *= ANIMATION_MULTIPLIER;

        this.board3d.tick(dt)
        if (this.animationPhase === AnimationPhase.NextPieceSpawn) this._tickNextPieceSpawn(dt)
        if (this.animationPhase === AnimationPhase.PlayerMoveIn) this._tickPlayerMoveIn(dt)
        if (this.animationPhase === AnimationPhase.PlayerStamp) this._tickPlayerStamp(dt)
        if (this.animationPhase === AnimationPhase.PlayerStamp && !this.playerStampAnim) this._tickPlayerStampAndPushBack()
        if (this.animationPhase === AnimationPhase.OverwritenFall) this._tickOverwritenFall()
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
        this.animationFrameId = requestAnimationFrame(this._renderLoop)
    }

    dispose() {
        cancelAnimationFrame(this.animationFrameId)
        window.removeEventListener('resize', this._onResize)
        this.renderer.domElement.removeEventListener('click', this._onCanvasClick)
        this.board3d.dispose()
        this.cross3d.dispose()
        this.pieceZone3d.dispose()
        this.stack3d.dispose()
        this.controls.dispose()
        for (const d of this.disposables) d.dispose()
        this.pmremGenerator.dispose()
        this.envTexture.dispose()
        this.renderer.dispose()
        const canvas = this.renderer.domElement
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }
}
