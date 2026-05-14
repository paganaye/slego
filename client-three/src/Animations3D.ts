import * as THREE from 'three'
import { currentPiece, pieceTokens } from './Game'
import type { IPosition, LineSegment, Board } from './Game'
import { FALL_GRAVITY, FALL_MAX_SPEED } from './PhysicsConfig'
import type { Scene3D } from './Scene3D'
import { sounds } from './sounds'
import { Token, TOKEN_SIZE } from './Token'

type FallingToken = {
    token: Token
    falling: boolean
    vy: number
    rapierHandle: number | null
}

export class Animations {
    constructor(readonly scene: Scene3D) { }
    #fallingTokens: FallingToken[] = []
    #animations: ((dt: number) => boolean)[] = []
    #animation: object | null = null

    get animation() {
        return this.#animation
    }

    async startNextPieceSpawn() {
        let state = this.scene.gameState;
        const piece = currentPiece(state)
        if (!piece) {
            this.scene.setPieceGridVisible(false)
            this.clear()
            return
        }

        this.scene.setPieceGridVisible(true)

        const pickupPos = this.scene.currentPieceMatWorldPos(piece) ?? this.scene.nextPiecePickupWorldPos()
        const pickupOrientation = { x: -Math.PI / 2, y: 0, z: 0 }

        await this.scene.pieceGrid3d.moveTo({
            position: pickupPos,
            orientation: pickupOrientation,
        })

        this.scene.pickupCurrentPiece()
        this.scene.playSound(sounds.Spawn)

        const restPos = this.scene.pieceRestZone()
        const restOrientation = { x: 0, y: 0, z: 0 }

        await this.scene.pieceGrid3d.moveTo({
            position: restPos,
            orientation: restOrientation,
        })

        this.scene.playSound(sounds.PieceArrived)
    }

    clear() {
    }

    async playerStamp(_targetPos: IPosition) {
        const piece = currentPiece(this.scene.gameState)
        this.scene.playPosition(_targetPos)
        if (!piece) return
        let tiles = pieceTokens(piece)
        const boardTokens: Token[] = []
        const outOfBoardTokens: Token[] = []
        for (let tile of tiles) {
            const tx = _targetPos.tx + tile.dx
            const ty = _targetPos.ty + tile.dy
            const inBounds = tx >= 0 && tx < 5 && ty >= 0 && ty < 5
            const token = this.scene.tokenById[tile.token.tokenId]!
            if (inBounds) {
                this.scene.boardGrid3d.attachObjectKeepWorld(token.mesh)
                boardTokens.push(token)
            } else {
                outOfBoardTokens.push(token)
            }
        }
        let roundResult = this.scene.gameState.history.at(-1)!
        const overwrittenTokens: Token[] = roundResult.overwrittenTokens
            .map((token) => this.scene.tokenById[token.tokenId])
            .filter((token): token is Token => !!token)

        await this.animateFor({ duration: 1 }, (t) => {
            for (const token of boardTokens) {
                token.mesh.position.z = (1 - t) * TOKEN_SIZE.z
            }
            for (const overwrittenToken of overwrittenTokens) {
                overwrittenToken.mesh.position.z = -1 * TOKEN_SIZE.z
            }
        })
        for (const token of overwrittenTokens) {
            token.setLocation('mat-played')
            this.scene.threeScene.attach(token.mesh)
            this._startTokenFreeFall(token)
        }
        for (const token of outOfBoardTokens) {
            token.setLocation('mat-played')
            this.scene.threeScene.attach(token.mesh)
            this._startTokenFreeFall(token)
        }
        const restPos = this.scene.pieceRestZone()
        await this.scene.pieceGrid3d.moveTo({
            position: restPos,
            orientation: { x: 0, y: 0, z: 0 },
        })


        await this.animateCreatedSegments(roundResult.segments, roundResult.boardAfterPlace)
        await this.animateScore()
        await this.startNextPieceSpawn()
        await this.advanceBoardZ()
    }

    async advanceBoardZ() {
        // const startZ = this.scene.boardZ
        // const targetZ = Math.max(BOARD_Z_MAX, this.scene.gameState.history.length * BOARD_Z_PER_ROUND)
        // await this.animateFor({ duration: 1 }, (p) => {
        //             this.scene.boardZ = startZ + (targetZ - startZ) * overshoot(p)
        // })
    }

