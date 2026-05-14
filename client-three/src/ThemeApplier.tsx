import { createEffect } from 'solid-js'
import { useTheme } from './SettingsContext'

export function ThemeApplier() {
  const theme = useTheme()

  createEffect(() => {
    const colors = theme()
    const root = document.documentElement

    // Set CSS variables
    root.style.setProperty('--color-bg-primary', colors.bgPrimary)
    root.style.setProperty('--color-bg-secondary', colors.bgSecondary)
    root.style.setProperty('--color-bg-tertiary', colors.bgTertiary)
    root.style.setProperty('--color-text-primary', colors.textPrimary)
    root.style.setProperty('--color-text-secondary', colors.textSecondary)
    root.style.setProperty('--color-text-tertiary', colors.textTertiary)
    root.style.setProperty('--color-button-bg', colors.buttonBg)
    root.style.setProperty('--color-button-bg-hover', colors.buttonBgHover)
    root.style.setProperty('--color-button-border', colors.buttonBorder)
    root.style.setProperty('--color-panel-bg', colors.panelBg)
    root.style.setProperty('--color-panel-border', colors.panelBorder)
    root.style.setProperty('--color-overlay-bg', colors.overlayBg)
    root.style.setProperty('--color-accent-primary', colors.accentPrimary)
    root.style.setProperty('--color-accent-success', colors.accentSuccess)
    root.style.setProperty('--color-accent-danger', colors.accentDanger)
    root.style.setProperty('--color-scene-bg', colors.sceneBg)
    root.style.setProperty('--color-hud-bg', colors.hudBg)
  })

  return null
}
