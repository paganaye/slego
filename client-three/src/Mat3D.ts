import * as THREE from 'three'
import { TOKEN_SIZE, Token } from './Token'
import { pieceTokens } from './Game'
import type { GameState, IPiece } from './Game'
import { MotionObject } from './MotionObject'
import { GRID_CELL_DIST } from './GridMetrics'
import { MatPiece, pieceSlotFromTile } from './MatPiece'
import type { Scene3D } from './Scene3D'

export const DRAW_PILE_TOTAL = 39

export const DRAW_PILE_COLUMNS = 5
export const DRAW_PILE_ROWS = Math.ceil(DRAW_PILE_TOTAL / DRAW_PILE_COLUMNS)

export const DRAW_PILE_PIECE_SIZE = 3 // cross piece is ~2 units wide/tall
export const DRAW_PILE_PIECE_GAP = 0.5

export const DRAW_PILE_CELL_X = DRAW_PILE_PIECE_SIZE + DRAW_PILE_PIECE_GAP
export const DRAW_PILE_CELL_Z = DRAW_PILE_PIECE_SIZE + DRAW_PILE_PIECE_GAP


export const DRAW_PILE_SIZE = {
    x: ((DRAW_PILE_COLUMNS - 1) * DRAW_PILE_CELL_X + DRAW_PILE_PIECE_SIZE),
    y: 0.25,
    z: ((DRAW_PILE_ROWS - 1) * DRAW_PILE_CELL_Z + DRAW_PILE_PIECE_SIZE),
}

export const DRAW_PILE_CENTER = { x: 0, z: - DRAW_PILE_SIZE.z / 2 }

export const MAT_COLOR = 0x1e5b3d
const MAT_MARGIN = 1

export const MAT_POS = { x: DRAW_PILE_CENTER.x, y: -3, z: DRAW_PILE_CENTER.z }
export const MAT_SIZE = {
    x: DRAW_PILE_SIZE.x + MAT_MARGIN * 2,
    y: DRAW_PILE_SIZE.y,
    z: DRAW_PILE_SIZE.z + MAT_MARGIN * 2,
}

export class Mat3D extends MotionObject {
    readonly matPieces: MatPiece[] = []
    private visibleTokens = new Set<Token>()
    readonly group: THREE.Group
    private floor: THREE.Mesh | null = null

    constructor(
        scene3D: Scene3D,
        private threeScene: THREE.Scene,
        private disposables: Array<THREE.BufferGeometry | THREE.Material>,
    ) {
        super(scene3D, {})
        this.group = new THREE.Group()
        this.threeScene.add(this.group)
        this._addFloor()
        this.snapTo({ x: DRAW_PILE_CENTER.x, y: MAT_POS.y, z: DRAW_PILE_CENTER.z })
    }

    protected override _onPositionChanged() {
        this.group.position.copy(this.position)
    }

    onStateUpdated(_state: GameState) {
    }

    createTokens(state: GameState) {
        const nextVisibleTokens = new Set<Token>()
        this.matPieces.length = 0

        const firstVisible = state.roundIndex
        const remaining = state.game.totalRounds - firstVisible
        const count = Math.max(0, Math.min(remaining, DRAW_PILE_TOTAL))

        const scene3D = this.scene as Scene3D;
        for (let i = 0; i < count; i++) {
            const pieceIndex = firstVisible + i
            const piece = state.game.getPiece(pieceIndex)
            if (!piece) break

            const slot = DRAW_PILE_TOTAL - 1 - (pieceIndex % DRAW_PILE_TOTAL)
            const col = slot % DRAW_PILE_COLUMNS
            const row = Math.floor(slot / DRAW_PILE_COLUMNS)
            const tokensBySlot: Partial<Record<string, Token>> = {}
            for (const tile of pieceTokens(piece)) {
                const slotKey = pieceSlotFromTile(tile)
                let token = tokensBySlot[slotKey]
                if (!token) {
                    token = new Token(tile.token.symbol, this.disposables, { piece, tile })
                    tokensBySlot[slotKey] = token
                    // Register in global tokenById
                    scene3D.tokenById[tile.token.tokenId] = token
                } else {
                    token.bindOrigin(piece, tile)
                }

                token.setLocation('mat-unplayed')
                token.attachTo(this.group)
                nextVisibleTokens.add(token)
            }

            this.matPieces.push(new MatPiece(pieceIndex, piece, col, row, tokensBySlot))
        }

        for (const token of this.visibleTokens) {
            if (!nextVisibleTokens.has(token) && token.mesh.parent) {
                token.mesh.parent.remove(token.mesh)
            }
        }
        this.visibleTokens = nextVisibleTokens
        for (const matPiece of this.matPieces) {
            const center = this._pieceCenterLocal(matPiece)
            for (const tile of pieceTokens(matPiece.piece)) {
                const token = matPiece.tokensBySlot[pieceSlotFromTile(tile)]
                if (!token) continue
                token.mesh.rotation.set(-Math.PI / 2, 0, 0)
                token.setLocalPosition(
                    center.x + tile.dx * GRID_CELL_DIST.x,
                    center.y,
                    center.z + tile.dy * GRID_CELL_DIST.y,
                )
            }
        }

    }

    dispose() {
        for (const token of this.visibleTokens) {
            if (token.mesh.parent) token.mesh.parent.remove(token.mesh)
        }
        this.visibleTokens.clear()
        this.matPieces.length = 0
        if (this.floor) this.floor = null
        this.threeScene.remove(this.group)
    }

    getPieceCenter(piece: IPiece): THREE.Vector3 | null {
        const matPiece = this.matPieces.find((it) => it.piece === piece)
        if (!matPiece) return null
        const centerLocal = this._pieceCenterLocal(matPiece)
        return this.group.localToWorld(centerLocal)
    }

    detachPiece(piece: IPiece): MatPiece | null {
        const idx = this.matPieces.findIndex(mp => mp.piece === piece)
        if (idx === -1) return null
        const removed = this.matPieces.splice(idx, 1)[0]!
        for (const token of Object.values(removed.tokensBySlot)) {
            if (token) this.visibleTokens.delete(token)
        }
        return removed
    }

    private _addFloor() {
        const geo = new THREE.BoxGeometry(MAT_SIZE.x, MAT_SIZE.y, MAT_SIZE.z)
        const mat = new THREE.MeshPhysicalMaterial({
            color: MAT_COLOR,
            roughness: 0.9,
            metalness: 0.02,
            clearcoat: 0.08,
            clearcoatRoughness: 0.65,
        })
        const floor = new THREE.Mesh(geo, mat)
        floor.position.set(0, -MAT_SIZE.y / 2, 0)
        this.group.add(floor)
        this.disposables.push(geo, mat)
        this.floor = floor
    }

    private _pieceCenterLocal(matPiece: MatPiece): THREE.Vector3 {
        const xOffset = (matPiece.col - (DRAW_PILE_COLUMNS - 1) / 2) * DRAW_PILE_CELL_X
        const zOffset = (matPiece.row - (DRAW_PILE_ROWS - 1) / 2) * DRAW_PILE_CELL_Z
        return new THREE.Vector3(xOffset, TOKEN_SIZE.z * 0.5, zOffset)
    }

}

