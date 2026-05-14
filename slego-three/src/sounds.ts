// Zzfx parameters: [volume, randomness, frequency, attack, sustain, release, shape, shapeCurve, slide, deltaSlide, pitchJump, pitchJumpTime, repeatTime, noise, modulation, bitCrush, delay, sustainVolume, decay, tremolo, filter]
// Shape: 0=sine, 1=square, 2=sawtooth, 3=triangle, 4=noise

export enum ZzfxParam {
    volume = 0,
    randomness = 1,
    frequency = 2,
    attack = 3,
    sustain = 4,
    release = 5,
    shape = 6,
    shapeCurve = 7,
    slide = 8,
    deltaSlide = 9,
    pitchJump = 10,
    pitchJumpTime = 11,
    repeatTime = 12,
    noise = 13,
    modulation = 14,
    bitCrush = 15,
    delay = 16,
    sustainVolume = 17,
    decay = 18,
    tremolo = 19,
    filter = 20
}

export type ZzfxParams = [
    volume: number,
    randomness: number,
    frequency: number,
    attack: number,
    sustain: number,
    release: number,
    shape: number,
    shapeCurve: number,
    slide: number,
    deltaSlide: number,
    pitchJump: number,
    pitchJumpTime: number,
    repeatTime: number,
    noise: number,
    modulation: number,
    bitCrush: number,
    delay: number,
    sustainVolume: number,
    decay: number,
    tremolo: number,
    filter: number
]

type SoundDefinition = {
    type: string
    zzfx: ZzfxParams
}

const withSfx = (type: string, zzfx: ZzfxParams) => ({
    type,
    zzfx,
})

export const SOUNDS_LOCAL_STORAGE_KEY = 'slego.zzfx.overrides.v1'

export const DefaultSounds = {
    pieceArrived: withSfx('PieceArrived', [0.4, 0.1, 500, 0.01, 0.2, 0.1, 0.1, 0, 0, 0, 0.15, 0.3, 0.5, 0, 0, 0, 0, 0.2, 0, 0, 0]),
    dragStart: withSfx('DragStart', [0.2, 0.05, 200, 0.01, 0.15, 0, 0.08, 1, 0, 0, -0.15, 0, 0, 0, 0, 0, 0, 0.1, 0, 0, 0]),
    dragSnap: withSfx('DragSnap', [0.25, 0.08, 800, 0.02, 0.1, 0, 0.1, 1, 0, 0, 0.12, 0.2, 0.3, 0, 0, 0, 0, 0.125, 0, 0, 0]),
    dropValid: withSfx('DropValid', [0.3, 0.1, 600, 0.02, 0.25, 0.05, 0.15, 0, 0, 0, -0.2, 0, 0, 0, 0, 0, 0, 0.15, 0, 0, 0]),
    dropInvalid: withSfx('DropInvalid', [0.25, 0.1, 300, 0.01, 0.3, 0, 0.15, 1, 0, 0, -0.35, 0, 0, 0, 0, 0, 0, 0.125, 0, 0, 0]),
    piecesDropping: withSfx('PiecesDropping', [0.3, 0.15, 150, 0.05, 0.5, 0.1, 0.2, 4, 0, 0, -0.25, 0, 0, 0, 0.2, 0, 0, 0.15, 0, 0, 0]),
    lineFormed1: withSfx('LineFormed1', [0.35, 0.08, 500, 0.02, 0.2, 0.05, 0.12, 0, 0, 0, 0.1, 0.25, 0.4, 0, 0, 0, 0, 0.175, 0, 0, 0]),
    lineFormed2: withSfx('LineFormed2', [0.35, 0.08, 600, 0.02, 0.22, 0.05, 0.12, 0, 0, 0, 0.12, 0.3, 0.4, 0, 0, 0, 0, 0.175, 0, 0, 0]),
    lineFormed3: withSfx('LineFormed3', [0.35, 0.08, 700, 0.02, 0.24, 0.05, 0.12, 0, 0, 0, 0.13, 0.35, 0.4, 0, 0, 0, 0, 0.175, 0, 0, 0]),
    lineFormed4: withSfx('LineFormed4', [0.35, 0.08, 800, 0.02, 0.26, 0.06, 0.12, 0, 0, 0, 0.14, 0.4, 0.4, 0, 0, 0, 0, 0.175, 0, 0, 0]),
    lineFormed5: withSfx('LineFormed5', [0.35, 0.08, 900, 0.02, 0.28, 0.06, 0.12, 0, 0, 0, 0.15, 0.45, 0.4, 0, 0, 0, 0, 0.175, 0, 0, 0]),
    lineFormed6: withSfx('LineFormed6', [0.35, 0.08, 1000, 0.02, 0.3, 0.07, 0.12, 0, 0, 0, 0.17, 0.5, 0.4, 0, 0, 0, 0, 0.175, 0, 0, 0]),
    collision: withSfx('Collision', [0.15, 0.2, 400, 0.001, 0.08, 0, 0.05, 1, 0, 0, -0.1, 0, 0, 0, 0, 0, 0, 0.075, 0, 0, 0]),
    spawn: withSfx('PieceArrived', [0.4, 0.1, 500, 0.01, 0.2, 0.1, 0.1, 0, 0, 0, 0.15, 0.3, 0.5, 0, 0, 0, 0, 0.2, 0, 0, 0]),
    stamp: withSfx('DropValid', [0.3, 0.1, 600, 0.02, 0.25, 0.05, 0.15, 0, 0, 0, -0.2, 0, 0, 0, 0, 0, 0, 0.15, 0, 0, 0]),
    merge: withSfx('LineFormed1', [0.35, 0.08, 500, 0.02, 0.2, 0.05, 0.12, 0, 0, 0, 0.1, 0.25, 0.4, 0, 0, 0, 0, 0.175, 0, 0, 0]),
    clear: withSfx('PiecesDropping', [0.3, 0.15, 150, 0.05, 0.5, 0.1, 0.2, 4, 0, 0, -0.25, 0, 0, 0, 0.2, 0, 0, 0.15, 0, 0, 0]),
} satisfies Record<string, SoundDefinition>

