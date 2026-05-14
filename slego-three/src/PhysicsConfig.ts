/**
 * Centralized physics constants for the game.
 * All velocity, gravity, damping, and spring parameters are defined here.
 * This allows easy tuning and future migration to rapier3d.
 */

// ── Falling Physics ──────────────────────────────────────────
export const FALL_GRAVITY = 18
export const FALL_MAX_SPEED = 12
export const FALL_END_Y = -5

// ── Segment Throw Physics ───────────────────────────────────
export const SEGMENT_THROW_GRAVITY = 16
export const SEGMENT_THROW_DAMPING = 0.9

// ── Debris/Particle Physics ──────────────────────────────────
export const DEBRIS_DAMPING = 0.92

// ── Grid Motion Physics ──────────────────────────────────────
export const GRID_POSITION_GAIN = 12  // Spring stiffness for grid motion
export const GRID_LINEAR_DAMPING = 8   // Exponential damping: Math.exp(-N * dt)
export const GRID_MAX_ACCELERATION = 60

// ── Object Motion Physics (ObjectMotion3D defaults) ──────────
export const OBJECT_MOTION_CONFIG = {
    positionGain: 10,           // Spring stiffness
    maxSpeed: 18,               // m/s
    maxAcceleration: 50,        // m/s²
    linearDamping: 6,           // Exponential decay coefficient
}

// ── Drag & Drop Controls ────────────────────────────────────
export const DRAG_SNAP_DISTANCE = 0.5
export const DRAG_NEAR_Z = 0.5      // TOKEN_SIZE.z
export const DRAG_FAR_Z = 0.95      // TOKEN_SIZE.z + 0.45

// ── Animation Easings ───────────────────────────────────────
export const EASING = {
    easeInCubic: (t: number) => t * t * t,
    easeOutCubic: (t: number) => {
        const inv = 1 - t
        return 1 - inv * inv * inv
    },
}
