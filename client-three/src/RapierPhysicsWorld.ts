/**
 * Rapier Physics World wrapper.
 * Manages a single Rapier3D physics world for all game physics.
 * Synchronized with PhysicsConfig for gravity, damping, etc.
 */

import RAPIER from '@dimforge/rapier3d-compat'
import * as THREE from 'three'
import { FALL_GRAVITY } from './PhysicsConfig'
import { TOKEN_SIZE } from './Token'
import { Scene3D } from './Scene3D';
import { sounds } from './sounds';

export interface RigidBodyHandle {
    handle: RAPIER.RigidBodyHandle
    body: RAPIER.RigidBody
}

let rapierInitialized = false
let rapierModule: typeof RAPIER | null = null

/**
 * Initialize Rapier module (async, call once at startup).
 */
export async function initRapier() {
    if (rapierInitialized) return
    // Runtime expects object-style init parameters; typings may still lag behind.
    await (RAPIER.init as unknown as (opts: Record<string, never>) => Promise<void>)({})
    rapierModule = RAPIER
    rapierInitialized = true
}

export class RapierPhysicsWorld {
    private world: RAPIER.World
    private rigidBodies: Map<number, THREE.Vector3> = new Map()
    private boardBodyHandle: RAPIER.RigidBodyHandle | null = null
    private matBodyHandle: RAPIER.RigidBodyHandle | null = null
    private eventQueue: RAPIER.EventQueue;

    constructor(readonly scene: Scene3D) {

        if (!rapierModule) {
            throw new Error('Rapier not initialized. Call initRapier() first.')
        }

        // Create world with gravity pointing down (negative Y)
        const gravity = new rapierModule.Vector3(0, -FALL_GRAVITY, 0)
        this.world = new rapierModule.World(gravity)

        // Configure world parameters
        this.world.timestep = 1 / 60  // 60 FPS
        this.eventQueue = new rapierModule.EventQueue(true);
    }

    /**
     * Create static board collider using actual board grid dimensions.
     * @param boardWidth - total width of board (x-axis)
     * @param boardDepth - depth of board cavity (z-axis)
     * @param boardX - horizontal position of board center (follows board movement)
     * @param boardY - vertical position of board surface
     */
    createBoardCollider(boardWidth: number, boardDepth: number, boardX: number = 0, boardY: number = -2.5) {
        // Remove old board collider if exists
        if (this.boardBodyHandle) {
            const previous = this.world.getRigidBody(this.boardBodyHandle)
            if (previous) this.world.removeRigidBody(previous)
        }

        const boardDesc = rapierModule!.RigidBodyDesc.fixed()
            .setTranslation(boardX, boardY, 0)
        const boardBody = this.world.createRigidBody(boardDesc)
        this.boardBodyHandle = boardBody.handle

        // Collider matches actual board grid dimensions (5x5 grid with walls/cavities)
        const boardCollider = rapierModule!.ColliderDesc.cuboid(boardWidth / 2, boardDepth / 2, boardDepth / 2)
            .setRestitution(0.1)
            .setFriction(0.8)

        this.world.createCollider(boardCollider, boardBody)
    }

    /**
     * Create a static collider for the mat/floor where thrown tokens should land.
     */
    createMatCollider(
        matSizeX: number,
        matSizeY: number,
        matSizeZ: number,
        matCenterX: number,
        matCenterY: number,
        matCenterZ: number
    ) {
        if (this.matBodyHandle) {
            const previous = this.world.getRigidBody(this.matBodyHandle)
            if (previous) this.world.removeRigidBody(previous)
        }

        const matDesc = rapierModule!.RigidBodyDesc.fixed()
            .setTranslation(matCenterX, matCenterY, matCenterZ)
        const matBody = this.world.createRigidBody(matDesc)
        this.matBodyHandle = matBody.handle

        const matCollider = rapierModule!.ColliderDesc.cuboid(matSizeX / 2, matSizeY / 2, matSizeZ / 2)
            .setRestitution(0.05)
            .setFriction(0.8)

        this.world.createCollider(matCollider, matBody)
    }

