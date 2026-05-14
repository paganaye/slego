import * as THREE from 'three'
import type { Scene3D } from './Scene3D'

const DEBUG_MOTION = false;

export type MotionConfig = {
    acceleration: number
    angularMultiplier: number
    decelerationStrength?: number
}

const DEFAULT_CONFIG: MotionConfig = {
    acceleration: 30,
    angularMultiplier: 1,
    decelerationStrength: 2
}

export class MotionObject {
    readonly position = new THREE.Vector3()
    readonly velocity = new THREE.Vector3()
    readonly destinationPosition = new THREE.Vector3()

    readonly orientation = new THREE.Quaternion()
    readonly angularVelocity = new THREE.Vector3()
    readonly destinationOrientation = new THREE.Quaternion()

    private readonly config: MotionConfig

    private readonly toDestination = new THREE.Vector3()
    private readonly deltaQuat = new THREE.Quaternion()
    private readonly deltaAxis = new THREE.Vector3()
    private readonly euler = new THREE.Euler()

    private debugLogElapsed = 0
    private debugMoveActive = false

    constructor(readonly scene: Scene3D, config: Partial<MotionConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config }
    }

    async moveTo(args: {
        position: THREE.Vector3Like
        orientation?: THREE.Vector3Like
        stopAtEnd?: boolean
    }) {
        const stopAtEnd = args.stopAtEnd ?? true
        this.debugMoveActive = true
        this.debugLogElapsed = 0

        if (DEBUG_MOTION) {
            console.log('[MotionObject] moveTo:start', {
                from: this.position.clone(),
                to: args.position,
                config: this.config,
            })
        }

        this.setDestinationPosition(args.position)

        if (args.orientation) {
            this.euler.set(args.orientation.x, args.orientation.y, args.orientation.z)
            this.destinationOrientation.setFromEuler(this.euler)
        }

        return new Promise<void>((resolve) => {
            this.scene.animations.animate((_dt: number) => {
                const linearClose =
                    this.position.distanceToSquared(this.destinationPosition) < 1e-6 &&
                    this.velocity.lengthSq() < 1e-4

                const angularClose =
                    this.orientation.angleTo(this.destinationOrientation) < 1e-4 &&
                    this.angularVelocity.lengthSq() < 1e-4

                const arrived = stopAtEnd
                    ? (linearClose && angularClose)
                    : (this.toDestination.lengthSq() < 1e-6)

                if (arrived) {
                    if (stopAtEnd) {
                        this.position.copy(this.destinationPosition)
                        this.velocity.set(0, 0, 0)
                        this.orientation.copy(this.destinationOrientation)
                        this.angularVelocity.set(0, 0, 0)
                    }

                    this.debugMoveActive = false

                    if (DEBUG_MOTION) {
                        console.log('[MotionObject] moveTo:end')
                    }

                    resolve()
                    return true
                }

                return false
            })
        })
    }

    snapTo(position: THREE.Vector3Like, orientation?: THREE.Vector3Like) {
        this.debugMoveActive = false

        this.position.set(position.x, position.y, position.z)
        this.destinationPosition.copy(this.position)
        this.velocity.set(0, 0, 0)

        if (orientation) {
            this.euler.set(orientation.x, orientation.y, orientation.z)
            this.orientation.setFromEuler(this.euler)
            this.destinationOrientation.copy(this.orientation)
            this.angularVelocity.set(0, 0, 0)
        }

        this._onPositionChanged()
    }

    setDestinationPosition(position: THREE.Vector3Like) {
        this.destinationPosition.set(position.x, position.y, position.z)
    }

    update(dt: number) {
        if (dt <= 0) return

        // -------- POSITION --------

        const accel = this.config.acceleration
        const strength = this.config.decelerationStrength ?? 1

        this.toDestination.copy(this.destinationPosition).sub(this.position)

        const dist = this.toDestination.length()
        const speed = this.velocity.length()

        if (dist > 1e-5) {
            const dir = this.toDestination.clone().normalize()

            const decel = accel * strength

            const stoppingDistance = (speed * speed) / (2 * decel)

            if (dist > stoppingDistance) {
                // ACCEL
                this.velocity.addScaledVector(dir, accel * dt)
            } else {
                // DECEL (fix propre)
                if (speed > 0) {
                    const decelStep = decel * dt
                    const newSpeed = Math.max(0, speed - decelStep)
                    this.velocity.multiplyScalar(newSpeed / speed)
                }
            }

            // -------- MOVE + TRUE anti-overshoot --------

            const toBefore = this.destinationPosition.clone().sub(this.position)

            this.position.addScaledVector(this.velocity, dt)

            const toAfter = this.destinationPosition.clone().sub(this.position)

            if (toBefore.dot(toAfter) <= 0) {
                this.position.copy(this.destinationPosition)
                this.velocity.set(0, 0, 0)
            }
        }

        // -------- ROTATION (fix sync position) --------

        this.deltaQuat.copy(this.destinationOrientation)
            .multiply(this.orientation.clone().invert())

        if (this.deltaQuat.w < 0) {
            this.deltaQuat.set(
                -this.deltaQuat.x,
                -this.deltaQuat.y,
                -this.deltaQuat.z,
                -this.deltaQuat.w
            )
        }

        const angle = 2 * Math.acos(THREE.MathUtils.clamp(this.deltaQuat.w, -1, 1))

        if (angle > 1e-5) {
            const s = Math.sqrt(1 - this.deltaQuat.w * this.deltaQuat.w)

            this.deltaAxis.set(
                this.deltaQuat.x / s,
                this.deltaQuat.y / s,
                this.deltaQuat.z / s
            )

            const accel = this.config.acceleration * this.config.angularMultiplier / Math.PI
            const strength = this.config.decelerationStrength ?? 1
            const decel = accel * strength

            const angularSpeed = this.angularVelocity.length()

            const stoppingAngle = (angularSpeed * angularSpeed) / (2 * decel)

            if (angle > stoppingAngle) {
                // ACCEL
                this.angularVelocity.addScaledVector(this.deltaAxis, accel * dt)
            } else {
                // DECEL
                if (angularSpeed > 0) {
                    const decelStep = decel * dt
                    const newSpeed = Math.max(0, angularSpeed - decelStep)
                    this.angularVelocity.multiplyScalar(newSpeed / angularSpeed)
                }
            }

            // APPLY ROTATION
            const angleStep = this.angularVelocity.length() * dt

            if (angleStep > angle) {
                // anti-overshoot
                this.orientation.copy(this.destinationOrientation)
                this.angularVelocity.set(0, 0, 0)
            } else {
                const axis = this.angularVelocity.clone().normalize()
                const dq = new THREE.Quaternion().setFromAxisAngle(axis, angleStep)
                this.orientation.multiply(dq).normalize()
            }
        } else {
            this.angularVelocity.set(0, 0, 0)
        }
        // -------- SNAP --------

        if (this.position.distanceToSquared(this.destinationPosition) < 1e-6 &&
            this.velocity.lengthSq() < 1e-4) {
            this.position.copy(this.destinationPosition)
            this.velocity.set(0, 0, 0)
        }

        if (this.orientation.angleTo(this.destinationOrientation) < 1e-4 &&
            this.angularVelocity.lengthSq() < 1e-4) {
            this.orientation.copy(this.destinationOrientation)
            this.angularVelocity.set(0, 0, 0)
        }

        this._onPositionChanged()

        // -------- DEBUG --------

        if (DEBUG_MOTION && this.debugMoveActive) {
            this.debugLogElapsed += dt
            if (this.debugLogElapsed >= 0.1) {
                this.debugLogElapsed = 0
                console.log('[MotionObject] tick', {
                    dist: this.position.distanceTo(this.destinationPosition),
                    speed: this.velocity.length(),
                    angle: this.orientation.angleTo(this.destinationOrientation),
                })
            }
        }
    }


    protected _onPositionChanged() { }
}
