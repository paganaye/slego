import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { currentPiece, calcRoundResult, playRound } from './Game'
import type { GameState, IPosition, RoundResult } from './Game'
import type { IPiece } from './Game'
import { ScoreHud3D } from './ScoreHud3D'
import { TOKEN_SIZE } from './Token'
import type { Token } from './Token'
import type { MeshUserData } from './MeshUserData'
import { Mat3D, MAT_SIZE } from './Mat3D'
import { addSceneLights, applySceneEnvironment, SCENE_BG, TONE_EXPOSURE } from './Scene3DLights'
import { Sfx } from './Sfx'
import { sounds, type Sound } from './sounds'
import { Animations } from './Animations3D'
import { loadSettings, saveSettings } from './SettingsData'
import { Layout } from './Layout'
import { PieceGrid3D } from './PieceGrid3D'
import { BoardGrid3D } from './BoardGrid3D'
import { GRID_POSITION_GAIN, GRID_LINEAR_DAMPING, GRID_MAX_ACCELERATION } from './PhysicsConfig'
import { RapierPhysicsWorld, initRapier } from './RapierPhysicsWorld'
import type { MatPiece } from './MatPiece'
import { GRID_CELL_DIST } from './GridMetrics'

const ANIMATION_MULTIPLIER = 1


// ── Camera ──────────────────────────────────────────────────
const CAM_POS = { x: 0, y: 0, z: 10 }
const ORBIT_TARGET = { x: 0.0, y: 0, z: 0 }

const DRAG_SNAP_DISTANCE = 0.5

export type StampPlacement = {
    placed: Array<{
        token: Token
        tx: number
        ty: number
        fromLocal: THREE.Vector3
        toLocal: THREE.Vector3
    }>
    overwritten: Array<{
        token: Token
        fromLocal: THREE.Vector3
        toLocal: THREE.Vector3
    }>
}

const DEBUG_BOARD = false;


// ─── Scene3D ──────────────────────────────────────────────────

