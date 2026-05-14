import * as THREE from 'three'
import { TOKEN_SIZE } from './Token'
import { Piece3D } from './Piece3D'
import type { GameState } from './Game'
import type { StackData } from './MeshUserData'

const STACK_X = 7.0
const STACK_Z = 0
const STACK_Y_BASE = 0
const STACK_Y_STEP = TOKEN_SIZE.z + 0.005
const STACK_TOTAL = 39

export class Stack3D {
    private pieces: Piece3D[] = []

    constructor(
        private scene: THREE.Scene,
        private disposables: Array<THREE.BufferGeometry | THREE.Material>
    ) {}

    build(state: GameState) {
        for (const p of this.pieces) p.dispose()
        this.pieces = []

        const firstFuture = state.roundIndex + 1
        const remaining = state.game.totalRounds - firstFuture
        const count = Math.max(0, Math.min(remaining, STACK_TOTAL))
        let tokenY = STACK_Y_BASE

        for (let i = 0; i < count; i++) {
            const piece = state.game.getPiece(firstFuture + i)
            if (!piece) break

            const piece3d = new Piece3D(this.scene, this.disposables)
            piece3d.buildAt(piece, STACK_X, tokenY, STACK_Z, () => ({
                type: 'stack',
                pieceIndex: firstFuture + i,
                piece,
            } as StackData))
            // Lay flat face-down, slight random tilt
            piece3d.group.rotation.x = Math.PI / 2
            piece3d.group.rotation.z = (Math.random() - 0.5) * 0.08
            this.pieces.push(piece3d)

            tokenY += STACK_Y_STEP
        }
    }

    dispose() {
        for (const p of this.pieces) p.dispose()
        this.pieces = []
    }
}

