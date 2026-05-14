// import * as THREE from 'three'
// import { Token, TOKEN_SIZE } from './Token'
// import { Slot3D } from './Slot3D'
// import { BoardGrid3D } from './BoardGrid3D'
// import type { GameState, LineSegment, Position } from './Game'
// import type { BoardCellData } from './MeshUserData'
// import { ObjectMotion3D } from './ObjectMotion3D'
// import { GRID_CELL_DIST } from './GridMetrics'
// import { FALL_GRAVITY, FALL_MAX_SPEED } from './PhysicsConfig'

// export { FALL_GRAVITY, FALL_MAX_SPEED }
// export const FALL_END_Y = -5

// const PUSH_BACK_DURATION_DEFAULT = 0.25

// interface TokenNode {
//     token: Token
//     gx: number
//     gy: number
//     falling: boolean
//     vy: number
//     rapierBodyHandle?: { handle: number; body: any }
// }

// interface PushBackAnim {
//     node: TokenNode
//     elapsed: number
//     duration: number
//     fromZ: number
//     toZ: number
// }

// interface SegmentJellyAnim {
//     node: TokenNode
// }

// const BODY_SLEEP_SPEED_SQ = 0.12
// const BODY_SETTLE_Y = -3.6

// export class Board3D extends ObjectMotion3D {
//     private nodes: TokenNode[] = []
//     private detachedNodes: TokenNode[] = []
//     private slots!: Slot3D
//     private grid!: BoardGrid3D
//     private pushBackAnims: PushBackAnim[] = []
//     private overwrittenNodes: TokenNode[] = []
//     private segmentJellyAnims: SegmentJellyAnim[] = []

//     constructor(
//         private scene: THREE.Object3D,
//         private _disposables: Array<THREE.BufferGeometry | THREE.Material>,
//         private scene3d: any  // Scene3D (avoid circular import)
//     ) {
//         super({ positionGain: 14, maxSpeed: 20, maxAcceleration: 60 })  // TODO: migrate to PhysicsConfig
//         this.snapTo({ x: -2.5, y: 0, z: 0 })
//         this.slots = new Slot3D(scene, this._disposables, this._boardSlotPositions())
//         this.grid = new BoardGrid3D(scene, this._disposables)
//     }

//     get boardGrid3d(): BoardGrid3D { return this.grid }

//     protected override _onPositionChanged() {
//         if (!this.slots) return
//         this.slots.setPositions(this._boardSlotPositions())
//         if (!this.grid) return
//         this.grid.setPosition(this.position)
//         for (const node of this.nodes) {
//             node.token.mesh.position.x = this.position.x + (node.gx - 2) * GRID_CELL_DIST.x
//             node.token.mesh.position.y = this.position.y + (2 - node.gy) * GRID_CELL_DIST.y
//         }
//     }

//     build(_state: GameState) {
//         // Intentionally no-op: board tokens are kept persistent and moved by animations/physics.
//     }

//     tick(dt: number) {
//         // Update falling nodes from the main grid
//         for (const node of this.nodes) {
//             if (!node.falling) continue
            
//             // Use Rapier physics if available and body exists
//             if (node.rapierBodyHandle && this.scene3d.physics) {
//                 const rapierPhysics = this.scene3d.physics
//                 const pos = rapierPhysics.getPosition(node.rapierBodyHandle.handle)
//                 const vel = rapierPhysics.getVelocity(node.rapierBodyHandle.handle)
                
//                 node.token.mesh.position.x = pos.x
//                 node.token.mesh.position.y = pos.y
//                 node.token.mesh.position.z = pos.z
//                 node.vy = vel.y
                
//                 const speedSq = vel.lengthSq()
//                 if (speedSq <= BODY_SLEEP_SPEED_SQ && pos.y <= BODY_SETTLE_Y) {
//                     node.vy = 0
//                     node.falling = false
//                     if (node.rapierBodyHandle) {
//                         rapierPhysics.removeBody(node.rapierBodyHandle.handle)
//                         node.rapierBodyHandle = undefined
//                     }
//                 }
//             } else {
//                 // Fallback to manual physics if Rapier not available
//                 node.vy = Math.max(-FALL_MAX_SPEED, node.vy - FALL_GRAVITY * dt)
//                 node.token.mesh.position.y += node.vy * dt
//                 if (node.token.mesh.position.y <= -5) {
//                     node.token.mesh.position.y = -5
//                     node.vy = 0
//                     node.falling = false
//                 }
//             }
//         }

