import * as THREE from 'three'
import { TOKEN_SIZE } from './Token'
import { GRID_CELL_DIST, GRID_MARGIN, GRID_OFFSET_Y, INNER_WALL_THICKNESS } from './GridMetrics'
import { MotionObject } from './MotionObject'
import type { MatPiece } from './MatPiece'
import type { Scene3D } from './Scene3D'

const CAVITY_DEPTH = TOKEN_SIZE.z

const GRID_COLOR = 0xb7bcc4

type CrossOffset = { dx: number; dy: number }

const DEFAULT_OFFSETS: ReadonlyArray<CrossOffset> = [
    { dx: 0, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
]

const DEBUG_CROSS = false;

export class PieceGrid3D extends MotionObject {
    private group: THREE.Group
    private meshes: THREE.Mesh[] = []
    private parent: THREE.Object3D
    #restPosition = new THREE.Vector3()

    constructor(
        scene3D: Scene3D,
        parent: THREE.Object3D,
        private disposables: Array<THREE.BufferGeometry | THREE.Material>,
        private offsets: ReadonlyArray<CrossOffset> = DEFAULT_OFFSETS,
        private origin: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
    ) {
        super(scene3D, {
        })
        this.parent = parent
        this.group = new THREE.Group()
        this.parent.add(this.group)
        this.create()
        this.#restPosition.copy(this.origin)
        this.snapTo(this.origin)
        if (DEBUG_CROSS) {
            const axesHelper = new THREE.AxesHelper(1);
            this.group.add(axesHelper);
        }
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
            depthWrite: true,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
        })
        this.disposables.push(material)

        // Use the same span logic as BoardGrid3D for perfect alignment
        // const longSpan = GRID_CELL_DIST.y * 3 - INNER_WALL_THICKNESS + OUTER_WALL_THICKNESS * 2;
        // const shortSpan = GRID_CELL_DIST.y - INNER_WALL_THICKNESS + OUTER_WALL_THICKNESS * 2;

        const longSpan = {
            x: 3 * (TOKEN_SIZE.x + GRID_MARGIN.x) + 4 * INNER_WALL_THICKNESS,
            y: 3 * (TOKEN_SIZE.y + GRID_MARGIN.y) + 4 * INNER_WALL_THICKNESS
        }
        const shortSpan = {
            x: 1 * (TOKEN_SIZE.x + GRID_MARGIN.x) + 2 * INNER_WALL_THICKNESS,
            y: 1 * (TOKEN_SIZE.y + GRID_MARGIN.y) + 2 * INNER_WALL_THICKNESS
        }


        const verticalLongGeo = new THREE.BoxGeometry(INNER_WALL_THICKNESS, longSpan.y, CAVITY_DEPTH);
        const verticalShortGeo = new THREE.BoxGeometry(INNER_WALL_THICKNESS, shortSpan.y, CAVITY_DEPTH);
        const horizontalLongGeo = new THREE.BoxGeometry(longSpan.x, INNER_WALL_THICKNESS, CAVITY_DEPTH);
        const horizontalShortGeo = new THREE.BoxGeometry(shortSpan.x, INNER_WALL_THICKNESS, CAVITY_DEPTH);
        this.disposables.push(verticalLongGeo, verticalShortGeo, horizontalLongGeo, horizontalShortGeo);

        const verticalX = [-1.5, -0.5, 0.5, 1.5]
        const horizontalY = [-1.5, -0.5, 0.5, 1.5]

        for (let i = 0; i < verticalX.length; i++) {
            const isOuter = i === 0 || i === verticalX.length - 1;
            const geo = isOuter ? verticalShortGeo : verticalLongGeo;
            const bar = new THREE.Mesh(geo, material);
            bar.position.set(verticalX[i] * GRID_CELL_DIST.x, GRID_OFFSET_Y, 0);
            bar.renderOrder = 2;
            this.meshes.push(bar);
            this.group.add(bar);
        }

        for (let i = 0; i < horizontalY.length; i++) {
            const isOuter = i === 0 || i === horizontalY.length - 1;
            const geo = isOuter ? horizontalShortGeo : horizontalLongGeo;
            const bar = new THREE.Mesh(geo, material);
            bar.position.set(0, horizontalY[i] * GRID_CELL_DIST.y + GRID_OFFSET_Y, 0);
            bar.renderOrder = 3;
            this.meshes.push(bar);
            this.group.add(bar);
        }

        // Keep parameter intentionally: allows future custom cross layouts.
        void this.offsets
    }

    protected override _onPositionChanged() {
        this.group.position.copy(this.position)
        this.group.quaternion.copy(this.orientation)
    }

    setPosition(pos: THREE.Vector3Like) {
        this.snapTo(pos)
    }

    setRestPosition(pos: THREE.Vector3Like) {
        this.#restPosition.set(pos.x, pos.y, pos.z)
    }

    get restPosition() {
        return this.#restPosition.clone()
    }

    get rotX() { return this.group.rotation.x }
    get rotZ() { return this.group.rotation.z }

    setRotation(rotX: number, rotZ: number) {
        this.group.rotation.x = rotX
        this.group.rotation.z = rotZ
        this.orientation.copy(this.group.quaternion)
        this.destinationOrientation.copy(this.group.quaternion)
        this.angularVelocity.set(0, 0, 0)
    }

    attachPiece(piece: MatPiece) {
        for (const token of Object.values(piece.tokensBySlot)) {
            if (!token) continue
            this.group.attach(token.mesh)
        }
    }

    setVisible(visible: boolean) {
        this.group.visible = visible
    }

    containsObject(object: THREE.Object3D | null): boolean {
        let current: THREE.Object3D | null = object
        while (current) {
            if (current === this.group) return true
            current = current.parent
        }
        return false
    }

    setOpacity(opacity: number) {
        this.group.traverse((obj) => {
            const mesh = obj as THREE.Mesh
            if (!mesh.material) return
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            for (const mat of materials) {
                const material = mat as THREE.Material & { opacity?: number; transparent?: boolean }
                if (typeof material.opacity !== 'number') continue
                if (material.transparent !== true) {
                    material.transparent = true
                    material.needsUpdate = true
                }
                material.opacity = opacity
                material.needsUpdate = true
            }
        })
    }

    dispose() {
        this.parent.remove(this.group)
        this.meshes = []
    }
}