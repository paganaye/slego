import { zzfx } from 'zzfx'
import type { Sound } from './sounds'

type ZzfxNote = { stop: (when?: number) => void }

export class Sfx {
    private activeNotes: ZzfxNote[] = []

    play(sound: Sound) {
        try {
            const note = zzfx(...sound.zzfx) as ZzfxNote
            this.activeNotes.push(note)
        } catch {
            // Ignore playback errors from unsupported environments.
        }
    }

    unlock() {
        // Kept for API compatibility with Scene3D pointer-unlock flow.
    }

    dispose() {
        for (const note of this.activeNotes) {
            if (typeof note.stop === 'function') {
                note.stop(0)
            }
        }
        this.activeNotes = []
    }
}
