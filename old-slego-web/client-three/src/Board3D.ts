import * as THREE from 'three'
import { createToken } from './Token'
import { Slot3D } from './Slot3D'
import type { GameState, Position, TokenSymbol } from './Game'
import type { BoardCellData } from './MeshUserData'

const BOARD_POS = { x: -2.5, y: 0, z: 0 }
const CELL_DIST = 1
const GRAVITY_ACC = 22
const MAX_FALL_SPEED = 14
const PUSH_BACK_DURATION_DEFAULT = 0.25
const PUSH_BACK_DISTANCE_DEFAULT = 1.2

interface TokenNode {
    mesh: THREE.Mesh
    logo: TokenSymbol
    gx: number
    gy: number
    vy: number
    targetY: number
    falling: boolean
}

interface PushBackAnim {
    node: TokenNode
    elapsed: number
    duration: number
    fromY: number
    toY: number
}

export class Board3D {
    private nodes: TokenNode[] = []
    private slots: Slot3D
    private pushBackAnims: PushBackAnim[] = []

    constructor(
        private scene: THREE.Scene,
        private disposables: Array<THREE.BufferGeometry | THREE.Material>
    ) {
        this.slots = new Slot3D(scene, disposables)
    }

    build(state: GameState) {
        for (const node of this.nodes) this.scene.remove(node.mesh)
        this.nodes = []
        this.pushBackAnims = []

        const grid = state.board.getGrid()
        for (let gy = 0; gy < 5; gy++) {
            for (let gx = 0; gx < 5; gx++) {
                const logo = grid[gy]![gx]!
                if (!logo) continue
                const mesh = createToken(logo, this.disposables)
                const targetY = (2 - gy) * CELL_DIST
                mesh.position.set(
                    BOARD_POS.x + (gx - 2) * CELL_DIST,
                    targetY + 2.8 + Math.random() * 1.25,
                    0
                )
                const boardData: BoardCellData = { type: 'board', pos: { tx: gx, ty: gy } }
                mesh.userData = boardData
                this.nodes.push({ mesh, logo, gx, gy, vy: 0, targetY, falling: true })
                this.scene.add(mesh)
            }
        }
    }

    tick(dt: number) {
        for (const node of this.nodes) {
            if (!node.falling) continue
            node.vy = Math.max(-MAX_FALL_SPEED, node.vy - GRAVITY_ACC * dt)
            node.mesh.position.y += node.vy * dt
            if (node.mesh.position.y <= node.targetY) {
                node.mesh.position.y = node.targetY
                node.vy = 0
                node.falling = false
            }
        }

        if (this.pushBackAnims.length === 0) return
        const remaining: PushBackAnim[] = []
        for (const anim of this.pushBackAnims) {
            anim.elapsed = Math.min(anim.duration, anim.elapsed + dt)
            const t = anim.elapsed / anim.duration
            const eased = 1 - Math.pow(1 - t, 3)
            anim.node.mesh.position.y = anim.fromY + (anim.toY - anim.fromY) * eased
            if (t < 1) remaining.push(anim)
            else {
                anim.node.falling = true
                anim.node.vy = 0
            }
        }
        this.pushBackAnims = remaining
    }

    startPushBack(
        cells: readonly Position[],
        duration: number = PUSH_BACK_DURATION_DEFAULT,
        distance: number = PUSH_BACK_DISTANCE_DEFAULT
    ): boolean {
        this.pushBackAnims = []
        for (const cell of cells) {
            const node = this.nodes.find((n) => n.gx === cell.tx && n.gy === cell.ty)
            if (!node) continue
            this.pushBackAnims.push({
                node,
                elapsed: 0,
                duration,
                fromY: node.mesh.position.y,
                toY: node.mesh.position.y + distance,
            })
        }
        return this.pushBackAnims.length > 0
    }

    transitionToFall() {
        for (const anim of this.pushBackAnims) {
            anim.node.falling = true
            anim.node.vy = 0
        }
    }

    isPushBackActive(): boolean {
        return this.pushBackAnims.length > 0
    }

    dispose() {
        for (const node of this.nodes) this.scene.remove(node.mesh)
        this.nodes = []
        this.pushBackAnims = []
        this.slots.dispose()
    }
}

