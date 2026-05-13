import { MotionObject } from './MotionObject'
import type { Scene3D } from './Scene3D'

const DEFAULT_CROSS_ZONE = { x: 3.7, y: 0, z: 0 }
//const CELL_DIST = 1

// const CROSS_OFFSETS = [
//     { dx: 0, dy: 0 },
//     { dx: 0, dy: 1 },
//     { dx: 0, dy: -1 },
//     { dx: -1, dy: 0 },
//     { dx: 1, dy: 0 },
// ]

export class PieceZone3D extends MotionObject {
    //private slot!: Slot3D

    constructor(
        scene: Scene3D,
        // disposables: Array<THREE.BufferGeometry | THREE.Material>,
    ) {
        super(scene)
        this.snapTo(DEFAULT_CROSS_ZONE)
        //this.slot = new Slot3D(scene.threeScene, disposables, this._slotPositions())
    }

    protected override _onPositionChanged() {
        // if (!this.slot) return
        // this.slot.setPositions(this._slotPositions())
    }

    dispose() {
        //this.slot.dispose()
    }

    // private _slotPositions() {
    //     return CROSS_OFFSETS.map(({ dx, dy }) => ({
    //         x: this.position.x + dx * CELL_DIST,
    //         y: this.position.y + dy * CELL_DIST,
    //         z: this.position.z,
    //     }))
    // }
}