//         // Update detached (fallen) nodes that were removed from the main grid but still falling
//         const settledDetached: TokenNode[] = []
//         for (const node of this.detachedNodes) {
//             if (!node.falling) {
//                 settledDetached.push(node)
//                 continue
//             }

//             // Use Rapier physics if available and body exists
//             if (node.rapierBodyHandle && this.scene3d.physics) {
//                 const rapierPhysics = this.scene3d.physics
//                 const pos = rapierPhysics.getPosition(node.rapierBodyHandle.handle)
//                 const vel = rapierPhysics.getVelocity(node.rapierBodyHandle.handle)
                
//                 node.token.mesh.position.x = pos.x
//                 node.token.mesh.position.y = pos.y
//                 node.token.mesh.position.z = pos.z
//                 node.vy = vel.y
                
//                 const speedSq = vel.lengthSq()
//                 if (speedSq <= BODY_SLEEP_SPEED_SQ && pos.y <= BODY_SETTLE_Y) {
//                     node.vy = 0
//                     node.falling = false
//                     if (node.rapierBodyHandle) {
//                         rapierPhysics.removeBody(node.rapierBodyHandle.handle)
//                         node.rapierBodyHandle = undefined
//                     }
//                     settledDetached.push(node)
//                 }
//             } else {
//                 // Fallback to manual physics if Rapier not available
//                 node.vy = Math.max(-FALL_MAX_SPEED, node.vy - FALL_GRAVITY * dt)
//                 node.token.mesh.position.y += node.vy * dt
//                 if (node.token.mesh.position.y <= -5) {
//                     node.token.mesh.position.y = -5
//                     node.vy = 0
//                     node.falling = false
//                     settledDetached.push(node)
//                 }
//             }
//         }
//         this.detachedNodes = settledDetached

//         if (this.pushBackAnims.length > 0) {
//             const remaining: PushBackAnim[] = []
//             for (const anim of this.pushBackAnims) {
//                 anim.elapsed = Math.min(anim.duration, anim.elapsed + dt)
//                 const t = anim.elapsed / anim.duration
//                 const eased = 1 - Math.pow(1 - t, 3)
//                 anim.node.token.mesh.position.z = anim.fromZ + (anim.toZ - anim.fromZ) * eased
//                 if (t < 1) remaining.push(anim)
//             }
//             this.pushBackAnims = remaining
//         }

//         if (this.segmentJellyAnims.length > 0) {
//             this.segmentJellyAnims = this.segmentJellyAnims.filter((anim) => anim.node.falling)
//         }
//     }

//     startPushBack(
//         cells: readonly Position[],
//         duration: number = PUSH_BACK_DURATION_DEFAULT,
//         distance: number = -TOKEN_SIZE.z
//     ): boolean {
//         this.pushBackAnims = []
//         this.overwrittenNodes = []
//         for (const cell of cells) {
//             const node = this.nodes.find((n) => n.gx === cell.tx && n.gy === cell.ty)
//             if (!node) continue
//             node.token.setLocation('board')
//             node.falling = false
//             node.vy = 0
//             this.overwrittenNodes.push(node)
//             this.pushBackAnims.push({
//                 node,
//                 elapsed: 0,
//                 duration,
//                 fromZ: node.token.mesh.position.z,
//                 toZ: node.token.mesh.position.z + distance,
//             })
//         }
//         return this.pushBackAnims.length > 0
//     }

//     transitionToFall(): boolean {
//         if (this.overwrittenNodes.length === 0) return false
//         for (const node of this.overwrittenNodes) {
//             node.token.setLocation('mat-played')
//             node.falling = true
//             node.vy = 0
            
//             // Create Rapier body for this falling token
//             if (this.scene3d.physics) {
//                 const pos = new THREE.Vector3(
//                     node.token.mesh.position.x,
//                     node.token.mesh.position.y,
//                     node.token.mesh.position.z
//                 )
//                 const vel = new THREE.Vector3(0, 0, 0)
//                 node.rapierBodyHandle = this.scene3d.physics.createFallingBody(pos, vel)
//             }
//         }
//         return true
//     }

