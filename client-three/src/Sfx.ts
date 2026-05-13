
import type { Sound } from './sounds'
import { sfxr } from 'jsfxr'

type JsfxrPlayable = {
    play: () => unknown
    channels?: Array<{ stop?: (when?: number) => void }>
}

export class Sfx {
    private pool: Array<HTMLAudioElement | JsfxrPlayable> = []

    play(sound: Sound) {
        const audio = sfxr.toAudio({ ...sound.sfx })
        this.pool.push(audio)
        try {
            const playResult = audio.play()
            if (playResult && typeof playResult.catch === 'function') {
                void playResult.catch(() => {
                    // Ignore blocked autoplay errors.
                })
            }
        } catch {
            // Ignore playback errors from unsupported environments.
        }
    }

    unlock() {
        // Kept for API compatibility with Scene3D pointer-unlock flow.
    }



    dispose() {
        for (const audio of this.pool) {
            if ('pause' in audio && typeof audio.pause === 'function') {
                audio.pause()
                audio.removeAttribute('src')
                audio.load()
                continue
            }
            if ('channels' in audio && Array.isArray(audio.channels)) {
                for (const channel of audio.channels) {
                    if (typeof channel.stop === 'function') channel.stop(0)
                }
            }
        }
        this.pool = []
    }

    
}