    async animateCreatedSegments(segments: LineSegment[], board: Board) {
        const WIGGLE_AMP = 0.25
        const WIGGLE_FREQ = 18

        for (const segment of segments) {
            const tokens: Token[] = []
            for (let i = 0; i < segment.length; i++) {
                const tx = segment.start.tx + (segment.direction === 'horizontal' ? i : 0)
                const ty = segment.start.ty + (segment.direction === 'vertical' ? i : 0)
                const cell = board.getCell(tx, ty)
                if (!cell) continue
                const token3D = this.scene.tokenById[cell.tokenId]
                if (token3D) tokens.push(token3D)
            }
            if (tokens.length === 0) continue

            const savedRotations = tokens.map(t => t.mesh.rotation.z)

            // Phase 1: wiggle 0.5s
            await this.animateFor({ duration: 0.5 }, (p) => {
                for (const token of tokens)
                    token.mesh.rotation.z = Math.sin(p * WIGGLE_FREQ) * WIGGLE_AMP * (1 - p * 0.5)
            })

            // Phase 2: wiggle + push forward 0.5s
            const savedZ = tokens.map(t => t.mesh.position.z)
            await this.animateFor({ duration: 0.5 }, (p) => {
                for (let i = 0; i < tokens.length; i++) {
                    tokens[i].mesh.rotation.z = Math.sin(p * WIGGLE_FREQ) * WIGGLE_AMP * (1 - p)
                    tokens[i].mesh.position.z = savedZ[i] + p * TOKEN_SIZE.z * 2
                }
            })

            for (let i = 0; i < tokens.length; i++)
                tokens[i].mesh.rotation.z = savedRotations[i]

            for (const token of tokens) {
                token.setLocation('mat-played')
                this.scene.threeScene.attach(token.mesh)
                this._startTokenFreeFall(token)
            }
        }
    }

    animateScore() {

    }

    clearDebris() {
        const physics = this.scene.physics
        if (physics) {
            for (const node of this.#fallingTokens) {
                if (node.rapierHandle !== null) physics.removeBody(node.rapierHandle)
            }
        }
        this.#fallingTokens = []
    }

    private _startTokenFreeFall(token: Token) {
        let node = this.#fallingTokens.find((it) => it.token === token)
        if (!node) {
            node = { token, falling: true, vy: 0, rapierHandle: null }
            this.#fallingTokens.push(node)
        }
        node.falling = true
        node.vy = 0
        this._attachRapierBody(node)
    }

    tickTokenFreeFall(dt: number) {
        if (this.#fallingTokens.length === 0) return

        const physics = this.scene.physics
        const matSurfaceY = this.scene.nextPiecePickupWorldPos().y - TOKEN_SIZE.z
        const stopY = matSurfaceY + TOKEN_SIZE.y * 0.5
        const active: FallingToken[] = []

        for (const node of this.#fallingTokens) {
            if (physics) {
                if (node.falling && node.rapierHandle === null) this._attachRapierBody(node)
                if (node.rapierHandle !== null) {
                    if (node.falling) {
                        const pos = physics.getPosition(node.rapierHandle)
                        const rot = physics.getRotation(node.rapierHandle)
                        const vel = physics.getVelocity(node.rapierHandle)
                        node.token.mesh.position.copy(pos)
                        node.token.mesh.quaternion.copy(rot)
                        if (vel.lengthSq() < 0.001) {
                            node.falling = false
                            this.scene.matGroup.attach(node.token.mesh)
                        }
                    }
                    active.push(node)
                }
            } else {
                node.vy = Math.max(-FALL_MAX_SPEED, node.vy - FALL_GRAVITY * dt)
                node.token.mesh.position.y += node.vy * dt
                if (node.token.mesh.position.y <= stopY) {
                    node.token.mesh.position.y = stopY
                    node.falling = false
                }
                if (node.falling) active.push(node)
            }
        }

        this.#fallingTokens = active
    }

    private _attachRapierBody(node: FallingToken) {
        const physics = this.scene.physics
        if (!physics) return
        if (node.rapierHandle !== null) {
            physics.removeBody(node.rapierHandle)
            node.rapierHandle = null
        }

        const spawnJitter = 0.03
        const lateralKick = 0.35
        const startPosition = node.token.mesh.position.clone().add(new THREE.Vector3(
            (Math.random() - 0.5) * spawnJitter,
            (Math.random() - 0.5) * spawnJitter,
            0,
        ))
        const initialVelocity = new THREE.Vector3(
            (Math.random() - 0.5) * lateralKick,
            0,
            (Math.random() - 0.5) * lateralKick,
        )
        const angularKick = 3.0
        const angularVelocity = new THREE.Vector3(
            (Math.random() - 0.5) * angularKick,
            (Math.random() - 0.5) * angularKick,
            (Math.random() - 0.5) * angularKick,
        )
        const body = physics.createFallingBody(
            startPosition,
            initialVelocity,
            node.token.mesh.quaternion.clone(),
            angularVelocity,
        )
        node.rapierHandle = body.handle
    }

    tick(dt: number) {
        for (let i = this.#animations.length - 1; i >= 0; i--) {
            const finished = this.#animations[i](dt)
            if (finished) this.#animations.splice(i, 1)
        }
    }

    animate(callback: (dt: number) => boolean): Promise<void> {
        return new Promise<void>((resolve) => {
            this.#animations.push((dt) => {
                const finished = callback(dt)
                if (finished) resolve()
                return finished
            })
        })
    }

    delay(sec: number): Promise<void> {
        let ms = sec * 1000;
        return new Promise<void>((resolve) => {
            this.animate((dt) => {
                ms -= dt * 1000
                if (ms <= 0) resolve()
                return ms <= 0
            })
        });
    }

    animateFor(options: { duration: number }, callback: (progress: number) => void): Promise<void> {
        let t = 0
        const duration = Math.max(options.duration, 1e-6)
        return this.animate((dt) => {
            t = Math.min(duration, t + dt)
            callback(t / duration)
            return t >= duration
        });

    }

}

