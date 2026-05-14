import * as THREE from 'three'
import { TOKEN_SIZE, TOKEN_RADIUS } from './Token'
import type { BoardCellData, MeshUserData } from './MeshUserData'

const BOARD_POS = { x: -2.5, y: 0, z: 0 }
const CELL_DIST = 1
const SLOT_DEPTH = TOKEN_SIZE.z * 0.5 + 0.2
const SLOT_SIZE = 0.98
const SLOT_COLOR = 0x1a2a1a

export type SlotPosition = { x: number; y: number; z: number; userData?: MeshUserData }

function boardPositions(): SlotPosition[] {
    const positions: SlotPosition[] = []
    for (let gy = 0; gy < 5; gy++) {
        for (let gx = 0; gx < 5; gx++) {
            const boardData: BoardCellData = { type: 'board', pos: { tx: gx, ty: gy } }
            positions.push({
                x: BOARD_POS.x + (gx - 2) * CELL_DIST,
                y: (2 - gy) * CELL_DIST,
                z: -SLOT_DEPTH,
                userData: boardData,
            })
        }
    }
    return positions
}


function roundedRectShape(w: number, h: number, r: number): THREE.Shape {
    const shape = new THREE.Shape()
    const hw = w / 2, hh = h / 2
    shape.moveTo(-hw + r, -hh)
    shape.lineTo(hw - r, -hh)
    shape.quadraticCurveTo(hw, -hh, hw, -hh + r)
    shape.lineTo(hw, hh - r)
    shape.quadraticCurveTo(hw, hh, hw - r, hh)
    shape.lineTo(-hw + r, hh)
    shape.quadraticCurveTo(-hw, hh, -hw, hh - r)
    shape.lineTo(-hw, -hh + r)
    shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh)
    return shape
}

export class Slot3D {
    private meshes: THREE.Mesh[] = []

    constructor(
        private scene: THREE.Scene,
        private disposables: Array<THREE.BufferGeometry | THREE.Material>,
        positions: SlotPosition[] = boardPositions()
    ) {
        const SLOT_DEPTH_GEO = 0.04
        const shape = roundedRectShape(SLOT_SIZE, SLOT_SIZE, TOKEN_RADIUS)
        const geo = new THREE.ExtrudeGeometry(shape, { depth: SLOT_DEPTH_GEO, bevelEnabled: false })
        geo.translate(0, 0, -SLOT_DEPTH_GEO / 2)
        const mat = new THREE.MeshPhysicalMaterial({
            color: SLOT_COLOR,
            roughness: 0.85,
            metalness: 0.05,
            clearcoat: 0.2,
        })
        this.disposables.push(geo, mat)

        for (const pos of positions) {
            const mesh = new THREE.Mesh(geo, mat)
            mesh.position.set(pos.x, pos.y, pos.z)
            mesh.userData = pos.userData ?? {}
            this.meshes.push(mesh)
            this.scene.add(mesh)
        }
    }

    dispose() {
        for (const mesh of this.meshes) this.scene.remove(mesh)
        this.meshes = []
    }
}

