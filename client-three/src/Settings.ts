export type CrossLandscapeSide = 'left' | 'right'
export type CrossPortraitSide = 'top' | 'bottom'
export type GameStyle = 'light' | 'dark'
export type ScreenOrientationMode = 'auto' | 'portrait' | 'landscape'

export type AppSettings = {
    crossLandscapeSide: CrossLandscapeSide
    crossPortraitSide: CrossPortraitSide
    style: GameStyle
    animationsSpeed: number
    showHelps: boolean
    timerOn: boolean
    screenOrientationMode: ScreenOrientationMode
}

const SETTINGS_KEY = 'slego.settings'

const DEFAULT_SETTINGS: AppSettings = {
    // Default: cross on the right in landscape.
    crossLandscapeSide: 'right',
    // Default: cross under the board in portrait.
    crossPortraitSide: 'bottom',
    style: 'dark',
    animationsSpeed: 1,
    showHelps: true,
    timerOn: false,
    screenOrientationMode: 'auto',
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

        const style =
            parsed.style === 'light' || parsed.style === 'dark'
                ? parsed.style
                : DEFAULT_SETTINGS.style

        const animationsSpeed = typeof parsed.animationsSpeed === 'number' ? Math.max(0.5, Math.min(2, parsed.animationsSpeed)) : DEFAULT_SETTINGS.animationsSpeed
        const showHelps = typeof parsed.showHelps === 'boolean' ? parsed.showHelps : DEFAULT_SETTINGS.showHelps
        const timerOn = typeof parsed.timerOn === 'boolean' ? parsed.timerOn : DEFAULT_SETTINGS.timerOn
        const screenOrientationMode =
            parsed.screenOrientationMode === 'auto' || parsed.screenOrientationMode === 'portrait' || parsed.screenOrientationMode === 'landscape'
                ? parsed.screenOrientationMode
                : DEFAULT_SETTINGS.screenOrientationMode

        return {
            crossLandscapeSide,
            crossPortraitSide,
            style,
            animationsSpeed,
            showHelps,
            timerOn,
            screenOrientationMode,
        }
    } catch {
        return { ...DEFAULT_SETTINGS }
    }
}

export function saveSettings(settings: AppSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function settingsDialog() {
    return <><div class="modal-overlay" onClick = {() => setIsSettingsOpen(false)
}>
    <div class="modal-content" onClick = {(e) => e.stopPropagation()}>
        <h2>Settings </h2>

        < div class="setting-group" >
            <label>Style </label>
            < select
value = { settings().style }
onChange = {(e) => handleSettingChange('style', e.target.value as 'light' | 'dark')}
              >
    <option value="dark" > Dark </option>
        < option value = "light" > Light </option>
            </select>
            </div>

            < div class="setting-group" >
                <label>Animations speed </label>
                    < input
type = "range"
min = "0.5"
max = "2"
step = "0.1"
value = { settings().animationsSpeed }
onChange = {(e) => handleSettingChange('animationsSpeed', parseFloat(e.target.value))}
              />
    < span class="speed-value" > { settings().animationsSpeed.toFixed(1) }x </span>
        </div>

        < div class="setting-group" >
            <label>Orientation </label>
            < select
value = { settings().screenOrientationMode }
onChange = {(e) => handleSettingChange('screenOrientationMode', e.target.value as any)}
              >
    <option value="auto" > Auto </option>
        < option value = "portrait" > Portrait </option>
            < option value = "landscape" > Landscape </option>
                </select>
                </div>

                < div class="setting-group" >
                    <label>Cross(Landscape) </label>
                    < select
value = { settings().crossLandscapeSide }
onChange = {(e) => handleSettingChange('crossLandscapeSide', e.target.value as any)}
              >
    <option value="left" > Left </option>
        < option value = "right" > Right </option>
            </select>
            </div>

            < div class="setting-group" >
                <label>Cross(Portrait) </label>
                < select
value = { settings().crossPortraitSide }
onChange = {(e) => handleSettingChange('crossPortraitSide', e.target.value as any)}
              >
    <option value="top" > Top </option>
        < option value = "bottom" > Bottom </option>
            </select>
            </div>

            < div class="setting-group checkbox" >
                <input 
                type="checkbox"
id = "showHelps"
checked = { settings().showHelps }
onChange = {(e) => handleSettingChange('showHelps', e.target.checked)}
              />
    < label for= "showHelps" > Show Help Tips </label>
        </div>

        < div class="setting-group checkbox" >
            <input 
                type="checkbox"
id = "timerOn"
checked = { settings().timerOn }
onChange = {(e) => handleSettingChange('timerOn', e.target.checked)}
              />
    < label for= "timerOn" > Show Timer </label>
        </div>

        < button class= "modal-button" onClick = {() => setIsSettingsOpen(false)}>
            Done
            </button>
            </div>
            </div>
            </>
}