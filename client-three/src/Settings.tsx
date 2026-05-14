/** @jsxImportSource solid-js */
import { createContext, useContext, createSignal, createMemo, JSX } from 'solid-js'
import { getTheme, type ThemeColors } from './Theme'

// ──────────────────── Types ──────────────────────
export type CrossLandscapeSide = 'left' | 'right'
export type CrossPortraitSide = 'top' | 'bottom'
export type GameStyle = 'light' | 'dark'
export type ScreenOrientationMode = 'auto' | 'portrait' | 'landscape'
export type HDRQuality = '1k' | '2k' | '4k'
export const HDR_ENVIRONMENTS = [
  'autumn_park',
  'brown_photostudio_02',
  'comfy_cafe',
  'golden_gate_hills',
  'hilly_terrain_01',
  'lebombo',
  'old_apartments_walkway',
  'old_room',
  'voortrekker_interior',
] as const
export type HDREnvironment = (typeof HDR_ENVIRONMENTS)[number]

export type AppSettings = {
  crossLandscapeSide: CrossLandscapeSide
  crossPortraitSide: CrossPortraitSide
  style: GameStyle
  animationsSpeed: number
  showHelps: boolean
  timerOn: boolean
  screenOrientationMode: ScreenOrientationMode
  hdrQuality: HDRQuality
  hdrEnvironment: HDREnvironment
}

// ──────────────────── Storage ──────────────────────
const SETTINGS_KEY = 'slego.settings'

const DEFAULT_SETTINGS: AppSettings = {
  crossLandscapeSide: 'right',
  crossPortraitSide: 'bottom',
  style: 'dark',
  animationsSpeed: 1,
  showHelps: true,
  timerOn: false,
  screenOrientationMode: 'auto',
  hdrQuality: '2k',
  hdrEnvironment: 'hilly_terrain_01',
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

    const hdrQuality =
      parsed.hdrQuality === '1k' || parsed.hdrQuality === '2k' || parsed.hdrQuality === '4k'
        ? parsed.hdrQuality
        : DEFAULT_SETTINGS.hdrQuality

    const hdrEnvironment =
      parsed.hdrEnvironment === 'hilly'
        ? 'hilly_terrain_01'
        : parsed.hdrEnvironment === 'voortrekker'
          ? 'voortrekker_interior'
          : typeof parsed.hdrEnvironment === 'string' && HDR_ENVIRONMENTS.includes(parsed.hdrEnvironment as HDREnvironment)
            ? (parsed.hdrEnvironment as HDREnvironment)
            : DEFAULT_SETTINGS.hdrEnvironment

    return {
      crossLandscapeSide,
      crossPortraitSide,
      style,
      animationsSpeed,
      showHelps,
      timerOn,
      screenOrientationMode,
      hdrQuality,
      hdrEnvironment,
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

// ──────────────────── Context ──────────────────────
type SettingsContextValue = {
  settings: () => AppSettings
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
  theme: () => ThemeColors
}

const SettingsContext = createContext<SettingsContextValue>()

export function SettingsProvider(props: { children: JSX.Element }) {
  const [settings, setSettings] = createSignal<AppSettings>(loadSettings())
  const theme = createMemo(() => getTheme(settings().style))

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings(), [key]: value }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, theme }}>
      {props.children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}

export function useTheme() {
  const { theme } = useSettings()
  return theme
}

// ──────────────────── Modal Component ──────────────────────
export interface SettingsModalProps {
  isOpen: () => boolean
  onClose: () => void
}

export function SettingsModal(props: SettingsModalProps): JSX.Element {
  const { settings, updateSetting } = useSettings()

  return (
    <>
      {props.isOpen() && (
        <div class="modal-overlay" onClick={props.onClose}>
          <div class="modal-content" onClick={(e: any) => e.stopPropagation()}>
            <h2>Settings</h2>

            <div class="setting-group">
              <label>Style</label>
              <select
                value={settings().style}
                onChange={(e: any) => updateSetting('style', e.target.value as 'light' | 'dark')}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Speed</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings().animationsSpeed}
                onChange={(e: any) => updateSetting('animationsSpeed', parseFloat(e.target.value))}
              />
              <span class="speed-value">{settings().animationsSpeed.toFixed(1)}x</span>
            </div>

            <div class="setting-group">
              <label>HDR Quality</label>
              <select
                value={settings().hdrQuality}
                onChange={(e: any) => updateSetting('hdrQuality', e.target.value as any)}
              >
                <option value="1k">1K (Fast)</option>
                <option value="2k">2K (Balanced)</option>
                <option value="4k">4K (High Quality)</option>
              </select>
            </div>

            <div class="setting-group">
              <label>HDR Environment</label>
              <select
                value={settings().hdrEnvironment}
                onChange={(e: any) => updateSetting('hdrEnvironment', e.target.value as any)}
              >
                <option value="autumn_park">Autumn Park</option>
                <option value="brown_photostudio_02">Brown Photostudio 02</option>
                <option value="comfy_cafe">Comfy Cafe</option>
                <option value="golden_gate_hills">Golden Gate Hills</option>
                <option value="hilly_terrain_01">Hilly Terrain 01</option>
                <option value="lebombo">Lebombo</option>
                <option value="old_apartments_walkway">Old Apartments Walkway</option>
                <option value="old_room">Old Room</option>
                <option value="voortrekker_interior">Voortrekker Interior</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Orientation</label>
              <select
                value={settings().screenOrientationMode}
                onChange={(e: any) => updateSetting('screenOrientationMode', e.target.value as any)}
              >
                <option value="auto">Auto</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Cross (Landscape)</label>
              <select
                value={settings().crossLandscapeSide}
                onChange={(e: any) => updateSetting('crossLandscapeSide', e.target.value as any)}
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Cross (Portrait)</label>
              <select
                value={settings().crossPortraitSide}
                onChange={(e: any) => updateSetting('crossPortraitSide', e.target.value as any)}
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>

            <div class="setting-group checkbox">
              <input
                type="checkbox"
                id="showHelps"
                checked={settings().showHelps}
                onChange={(e: any) => updateSetting('showHelps', e.target.checked)}
              />
              <label for="showHelps">Show Help Tips</label>
            </div>

            <div class="setting-group checkbox">
              <input
                type="checkbox"
                id="timerOn"
                checked={settings().timerOn}
                onChange={(e: any) => updateSetting('timerOn', e.target.checked)}
              />
              <label for="timerOn">Show Timer</label>
            </div>

            <button class="modal-button" onClick={props.onClose}>
              Done
            </button>
          </div>
        </div>
      )}
    </>
  )
}