//     isOverwriteFallActive(): boolean {
//         return this.overwrittenNodes.some((node) => node.falling)
//     }

//     isPushBackActive(): boolean {
//         return this.pushBackAnims.length > 0
//     }

//     addPlacedTokens(placed: Array<{ token: Token; gx: number; gy: number; worldPos: THREE.Vector3 }>) {
//         for (const item of placed) {
//             item.token.attachTo(this.scene)
//             item.token.mesh.position.copy(item.worldPos)
//             const boardData: BoardCellData = { type: 'board', pos: { tx: item.gx, ty: item.gy } }
//             item.token.mesh.userData = boardData
//             item.token.setLocation('board')
//             this.nodes.push({ token: item.token, gx: item.gx, gy: item.gy, falling: false, vy: 0 })
//         }
//     }

//     setSegmentHighlightLift(segments: readonly LineSegment[], zLift: number) {
//         const cellKey = new Set<string>()
//         for (const segment of segments) {
//             for (let i = 0; i < segment.length; i++) {
//                 const tx = segment.direction === 'horizontal' ? segment.start.tx + i : segment.start.tx
//                 const ty = segment.direction === 'vertical' ? segment.start.ty + i : segment.start.ty
//                 cellKey.add(`${tx}:${ty}`)
//             }
//         }
//         for (const node of this.nodes) {
//             if (!cellKey.has(`${node.gx}:${node.gy}`)) continue
//             node.token.mesh.position.z = zLift
//         }
//     }

//     resetTokenHighlight() {
//         for (const node of this.nodes) {
//             node.token.mesh.position.z = 0
//         }
//     }

//     startJellyClearForSegment(segment: LineSegment, _duration: number): boolean {
//         const anims: SegmentJellyAnim[] = []
//         for (let i = 0; i < segment.length; i++) {
//             const tx = segment.direction === 'horizontal' ? segment.start.tx + i : segment.start.tx
//             const ty = segment.direction === 'vertical' ? segment.start.ty + i : segment.start.ty
//             const node = this.nodes.find((n) => n.gx === tx && n.gy === ty)
//             if (!node) continue
//             const spread = i - (segment.length - 1) / 2

//             node.token.setLocation('mat-played')
//             node.falling = true
//             node.vy = 0

//             if (this.scene3d.physics) {
//                 const pos = new THREE.Vector3(
//                     node.token.mesh.position.x,
//                     node.token.mesh.position.y,
//                     node.token.mesh.position.z
//                 )
//                 const vel = new THREE.Vector3(
//                     spread * 0.45,
//                     1.6 + Math.abs(spread) * 0.12,
//                     -4.8 - Math.abs(spread) * 0.3
//                 )
//                 node.rapierBodyHandle = this.scene3d.physics.createFallingBody(pos, vel)
//             } else {
//                 // Fallback if physics is not available.
//                 node.token.mesh.position.x += spread * 0.01
//                 node.token.mesh.position.y += 0.02
//                 node.token.mesh.position.z += -0.05
//             }

//             anims.push({ node })
//         }
//         this.segmentJellyAnims = anims
//         return this.segmentJellyAnims.length > 0
//     }

//     isSegmentClearActive(): boolean {
//         return this.segmentJellyAnims.length > 0
//     }

//     dispose() {
//         for (const node of this.nodes) this.scene.remove(node.token.mesh)
//         for (const node of this.detachedNodes) this.scene.remove(node.token.mesh)
//         this.nodes = []
//         this.detachedNodes = []
//         this.pushBackAnims = []
//         this.overwrittenNodes = []
//         this.segmentJellyAnims = []
//         this.slots.dispose()
//         this.grid.dispose()
//     }

//     private _boardSlotPositions() {
//         const positions: Array<{ x: number; y: number; z: number; userData: BoardCellData }> = []
//         for (let gy = 0; gy < 5; gy++) {
//             for (let gx = 0; gx < 5; gx++) {
//                 const boardData: BoardCellData = { type: 'board', pos: { tx: gx, ty: gy } }
//                 positions.push({
//                     x: this.position.x + (gx - 2) * GRID_CELL_DIST.x,
//                     y: this.position.y + (2 - gy) * GRID_CELL_DIST.y,
//                     z: this.position.z,
//                     userData: boardData,
//                 })
//             }
//         }
//         return positions
//     }
// }