    /**
     * Keep mat collider aligned with the rendered mat transform.
     */
    updateMatColliderPosition(matCenterX: number, matCenterY: number, matCenterZ: number) {
        if (!this.matBodyHandle) return
        const matBody = this.world.getRigidBody(this.matBodyHandle)
        if (!matBody) return
        matBody.setTranslation({ x: matCenterX, y: matCenterY, z: matCenterZ }, false)
    }

    /**
     * Create a falling dynamic body at position with initial velocity.
     */
    createFallingBody(
        position: THREE.Vector3,
        velocity: THREE.Vector3 = new THREE.Vector3(),
        rotation?: THREE.Quaternion,
        angularVelocity?: THREE.Vector3,
    ): RigidBodyHandle {
        const colliderScale = 0.96
        const halfX = (TOKEN_SIZE.x / 2) * colliderScale
        const halfY = (TOKEN_SIZE.y / 2) * colliderScale
        const halfZ = (TOKEN_SIZE.z / 2) * colliderScale
        let rigidBodyDesc = rapierModule!.RigidBodyDesc.dynamic()
            .setTranslation(position.x, position.y, position.z)
            .setLinvel(velocity.x, velocity.y, velocity.z)
            .setLinearDamping(1.2)
            .setAngularDamping(2.0)
            .setCcdEnabled(true)

        if (rotation) {
            rigidBodyDesc = rigidBodyDesc.setRotation({
                x: rotation.x,
                y: rotation.y,
                z: rotation.z,
                w: rotation.w,
            })
        }
        if (angularVelocity) {
            rigidBodyDesc = rigidBodyDesc.setAngvel(angularVelocity)
        }

        const colliderDesc = rapierModule!.ColliderDesc.cuboid(halfX, halfY, halfZ)
            .setRestitution(0.08)
            .setFriction(0.9)
            .setFrictionCombineRule(rapierModule!.CoefficientCombineRule.Average)
            .setActiveEvents(rapierModule!.ActiveEvents.COLLISION_EVENTS);

        const rigidBody: RAPIER.RigidBody = this.world.createRigidBody(rigidBodyDesc);
        // Set userData for identification in collision events
        (rigidBody as any).userData = { type: 'token' };
        this.world.createCollider(colliderDesc, rigidBody);

        this.rigidBodies.set(rigidBody.handle, position.clone());

        return {
            handle: rigidBody.handle,
            body: rigidBody,
        };
    }

    /**
     * Step the physics world forward by dt.
     */
    step(dt: number) {
        this.world.timestep = dt
        this.world.step(this.eventQueue);

        this.eventQueue.drainCollisionEvents((handle1: number, handle2: number, started: boolean) => {
            if (started) {
                const body1 = this.world.getRigidBody(handle1);
                const body2 = this.world.getRigidBody(handle2);

                if (body1 && body2) {
                    console.log('Collision detected between:', body1, body2);
                    // Play sound for all collisions (or add logic here if needed)
                    this.scene.playSound(sounds.collision);
                }
            }
        });
    }

    /**
     * Get current position of a rigid body.
     */
    getPosition(handle: RAPIER.RigidBodyHandle): THREE.Vector3 {
        const body = this.world.getRigidBody(handle)
        if (!body) return new THREE.Vector3()
        const pos = body.translation()
        return new THREE.Vector3(pos.x, pos.y, pos.z)
    }

    /**
     * Get current velocity of a rigid body.
     */
    getVelocity(handle: RAPIER.RigidBodyHandle): THREE.Vector3 {
        const body = this.world.getRigidBody(handle)
        if (!body) return new THREE.Vector3()
        const vel = body.linvel()
        return new THREE.Vector3(vel.x, vel.y, vel.z)
    }

    /**
     * Get current rotation of a rigid body.
     */
    getRotation(handle: RAPIER.RigidBodyHandle): THREE.Quaternion {
        const body = this.world.getRigidBody(handle)
        if (!body) return new THREE.Quaternion()
        const rot = body.rotation()
        return new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w)
    }

    /**
     * Remove a rigid body from the world.
     */
    removeBody(handle: RAPIER.RigidBodyHandle) {
        const body = this.world.getRigidBody(handle)
        if (body) this.world.removeRigidBody(body)
        this.rigidBodies.delete(handle)
    }

    /**
     * Dispose the world and all bodies.
     */
    dispose() {
        this.rigidBodies.clear()
        this.world.free()
    }
}
