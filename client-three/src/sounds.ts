type SfxParams = {
    oldParams: boolean
    wave_type: number
    p_env_attack: number
    p_env_sustain: number
    p_env_punch: number
    p_env_decay: number
    p_base_freq: number
    p_freq_limit: number
    p_freq_ramp: number
    p_freq_dramp: number
    p_vib_strength: number
    p_vib_speed: number
    p_arp_mod: number
    p_arp_speed: number
    p_duty: number
    p_duty_ramp: number
    p_repeat_speed: number
    p_pha_offset: number
    p_pha_ramp: number
    p_lpf_freq: number
    p_lpf_ramp: number
    p_lpf_resonance: number
    p_hpf_freq: number
    p_hpf_ramp: number
    sound_vol: number
    sample_rate: number
    sample_size: number
}

const stubSfx: SfxParams = {
    oldParams: true,
    wave_type: 1,
    p_env_attack: 0,
    p_env_sustain: 0.0724552537606425,
    p_env_punch: 0.5164782573933308,
    p_env_decay: 0.40132604036042385,
    p_base_freq: 0.8680243104743425,
    p_freq_limit: 0,
    p_freq_ramp: 0,
    p_freq_dramp: 0,
    p_vib_strength: 0,
    p_vib_speed: 0,
    p_arp_mod: 0.2966315133844656,
    p_arp_speed: 0.6222783163440305,
    p_duty: 0,
    p_duty_ramp: 0,
    p_repeat_speed: 0,
    p_pha_offset: 0,
    p_pha_ramp: 0,
    p_lpf_freq: 1,
    p_lpf_ramp: 0,
    p_lpf_resonance: 0,
    p_hpf_freq: 0,
    p_hpf_ramp: 0,
    sound_vol: 0.25,
    sample_rate: 44100,
    sample_size: 8,
}

const withSfx = (type: string, patch: Partial<SfxParams>) => ({
    type,
    sfx: { ...stubSfx, ...patch },
})

export const sounds = {
    pieceArrived: withSfx('PieceArrived', {
        wave_type: 2,
        p_base_freq: 0.63,
        p_env_sustain: 0.05,
        p_env_decay: 0.18,
        p_freq_ramp: 0.08,
        p_arp_mod: 0.12,
        p_arp_speed: 0.4,
    }),
    dragStart: withSfx('DragStart', {
        wave_type: 0,
        p_base_freq: 0.35,
        p_env_sustain: 0.02,
        p_env_decay: 0.12,
        p_freq_ramp: -0.15,
        sound_vol: 0.2,
    }),
    dragSnap: withSfx('DragSnap', {
        wave_type: 1,
        p_base_freq: 0.74,
        p_env_sustain: 0.03,
        p_env_decay: 0.09,
        p_env_punch: 0.65,
        p_freq_ramp: 0.12,
        sound_vol: 0.22,
    }),
    dropValid: withSfx('DropValid', {
        wave_type: 1,
        p_base_freq: 0.44,
        p_env_sustain: 0.06,
        p_env_decay: 0.24,
        p_env_punch: 0.55,
        p_freq_ramp: -0.22,
        sound_vol: 0.25,
    }),
    dropInvalid: withSfx('DropInvalid', {
        wave_type: 0,
        p_base_freq: 0.19,
        p_env_sustain: 0.04,
        p_env_decay: 0.3,
        p_freq_ramp: -0.38,
        p_hpf_freq: 0.35,
        sound_vol: 0.23,
    }),
    piecesDropping: withSfx('PiecesDropping', {
        wave_type: 3,
        p_base_freq: 0.24,
        p_env_sustain: 0.1,
        p_env_decay: 0.48,
        p_freq_ramp: -0.3,
        p_pha_offset: -0.2,
        sound_vol: 0.24,
    }),
    lineFormed1: withSfx('LineFormed1', {
        wave_type: 2,
        p_base_freq: 0.45,
        p_env_sustain: 0.05,
        p_env_decay: 0.2,
        p_freq_ramp: 0.08,
        p_arp_mod: 0.1,
        p_arp_speed: 0.34,
    }),
    lineFormed2: withSfx('LineFormed2', {
        wave_type: 2,
        p_base_freq: 0.53,
        p_env_sustain: 0.05,
        p_env_decay: 0.22,
        p_freq_ramp: 0.1,
        p_arp_mod: 0.14,
        p_arp_speed: 0.36,
    }),
    lineFormed3: withSfx('LineFormed3', {
        wave_type: 2,
        p_base_freq: 0.61,
        p_env_sustain: 0.055,
        p_env_decay: 0.24,
        p_freq_ramp: 0.11,
        p_arp_mod: 0.18,
        p_arp_speed: 0.38,
    }),
    lineFormed4: withSfx('LineFormed4', {
        wave_type: 2,
        p_base_freq: 0.69,
        p_env_sustain: 0.06,
        p_env_decay: 0.26,
        p_freq_ramp: 0.12,
        p_arp_mod: 0.21,
        p_arp_speed: 0.4,
    }),
    lineFormed5: withSfx('LineFormed5', {
        wave_type: 2,
        p_base_freq: 0.77,
        p_env_sustain: 0.065,
        p_env_decay: 0.28,
        p_freq_ramp: 0.13,
        p_arp_mod: 0.25,
        p_arp_speed: 0.42,
    }),
    lineFormed6: withSfx('LineFormed6', {
        wave_type: 2,
        p_base_freq: 0.85,
        p_env_sustain: 0.07,
        p_env_decay: 0.3,
        p_freq_ramp: 0.15,
        p_arp_mod: 0.3,
        p_arp_speed: 0.44,
    }),
    collision: withSfx('Collision', {
        wave_type: 0, // square → moins “musical” que triangle

        p_base_freq: 0.35, // plus grave
        p_freq_ramp: -0.15, // chute rapide (impact)

        p_env_attack: 0.0,
        p_env_sustain: 0.01,
        p_env_decay: 0.07,
        p_env_punch: 0.9,

        p_arp_mod: 0,
        p_arp_speed: 0,

        p_lpf_freq: 0.6, // coupe les aigus → moins “clic”
        p_hpf_freq: 0.1, // garde un peu de corps

        sound_vol: 0.1,
    }),
    // Backward-compatible aliases while Scene3D transitions to new names.
    spawn: withSfx('PieceArrived', {
        wave_type: 2,
        p_base_freq: 0.63,
        p_env_sustain: 0.05,
        p_env_decay: 0.18,
        p_freq_ramp: 0.08,
        p_arp_mod: 0.12,
        p_arp_speed: 0.4,
    }),
    stamp: withSfx('DropValid', {
        wave_type: 1,
        p_base_freq: 0.44,
        p_env_sustain: 0.06,
        p_env_decay: 0.24,
        p_env_punch: 0.55,
        p_freq_ramp: -0.22,
        sound_vol: 0.25,
    }),
    merge: withSfx('LineFormed1', {
        wave_type: 2,
        p_base_freq: 0.45,
        p_env_sustain: 0.05,
        p_env_decay: 0.2,
        p_freq_ramp: 0.08,
        p_arp_mod: 0.1,
        p_arp_speed: 0.34,
    }),
    clear: withSfx('PiecesDropping', {
        wave_type: 3,
        p_base_freq: 0.24,
        p_env_sustain: 0.1,
        p_env_decay: 0.48,
        p_freq_ramp: -0.3,
        p_pha_offset: -0.2,
        sound_vol: 0.24,
    }),
} as const

export type Sound = typeof sounds[keyof typeof sounds]