export type SoundName = keyof typeof DefaultSounds

export const soundNames = Object.keys(DefaultSounds) as SoundName[]

export type SoundOverrides = Partial<Record<SoundName, ZzfxParams>>

const isZzfxParams = (value: unknown): value is ZzfxParams => {
    if (!Array.isArray(value) || value.length !== 21) return false
    return value.every(item => typeof item === 'number' && Number.isFinite(item))
}

const parseSoundOverrides = (value: unknown): SoundOverrides => {
    if (!value || typeof value !== 'object') return {}
    const parsed = value as Record<string, unknown>
    const overrides: SoundOverrides = {}
    for (const name of soundNames) {
        const candidate = parsed[name]
        if (isZzfxParams(candidate)) {
            overrides[name] = candidate
        }
    }
    return overrides
}

export const loadSoundOverrides = (): SoundOverrides => {
    if (typeof window === 'undefined') return {}
    try {
        const raw = window.localStorage.getItem(SOUNDS_LOCAL_STORAGE_KEY)
        if (!raw) return {}
        return parseSoundOverrides(JSON.parse(raw))
    } catch {
        return {}
    }
}

export const saveSoundOverrides = (overrides: SoundOverrides) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(SOUNDS_LOCAL_STORAGE_KEY, JSON.stringify(overrides))
}

export const buildMergedSounds = (overrides: SoundOverrides): typeof DefaultSounds => {
    const merged = { ...DefaultSounds }
    for (const name of soundNames) {
        const base = DefaultSounds[name]
        const override = overrides[name]
        if (override) {
            merged[name] = withSfx(base.type, override)
        }
    }
    return merged
}

export const sounds = buildMergedSounds(loadSoundOverrides())

export type Sound = typeof sounds[keyof typeof sounds]