export class Scene3D {
    #threeScene: THREE.Scene
    private camera: THREE.PerspectiveCamera
    private renderer: THREE.WebGLRenderer
    private controls: OrbitControls
    private pmremGenerator: THREE.PMREMGenerator
    private envTexture: THREE.Texture
    private disposables: Array<THREE.BufferGeometry | THREE.Material> = []
    private mat3D: Mat3D
    private raycaster = new THREE.Raycaster()
    private pointer = new THREE.Vector2()
    private dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -TOKEN_SIZE.z)
    private dragPlanePoint = new THREE.Vector3()
    private isDraggingCross = false
    private dragPointerId: number | null = null
    private draggedTargetPos: IPosition | null = null

    private scoreHud: ScoreHud3D
    private animationFrameId = 0
    private previousTime = performance.now()
    #gameState: GameState
    private wasSnapped = false
    private settings = loadSettings()
    private layout = new Layout()

    //readonly board3d: Board3D
    readonly sfx = new Sfx()
    //readonly piece3d: Piece3D
    readonly boardGrid3d: BoardGrid3D
    readonly pieceGrid3d: PieceGrid3D
    readonly animations = new Animations(this)
    private rapierWorld: RapierPhysicsWorld | null = null
    private pieceGridLockWorldPos: THREE.Vector3 | null = null
    private pieceGridLocalOffset = new THREE.Vector3()
    private pieceGridCurrentWorldPos = new THREE.Vector3()
    private pieceGridTargetWorldPos = new THREE.Vector3()
    private pieceGridVelocity = new THREE.Vector3()
    private pieceGridMotionActive = false
    #boardZ = 0
    readonly tokenById: Token[] = []
    get gameState(): GameState { return this.#gameState }
    get threeScene(): THREE.Scene { return this.#threeScene }
    get physics(): RapierPhysicsWorld | null { return this.rapierWorld }
    get matGroup(): THREE.Group { return this.mat3D.group }

    constructor(
        container: HTMLElement,
        state: GameState) {
        this.#gameState = state
        saveSettings(this.settings)

        this.#threeScene = new THREE.Scene()
        this.#threeScene.background = new THREE.Color(SCENE_BG)
        this.scoreHud = new ScoreHud3D(this)

        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
        this.camera.position.set(CAM_POS.x, CAM_POS.y, CAM_POS.z)
        this.camera.lookAt(0, 0, 0)

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(container.clientWidth, container.clientHeight)
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = TONE_EXPOSURE
        container.appendChild(this.renderer.domElement)

        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
        this.envTexture = this.pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture
        applySceneEnvironment(this.#threeScene, this.envTexture)

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.target.set(ORBIT_TARGET.x, ORBIT_TARGET.y, ORBIT_TARGET.z)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.08
        this.controls.update()

        this.layout.compute(container.clientWidth, container.clientHeight, this.settings)

        // Create root tokens group - all tokens live here in world coordinates
        const tokensGroup = new THREE.Group()
        tokensGroup.name = 'tokens'
        this.#threeScene.add(tokensGroup)

        this.boardGrid3d = new BoardGrid3D(this, this.#threeScene, this.disposables)
        this.pieceGrid3d = new PieceGrid3D(this, this.#threeScene, this.disposables)
        this.mat3D = new Mat3D(this, this.#threeScene, this.disposables)

        addSceneLights(this.boardGrid3d.group, this.layout.state.boardOrigin)

        if (DEBUG_BOARD) {
            const axesHelper = new THREE.AxesHelper(5)
            this.#threeScene.add(axesHelper)
        }
        this._applyScreenLayout(container.clientWidth, container.clientHeight, true)

        // this.board3d.build(state)
        this.mat3D.createTokens(state)
        this.animations.startNextPieceSpawn()
        this.scoreHud.updateScore(state.total, 0)

        window.addEventListener('resize', this._onResize)
        this.renderer.domElement.addEventListener('pointerdown', this._onPointerDown)
        this.renderer.domElement.addEventListener('pointermove', this._onPointerMove)
        this.renderer.domElement.addEventListener('pointerup', this._onPointerUp)
        this.renderer.domElement.addEventListener('pointercancel', this._onPointerCancel)
        this._renderLoop()
    }

    async initializePhysicsAsync() {
        try {
            await initRapier()
            this.rapierWorld = new RapierPhysicsWorld()
            // Mat collider is the primary landing surface for thrown/falling tokens.
            this.rapierWorld.createMatCollider(
                MAT_SIZE.x,
                MAT_SIZE.y,
                MAT_SIZE.z,
                this.mat3D.position.x,
                this.mat3D.position.y - MAT_SIZE.y / 2,
                this.mat3D.position.z
            )
            // for (const node of this.fallingTokens) {
            //     if (node.falling && node.rapierHandle === null) this._applyFallingBody(node)
            // }
        } catch (err) {
            console.error('Failed to initialize Rapier physics:', err)
        }
    }

    private _findMeshUserData(object: THREE.Object3D | null): MeshUserData | null {
        let current: THREE.Object3D | null = object
        while (current && current !== this.#threeScene) {
            const data = current.userData as MeshUserData | undefined
            if (data && typeof data === 'object' && 'type' in data) return data
            current = current.parent
        }
        return null
    }

    playPosition(targetPos: IPosition) {
        const previousTotal = this.#gameState.total
        this.#gameState = playRound(this.#gameState, targetPos)
        this.scoreHud.updateScore(this.#gameState.total, previousTotal)
        this._applyScreenLayout(
            this.renderer.domElement.clientWidth,
            this.renderer.domElement.clientHeight
        )
    }

    set boardZ(z: number) {
        this.#boardZ = z
        this.dragPlane.constant = -(z + TOKEN_SIZE.z)
        this.controls.target.z = z
        this.boardGrid3d.setDestinationPosition({ x: this.layout.state.boardOrigin.x, y: this.layout.state.boardOrigin.y, z })
        this.pieceGrid3d.setRestPosition({ x: this.layout.state.crossCenter.x, y: this.layout.state.crossCenter.y, z })
        this.pieceGrid3d.setDestinationPosition({ x: this.layout.state.crossCenter.x, y: this.layout.state.crossCenter.y, z })
        const so = this.layout.state.scoreOrigin
        this.scoreHud.setDestinationPosition({ x: so.x, y: so.y, z: so.z + z })
    }
    get boardZ() { return this.#boardZ }


    private _onPointerDown = (event: PointerEvent) => {
        //if (this.animations.animation || !this.piece3d.group.visible) return

        this._setPointerFromClient(event.clientX, event.clientY)
        const hits = this._raycastHits()
        const hitInteractiveTarget = hits.some((hit) => {
            if (this._isCrossObject(hit.object)) return true
            const data = this._findMeshUserData(hit.object)
            return data?.type === 'board' || data?.type === 'pieceTile' || data?.type === 'stack'
        })
        if (!hitInteractiveTarget) return

        this.isDraggingCross = true
        this.dragPointerId = event.pointerId
        //this.dragStartPos.copy(this.piece3d.group.position)
        this.draggedTargetPos = null
        this.wasSnapped = false
        this.controls.enabled = false
        this.renderer.domElement.setPointerCapture(event.pointerId)
        this.playSound(sounds.DragStart)
        this._onPointerMove(event);
    }

    private _onPointerMove = (event: PointerEvent) => {
        if (!this.isDraggingCross || this.dragPointerId !== event.pointerId) return

        this._setPointerFromClient(event.clientX, event.clientY)
        const world = this._projectPointerToDragPlane()
        if (!world) return

        const snap = this._nearestBoardTileXY(world)
        const nearZ = this.#boardZ + TOKEN_SIZE.z
        if (snap && snap.dist < DRAG_SNAP_DISTANCE) {
            const targetWorld = this.boardWorldPos(snap.pos)
            targetWorld.z = nearZ
            this.pieceGrid3d.setPosition(targetWorld)
            this._setCrossOpacity(1)
            if (!this.wasSnapped) {
                this.playSound(sounds.DragSnap)
                this.wasSnapped = true
            }
            this.draggedTargetPos = snap.pos
            return
        } else {
            if (this.wasSnapped) {
                this.playSound(sounds.DragStart)
                this.wasSnapped = false
                this.draggedTargetPos = null
            }
            this.pieceGrid3d.setPosition({ x: world.x, y: world.y, z: nearZ })
            this._setCrossOpacity(0.5)
        }
    }
    // Snap la tile la plus proche du board en XY
    private _nearestBoardTileXY(world: THREE.Vector3): { pos: IPosition, dist: number } | null {
        // Board 5x5 centré sur boardOrigin, cases espacées de GRID_CELL_DIST
        const origin = this.layout.state.boardOrigin;
        let minDist = Infinity;
        let best: IPosition | null = null;
        for (let tx = 0; tx < 5; ++tx) {
            for (let ty = 0; ty < 5; ++ty) {
                const x = origin.x + (tx - 2) * GRID_CELL_DIST.x;
                const y = origin.y + (2 - ty) * GRID_CELL_DIST.y;
                const d = Math.hypot(world.x - x, world.y - y);
                if (d < minDist) {
                    minDist = d;
                    best = { tx, ty };
                }
            }
        }
        if (best) return { pos: best, dist: minDist };
        return null;
    }



    private _onPointerUp = (event: PointerEvent) => {
        if (!this.isDraggingCross || this.dragPointerId !== event.pointerId) return
        this._finishDrag(true)
    }

    private _onPointerCancel = (event: PointerEvent) => {
        if (!this.isDraggingCross || this.dragPointerId !== event.pointerId) return
        this._finishDrag(false)
    }

    private _finishDrag(shouldCommit: boolean) {
        if (this.dragPointerId !== null && this.renderer.domElement.hasPointerCapture(this.dragPointerId)) {
            this.renderer.domElement.releasePointerCapture(this.dragPointerId)
        }
        this.isDraggingCross = false
        this.dragPointerId = null
        this.controls.enabled = true

        const targetPos = shouldCommit ? this.draggedTargetPos : null
        this.draggedTargetPos = null

        if (targetPos) {
            this._setCrossOpacity(1)
            this.playSound(sounds.DropValid)
            this.animations.playerStamp(targetPos)
            return
        }

        this.playSound(sounds.DropInvalid)
        this._setCrossOpacity(1)
        // this.piece3d.snapTo(this.piece3d.group.position)
        // this.piece3d.setDestinationPosition(this.dragStartPos)
    }

    private _setPointerFromClient(clientX: number, clientY: number) {
        const canvas = this.renderer.domElement
        const rect = canvas.getBoundingClientRect()
        this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
        this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
    }

    private _raycastHits() {
        this.raycaster.setFromCamera(this.pointer, this.camera)
        return this.raycaster.intersectObjects(this.#threeScene.children, true)
    }

    private _projectPointerToDragPlane(): THREE.Vector3 | null {
        this.raycaster.setFromCamera(this.pointer, this.camera)
        const point = this.raycaster.ray.intersectPlane(this.dragPlane, this.dragPlanePoint)
        if (!point) return null
        return point.clone()
    }

    // private _worldToBoardPos(_world: THREE.Vector3): Position | null {
    //     // const tx = Math.round((world.x - this.board3d.position.x) / GRID_CELL_DIST.x + 2)
    //     // const ty = Math.round(2 - (world.y - this.board3d.position.y) / GRID_CELL_DIST.y)
    //     //if (tx < 0 || tx >= BOARD_SIZE || ty < 0 || ty >= BOARD_SIZE) return null
    //     //return { tx, ty }
    //     return null as any
    // }

    // private _nearestBoardTarget(world: THREE.Vector3): { pos: Position; dist: number, manhattan: number } | null {
    //     const pos = this._worldToBoardPos(world)
    //     if (!pos) return null
    //     const center = this.boardWorldPos(pos)
    //     const dx = world.x - center.x
    //     const dy = world.y - center.y
    //     return { pos, dist: Math.hypot(dx, dy), manhattan: Math.abs(dx) + Math.abs(dy) }
    // }

    private _setCrossOpacity(opacity: number) {
        // this.piece3d.group.traverse((obj) => {
        //     const mesh = obj as THREE.Mesh
        //     if (!mesh.material) return
        //     const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        //     for (const mat of materials) {
        //         const material = mat as THREE.Material & { opacity?: number; transparent?: boolean }
        //         if (typeof material.opacity !== 'number') continue
        //         if (material.transparent !== true) {
        //             material.transparent = true
        //             material.needsUpdate = true
        //         }
        //         material.opacity = opacity
        //         material.needsUpdate = true
        //     }
        // })
        this.pieceGrid3d.setOpacity(opacity)
    }

    private _isCrossObject(object: THREE.Object3D | null): boolean {
        if (this.pieceGrid3d.containsObject(object)) return true
        let current: THREE.Object3D | null = object
        while (current) {
            //if (current === this.piece3d.group) return true
            current = current.parent
        }
        return false
    }

    boardWorldPos(_pos: IPosition): THREE.Vector3 {
        // Board centered: tx in [0,4], ty in [0,4], but offset by boardOrigin
        const origin = this.layout.state.boardOrigin;
        const x = origin.x + (_pos.tx - 2) * GRID_CELL_DIST.x;
        const y = origin.y + (2 - _pos.ty) * GRID_CELL_DIST.y;
        const z = origin.z;
        return new THREE.Vector3(x, y, z);
    }

    // prepareStampPlacement(targetPos: Position): StampPlacement {
    //     const piece = currentPiece(this.#gameState)
    //     if (!piece) return { placed: [], overwritten: [] }

    //     const placed: StampPlacement['placed'] = []
    //     const overwritten: StampPlacement['overwritten'] = []

    //     for (const tile of pieceTiles(piece)) {
    //         const token = piece.tokensBySlot?.[pieceSlotFromTile(tile)]
    //         if (!token) continue

    //         const tx = targetPos.tx + tile.dx
    //         const ty = targetPos.ty + tile.dy
    //         const inBounds = tx >= 0 && tx < 5 && ty >= 0 && ty < 5

    //         this.boardGrid3d.attachObjectKeepWorld(token.mesh)

    //         if (!inBounds) {
    //             token.setLocation('mat-played')
    //             this.#threeScene.attach(token.mesh)
    //             this._startTokenFreeFall(token)
    //             continue
    //         }

    //         const key = this._cellKey(tx, ty)
    //         const overwrittenToken = this.boardTokensByCell.get(key)
    //         if (overwrittenToken) {
    //             overwritten.push({
    //                 token: overwrittenToken,
    //                 fromLocal: overwrittenToken.mesh.position.clone(),
    //                 toLocal: overwrittenToken.mesh.position.clone().add(new THREE.Vector3(0, 0, OVERWRITE_PUSHBACK_Z)),
    //             })
    //             this.boardTokensByCell.delete(key)
    //         }

    //         placed.push({
    //             token,
    //             tx,
    //             ty,
    //             fromLocal: token.mesh.position.clone(),
    //             toLocal: this.boardGrid3d.cellLocalPosition({ tx, ty }, TOKEN_SIZE.z),
    //         })
    //     }

    //     return { placed, overwritten }
    // }

    finalizeStampPlacement(placed: StampPlacement['placed']) {
        for (const item of placed) {
            item.token.mesh.position.copy(item.toLocal)
            item.token.mesh.userData = { type: 'board', pos: { tx: item.tx, ty: item.ty } }
            item.token.setLocation('board')
        }
    }


    pieceRestZone(): THREE.Vector3 {
        return this.pieceGrid3d.restPosition
    }

    nextPiecePickupWorldPos(): THREE.Vector3 {
        return new THREE.Vector3(
            this.mat3D.position.x,
            this.mat3D.position.y + TOKEN_SIZE.z,
            this.mat3D.position.z
        )
    }

    currentPieceMatWorldPos(piece: IPiece): THREE.Vector3 | null {
        return this.mat3D.getPieceCenter(piece)
    }

    pickupCurrentPiece(): MatPiece | null {
        const piece = currentPiece(this.#gameState)
        if (!piece) return null
        const detached = this.mat3D.detachPiece(piece)
        if (!detached) return null
        this.pieceGrid3d.attachPiece(detached)
        return detached
    }

    setPieceGridVisible(visible: boolean) {
        this.pieceGrid3d.setVisible(visible)
    }

    pieceGridWorldPosition(): THREE.Vector3 {
        if (this.pieceGridLockWorldPos) return this.pieceGridLockWorldPos.clone()
        return this.pieceGrid3d.position.clone()
    }

    pieceGridWorldZ(): number {
        return this.pieceGridWorldPosition().z
    }

    lockPieceGridWorldPosition(worldPos: THREE.Vector3Like) {
        if (!this.pieceGridLockWorldPos) this.pieceGridLockWorldPos = new THREE.Vector3()
        this.pieceGridLockWorldPos.set(worldPos.x, worldPos.y, worldPos.z)
        this.pieceGridCurrentWorldPos.copy(this.pieceGridLockWorldPos)
        this.pieceGrid3d.setPosition(this.pieceGridLockWorldPos.clone())
    }

    lockPieceGridWorldZ(worldZ: number) {
        const current = this.pieceGridWorldPosition()
        this.lockPieceGridWorldPosition({ x: current.x, y: current.y, z: worldZ })
    }

    releasePieceGridWorldLock() {
        if (!this.pieceGridLockWorldPos) return
        const current = this.pieceGridLockWorldPos.clone()
        this.pieceGridLockWorldPos = null
        this.pieceGridVelocity.set(0, 0, 0)
        this.pieceGridCurrentWorldPos.copy(current)
        //this.pieceGridLocalOffset.copy(current).sub(this.piece3d.group.position)
        this.pieceGrid3d.setPosition(current)
    }

    unlockPieceGridWorldZ() {
        this.pieceGridLockWorldPos = null
        this.pieceGridMotionActive = false
        this.pieceGridVelocity.set(0, 0, 0)
        this.pieceGridLocalOffset.set(0, 0, 0)
        // this.pieceGridCurrentWorldPos.copy(this.piece3d.group.position)
        // this.pieceGrid3d.setPosition(this.piece3d.group.position.clone())
    }

    syncPieceGridDepthLock() {
        if (!this.pieceGridLockWorldPos) return
        this.pieceGrid3d.setPosition(this.pieceGridLockWorldPos.clone())
    }

    setPieceGridDestinationPosition(worldPos: THREE.Vector3Like) {
        this.pieceGridTargetWorldPos.set(worldPos.x, worldPos.y, worldPos.z)
        this.pieceGridCurrentWorldPos.copy(this.pieceGridWorldPosition())
        this.pieceGridMotionActive = true
    }

    updatePieceGridMotion(dt: number) {
        if (this.pieceGridLockWorldPos) {
            this.pieceGridCurrentWorldPos.copy(this.pieceGridLockWorldPos)
            this.pieceGrid3d.setPosition(this.pieceGridLockWorldPos.clone())
            return
        }

        if (!this.pieceGridMotionActive) {
            //const world = this.piece3d.group.position.clone().add(this.pieceGridLocalOffset)
            //this.pieceGridCurrentWorldPos.copy(world)
            //this.pieceGrid3d.setPosition(world)
            return
        }

        const toTarget = new THREE.Vector3().subVectors(this.pieceGridTargetWorldPos, this.pieceGridCurrentWorldPos)
        const distance = toTarget.length()
        if (distance < 1e-4) {
            this.pieceGridCurrentWorldPos.copy(this.pieceGridTargetWorldPos)
            this.pieceGridVelocity.set(0, 0, 0)
            this.pieceGridMotionActive = false
        } else {
            const desiredVelocity = toTarget.clone().multiplyScalar(GRID_POSITION_GAIN)
            const velocityDelta = desiredVelocity.sub(this.pieceGridVelocity)
            const maxDv = GRID_MAX_ACCELERATION * dt
            if (velocityDelta.lengthSq() > maxDv * maxDv) {
                velocityDelta.setLength(maxDv)
            }
            this.pieceGridVelocity.add(velocityDelta)
            this.pieceGridVelocity.multiplyScalar(Math.exp(-GRID_LINEAR_DAMPING * dt))
            this.pieceGridCurrentWorldPos.addScaledVector(this.pieceGridVelocity, dt)
        }

        //this.pieceGridLocalOffset.copy(this.pieceGridCurrentWorldPos).sub(this.piece3d.group.position)
        this.pieceGrid3d.setPosition(this.pieceGridCurrentWorldPos.clone())
    }

    private _onResize = () => {
        const container = this.renderer.domElement.parentElement
        if (!container) return
        this._applyScreenLayout(container.clientWidth, container.clientHeight)
        this.camera.aspect = container.clientWidth / container.clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(container.clientWidth, container.clientHeight)
    }

    private _applyScreenLayout(width: number, height: number, immediate = false) {
        this.layout.compute(width, height, this.settings)
        this.layout.applyScene(this.layout.state, {
            boardGrid3d: this.boardGrid3d,
            pieceGrid3d: this.pieceGrid3d,
            stack3d: this.mat3D,
            scoreHud: this.scoreHud,
        }, immediate, this.#boardZ)
        this.dragPlane.constant = -(this.#boardZ + TOKEN_SIZE.z)
        this.controls.target.z = this.#boardZ

        // if (!this.isDraggingCross && !this.animations.animation && this.piece3d.group.visible) {
        //     this.piece3d.setDestinationPosition({ x: this.layoutState.crossCenter.x, y: this.layoutState.crossCenter.y, z: TOKEN_SIZE.z })
        // }
    }


    private _renderLoop = () => {
        const now = performance.now()
        let dt = Math.min(0.033, (now - this.previousTime) / 1000)
        if (dt > 0.2) dt = 0.2;
        this.previousTime = now
        const timelineDt = dt

        dt *= ANIMATION_MULTIPLIER;

        // this.board3d.tick(dt)
        this.rapierWorld?.step(dt)
        this.animations.tickTokenFreeFall(dt)
        this.scoreHud.tick(dt)
        // this.animations.animation?.animate(dt)

        const canAnimateLayout = !this.isDraggingCross
            && !this.animations.animation
        // && !this.board3d.isOverwriteFallActive()
        // && !this.board3d.isPushBackActive()
        // && !this.board3d.isSegmentClearActive()

        if (canAnimateLayout) {
            //this.board3d.update(dt)
            this.boardGrid3d.update(dt)
            this.pieceGrid3d.update(dt)
            this.mat3D.update(dt)
            this.scoreHud.update(dt)
        }
        //this._updateFallingBoardTokens(dt)

        this.rapierWorld?.updateMatColliderPosition(
            this.mat3D.position.x,
            this.mat3D.position.y - MAT_SIZE.y / 2,
            this.mat3D.position.z
        )

        // if (!this.isDraggingCross && !this.animations.animation && this.piece3d.group.visible) {
        //     this.piece3d.update(dt)
        // } else {
        //     this.piece3d.snapTo(this.piece3d.group.position)
        // }
        this.updatePieceGridMotion(dt)
        this.camera.position.z = this.layout.state.cameraZ + this.#boardZ
        this.controls.update()


        this.animations.tick(timelineDt)

        this.renderer.render(this.#threeScene, this.camera)
        this.animationFrameId = requestAnimationFrame(this._renderLoop)
    }

    getRoundResultForAnimation(targetPos: IPosition): RoundResult | null {
        const piece = currentPiece(this.#gameState)
        if (!piece) return null
        return calcRoundResult(this.#gameState.total, this.#gameState.board, piece, targetPos)
    }


    dispose() {
        cancelAnimationFrame(this.animationFrameId)
        window.removeEventListener('resize', this._onResize)
        this.renderer.domElement.removeEventListener('pointerdown', this._onPointerDown)
        this.renderer.domElement.removeEventListener('pointermove', this._onPointerMove)
        this.renderer.domElement.removeEventListener('pointerup', this._onPointerUp)
        this.renderer.domElement.removeEventListener('pointercancel', this._onPointerCancel)
        this.scoreHud.dispose()
        this.animations.clearDebris()
        // this.board3d.dispose()
        // this.piece3d.dispose()
        this.boardGrid3d.dispose()
        this.pieceGrid3d.dispose()
        this.mat3D.dispose()
        this.sfx.dispose()
        if (this.rapierWorld) this.rapierWorld.dispose()
        this.controls.dispose()
        for (const d of this.disposables) d.dispose()
        this.pmremGenerator.dispose()
        this.envTexture.dispose()
        this.renderer.dispose()
        const canvas = this.renderer.domElement
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }

    playSound(sound: Sound) {
        this.sfx.play(sound)
    }

    dump() {
        console.log('--- Scene3D Dump ---');
        console.log('GameState:', this.#gameState);

    }



}
