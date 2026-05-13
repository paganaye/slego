export type CrossLandscapeSide = 'left' | 'right'
export type CrossPortraitSide = 'top' | 'bottom'

export type AppSettings = {
    crossLandscapeSide: CrossLandscapeSide
    crossPortraitSide: CrossPortraitSide
}

const SETTINGS_KEY = 'slego.settings'

const DEFAULT_SETTINGS: AppSettings = {
    // Default: cross on the right in landscape.
    crossLandscapeSide: 'right',
    // Default: cross under the board in portrait.
    crossPortraitSide: 'bottom',
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

export function loadSettings(): AppSettings {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY)
        if (!raw) return { ...DEFAULT_SETTINGS }

        const parsed: unknown = JSON.parse(raw)
        if (!isRecord(parsed)) return { ...DEFAULT_SETTINGS }

        const crossLandscapeSide =
            parsed.crossLandscapeSide === 'left' || parsed.crossLandscapeSide === 'right'
                ? parsed.crossLandscapeSide
                : DEFAULT_SETTINGS.crossLandscapeSide

        const crossPortraitSide =
            parsed.crossPortraitSide === 'top' || parsed.crossPortraitSide === 'bottom'
                ? parsed.crossPortraitSide
                : DEFAULT_SETTINGS.crossPortraitSide

        return {
            crossLandscapeSide,
            crossPortraitSide,
        }
    } catch {
        return { ...DEFAULT_SETTINGS }
    }
}

export function saveSettings(settings: AppSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
