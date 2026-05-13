import * as THREE from 'three'
import type { IPosition } from './Game'
import { TOKEN_SIZE } from './Token'
import { GRID_CELL_DIST, GRID_MARGIN, GRID_OFFSET_Y, INNER_WALL_THICKNESS, OUTER_WALL_THICKNESS } from './GridMetrics'
import { MotionObject } from './MotionObject'
import type { Scene3D } from './Scene3D'


const GRID_COLOR = 0xb7bcc4
const CAVITY_DEPTH = TOKEN_SIZE.z

export class BoardGrid3D extends MotionObject {
    readonly group: THREE.Group
    private meshes: THREE.Mesh[] = []
    readonly boardWidth: number
    readonly boardHeight: number
    readonly boardDepth: number = TOKEN_SIZE.z

    constructor(
        scene3D: Scene3D,
        private threeScene: THREE.Object3D,
        private disposables: Array<THREE.BufferGeometry | THREE.Material>,
        private gridWidth: number = 5,
        private gridHeight: number = 5,
        private boardOrigin: THREE.Vector3 = new THREE.Vector3(-2.5, 0, 0)
    ) {
        super(scene3D, {})
        this.group = new THREE.Group()
        this.threeScene.add(this.group)

        // Calculate board dimensions
        this.boardWidth =
            this.gridWidth * (TOKEN_SIZE.x + GRID_MARGIN.x)
            + (this.gridWidth - 1) * INNER_WALL_THICKNESS
            + OUTER_WALL_THICKNESS * 2
        this.boardHeight =
            this.gridHeight * (TOKEN_SIZE.y + GRID_MARGIN.y)
            + (this.gridHeight - 1) * INNER_WALL_THICKNESS
            + OUTER_WALL_THICKNESS * 2

        this.create()
        this.snapTo(this.boardOrigin)
    }

    private create() {
        const material = new THREE.MeshPhysicalMaterial({
            color: GRID_COLOR,
            roughness: 0.14,
            metalness: 0.88,
            clearcoat: 1,
            clearcoatRoughness: 0.05,
            reflectivity: 1,
            side: THREE.FrontSide,
        })
        this.disposables.push(material)

        const barDepth = CAVITY_DEPTH

        const verticalInnerGeo = new THREE.BoxGeometry(INNER_WALL_THICKNESS, this.boardHeight, barDepth)
        const horizontalInnerGeo = new THREE.BoxGeometry(this.boardWidth, INNER_WALL_THICKNESS, barDepth)
        const verticalOuterGeo = new THREE.BoxGeometry(OUTER_WALL_THICKNESS, this.boardHeight, barDepth)
        const horizontalOuterGeo = new THREE.BoxGeometry(this.boardWidth, OUTER_WALL_THICKNESS, barDepth)
        this.disposables.push(verticalInnerGeo, horizontalInnerGeo, verticalOuterGeo, horizontalOuterGeo)

        const xOffset = this.gridWidth / 2
        const yOffset = this.gridHeight / 2

        const outerDelta = (OUTER_WALL_THICKNESS - INNER_WALL_THICKNESS) / 2


        for (let ix = -xOffset; ix <= xOffset; ix++) {
            const isOuter = ix === -xOffset || ix === xOffset
            const bar = new THREE.Mesh(isOuter ? verticalOuterGeo : verticalInnerGeo, material)
            let x = ix * GRID_CELL_DIST.x
            if (ix == -xOffset) x -= outerDelta;
            if (ix == xOffset) x += outerDelta;
            bar.position.set(x, GRID_OFFSET_Y, 0)
            this.meshes.push(bar)
            this.group.add(bar)
        }

        for (let iy = -yOffset; iy <= yOffset; iy++) {
            const isOuter = iy === -yOffset || iy === yOffset
            const bar = new THREE.Mesh(isOuter ? horizontalOuterGeo : horizontalInnerGeo, material)
            let y = iy * GRID_CELL_DIST.y;
            if (iy == -xOffset) y -= outerDelta;
            if (iy == xOffset) y += outerDelta;
            bar.position.set(0, y + GRID_OFFSET_Y, 0.0)
            this.meshes.push(bar)
            this.group.add(bar)
        }
    }

    protected override _onPositionChanged() {
        this.group.position.copy(this.position)
    }

    setPosition(pos: THREE.Vector3Like) {
        this.snapTo(pos)
    }

    attachObjectKeepWorld(object: THREE.Object3D) {
        this.group.attach(object)
    }

    cellLocalPosition(pos: IPosition, z: number = TOKEN_SIZE.z): THREE.Vector3 {
        return new THREE.Vector3(
            (pos.tx - 2) * GRID_CELL_DIST.x,
            (2 - pos.ty) * GRID_CELL_DIST.y,
            z,
        )
    }


    dispose() {
        this.threeScene.remove(this.group)
        this.meshes = []
    }
}
