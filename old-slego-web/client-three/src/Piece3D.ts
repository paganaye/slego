import * as THREE from 'three'
import { createToken } from './Token'
import { pieceTiles, currentPiece } from './Game'
import type { GameState, Piece, Tile, TokenSymbol } from './Game'
import type { MeshUserData, PieceTileData } from './MeshUserData'

const CROSS_ZONE = { x: 3.7, y: 0, z: 0 }
const CELL_DIST = 1

interface TokenNode {
    mesh: THREE.Mesh
    logo: TokenSymbol
}

export class Piece3D {
    readonly group: THREE.Group
    private nodes: TokenNode[] = []

    constructor(
        private scene: THREE.Scene,
        private disposables: Array<THREE.BufferGeometry | THREE.Material>
    ) {
        this.group = new THREE.Group()
        this.scene.add(this.group)
    }

    /** Build the piece tiles inside the group, centered at (cx, cy, cz) */
    buildAt(
        piece: Piece,
        cx: number,
        cy: number,
        cz: number,
        userDataForTile?: (tile: Tile, tileIndex: number) => MeshUserData | undefined
    ) {
        for (const node of this.nodes) this.group.remove(node.mesh)
        this.nodes = []

        this.group.position.set(cx, cy, cz)

        const tiles = pieceTiles(piece)
        for (let index = 0; index < tiles.length; index++) {
            const tile = tiles[index]!
            const mesh = createToken(tile.color, this.disposables)
            mesh.position.set(tile.dx * CELL_DIST, -tile.dy * CELL_DIST, 0)
            const userData = userDataForTile?.(tile, index)
            mesh.userData = userData ?? {}
            this.nodes.push({ mesh, logo: tile.color })
            this.group.add(mesh)
        }
    }

    /** Convenience: build the current piece at the cross zone */
    build(state: GameState) {
        const piece = currentPiece(state)
        if (!piece) return
        this.group.rotation.set(0, 0, 0)
        this.buildAt(piece, CROSS_ZONE.x, CROSS_ZONE.y, CROSS_ZONE.z, (tile): PieceTileData => ({
            type: 'pieceTile',
            tile,
        }))
    }

    dispose() {
        for (const node of this.nodes) this.group.remove(node.mesh)
        this.nodes = []
        this.scene.remove(this.group)
    }
}
