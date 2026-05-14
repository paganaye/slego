import { createContext, useContext, createSignal, createMemo, JSX } from 'solid-js'
import type { AppSettings } from './SettingsData'
import { loadSettings, saveSettings } from './SettingsData'
import { getTheme, type ThemeColors } from './Theme'

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
