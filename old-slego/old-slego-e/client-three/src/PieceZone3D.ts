import { Slot3D } from './Slot3D'
import * as THREE from 'three'
import { TOKEN_SIZE } from './Token'

// Must match CROSS_ZONE and CELL_DIST in Piece3D.ts
const CROSS_ZONE = { x: 3.7, y: 0, z: 0 }
const CELL_DIST = 1

// All 5 possible tile positions of a piece (center + 4 arms)
const CROSS_OFFSETS = [
    { dx: 0, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
]

export class PieceZone3D {
    private slot: Slot3D

    constructor(
        scene: THREE.Scene,
        disposables: Array<THREE.BufferGeometry | THREE.Material>
    ) {
        this.slot = new Slot3D(scene, disposables, CROSS_OFFSETS.map(({ dx, dy }) => ({
            x: CROSS_ZONE.x + dx * CELL_DIST,
            y: CROSS_ZONE.y + dy * CELL_DIST,
            z: CROSS_ZONE.z - TOKEN_SIZE.z * 0.5 - 0.01,
        })))
    }

    dispose() {
        this.slot.dispose()
    }
}
