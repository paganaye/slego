// import * as THREE from 'three'
// import { Token } from './Token'
// import { pieceTiles, currentPiece } from './Game'
// import type { GameState, Piece, PieceSlot, Position, Tile } from './Game'
// import type { MeshUserData, PieceTileData } from './MeshUserData'
// import { ObjectMotion3D } from './ObjectMotion3D'
// import { GRID_CELL_DIST } from './GridMetrics'

// const CROSS_ZONE = { x: 3.7, y: 0, z: 0 }
// const CENTER_TOKEN_Z_LIFT = 0.06

// interface TokenNode {
//     token: Token
//     tile: Tile
// }

// function pieceSlotFromTile(tile: Tile): PieceSlot {
//     if (tile.dx === 0 && tile.dy === 0) return 'center'
//     if (tile.dx === 0 && tile.dy === -1) return 'up'
//     if (tile.dx === 0 && tile.dy === 1) return 'down'
//     if (tile.dx === -1 && tile.dy === 0) return 'left'
//     if (tile.dx === 1 && tile.dy === 0) return 'right'
//     return 'center'
// }

// export class Piece3D extends ObjectMotion3D {
//     readonly group: THREE.Group
//     private nodes: TokenNode[] = []

//     constructor(
//         private scene: THREE.Object3D,
//         private disposables: Array<THREE.BufferGeometry | THREE.Material>
//     ) {
//         super()
//         this.group = new THREE.Group()
//         this.scene.add(this.group)
//     }

//     setTokenVisibility(visible: boolean) {
//         for (const node of this.nodes) node.token.mesh.visible = visible
//     }

//     /** Build the piece tiles inside the group, centered at (cx, cy, cz) */
//     buildAt(
//         piece: Piece,
//         cx: number,
//         cy: number,
//         cz: number,
//         userDataForTile?: (tile: Tile, tileIndex: number) => MeshUserData | undefined,
//         liftCenter: boolean = true
//     ) {
//         for (const node of this.nodes) this.group.remove(node.token.mesh)
//         this.nodes = []
//         const tokensBySlot = piece.tokensBySlot ?? (piece.tokensBySlot = {})

//         this.group.position.set(cx, cy, cz)

//         const tiles = pieceTiles(piece)
//         for (let index = 0; index < tiles.length; index++) {
//             const tile = tiles[index]!
//             const slot = pieceSlotFromTile(tile)
//             let token = tokensBySlot[slot]
//             if (!token) {
//                 token = new Token(tile.color, this.disposables, { piece, tile })
//                 tokensBySlot[slot] = token
//             } else {
//                 token.bindOrigin(piece, tile)
//             }
//             const mesh = token.mesh
//             const zLift = liftCenter && tile.dx === 0 && tile.dy === 0 ? CENTER_TOKEN_Z_LIFT : 0
//             mesh.position.set(tile.dx * GRID_CELL_DIST.x, -tile.dy * GRID_CELL_DIST.y, zLift)
//             token.setLocation('mat-unplayed')
//             const userData = userDataForTile?.(tile, index)
//             mesh.userData = userData ?? {}
//             this.nodes.push({ token, tile })
//             this.group.add(mesh)
//         }
//     }

//     /** Convenience: build the current piece at the cross zone */
//     build(state: GameState) {
//         const piece = currentPiece(state)
//         if (!piece) return
//         this.group.rotation.set(0, 0, 0)
//         this.buildAt(piece, CROSS_ZONE.x, CROSS_ZONE.y, CROSS_ZONE.z, (tile): PieceTileData => ({
//             type: 'pieceTile',
//             tile,
//         }))
//     }

//     /** Detach tiles that land outside the board, return world-space meshes with their tile offsets */
//     detachOutOfBoardTiles(targetPos: Position, boardSize: number): Array<{ mesh: THREE.Mesh; dx: number; dy: number }> {
//         const detached: Array<{ mesh: THREE.Mesh; dx: number; dy: number }> = []
//         const kept: TokenNode[] = []
//         const worldPos = new THREE.Vector3()
//         for (const node of this.nodes) {
//             const tx = targetPos.tx + node.tile.dx
//             const ty = targetPos.ty + node.tile.dy
//             if (tx >= 0 && tx < boardSize && ty >= 0 && ty < boardSize) {
//                 kept.push(node)
//                 continue
//             }
//             node.token.mesh.getWorldPosition(worldPos)
//             this.group.remove(node.token.mesh)
//             node.token.mesh.position.copy(worldPos)
//             node.token.setLocation('mat-played')
//             this.scene.add(node.token.mesh)
//             detached.push({ mesh: node.token.mesh, dx: node.tile.dx, dy: node.tile.dy })
//         }
//         this.nodes = kept
//         return detached
//     }

//     detachInBoardTiles(targetPos: Position, boardSize: number): Array<{ token: Token; gx: number; gy: number; worldPos: THREE.Vector3 }> {
//         const placed: Array<{ token: Token; gx: number; gy: number; worldPos: THREE.Vector3 }> = []
//         const kept: TokenNode[] = []
//         const worldPos = new THREE.Vector3()
//         for (const node of this.nodes) {
//             const tx = targetPos.tx + node.tile.dx
//             const ty = targetPos.ty + node.tile.dy
//             if (tx >= 0 && tx < boardSize && ty >= 0 && ty < boardSize) {
//                 node.token.mesh.getWorldPosition(worldPos)
//                 this.group.remove(node.token.mesh)
//                 node.token.mesh.position.copy(worldPos)
//                 node.token.setLocation('board')
//                 placed.push({ token: node.token, gx: tx, gy: ty, worldPos: worldPos.clone() })
//             } else {
//                 kept.push(node)
//             }
//         }
//         this.nodes = kept
//         return placed
//     }

//     dispose() {
//         for (const node of this.nodes) this.group.remove(node.token.mesh)
//         this.nodes = []
//         this.scene.remove(this.group)
//     }

//     protected override _onPositionChanged() {
//         this.group.position.copy(this.position)
//     }
// }
