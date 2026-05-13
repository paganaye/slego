declare module 'jsfxr' {
    export const sfxr: {
        toAudio(sound: Record<string, number | boolean>): HTMLAudioElement
    }
}
