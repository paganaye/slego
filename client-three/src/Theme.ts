export interface ThemeColors {
  // Background
  bgPrimary: string
  bgSecondary: string
  bgTertiary: string

  // Text
  textPrimary: string
  textSecondary: string
  textTertiary: string

  // UI Components
  buttonBg: string
  buttonBgHover: string
  buttonBorder: string
  
  // Modals & Panels
  panelBg: string
  panelBorder: string
  overlayBg: string

  // Accents
  accentPrimary: string
  accentSuccess: string
  accentDanger: string

  // Scene / HUD
  sceneBg: string
  hudBg: string
}

export const THEME_DARK: ThemeColors = {
  // Background
  bgPrimary: '#081220',
  bgSecondary: '#0f1825',
  bgTertiary: '#1a2536',

  // Text
  textPrimary: '#e5ebff',
  textSecondary: '#c7d2fe',
  textTertiary: '#a5b4fc',

  // UI Components
  buttonBg: 'rgba(30, 41, 59, 0.9)',
  buttonBgHover: 'rgba(45, 56, 79, 0.95)',
  buttonBorder: 'rgba(255, 255, 255, 0.22)',

  // Modals & Panels
  panelBg: 'rgba(8, 14, 25, 0.88)',
  panelBorder: 'rgba(255, 255, 255, 0.18)',
  overlayBg: 'rgba(0, 0, 0, 0.6)',

  // Accents
  accentPrimary: 'rgba(49, 130, 206, 0.8)',
  accentSuccess: '#34d399',
  accentDanger: '#fb7185',

  // Scene / HUD
  sceneBg: '#0a0e16',
  hudBg: 'rgba(8, 18, 32, 0.55)',
}

export const THEME_LIGHT: ThemeColors = {
  // Background
  bgPrimary: '#f8f9fa',
  bgSecondary: '#eff2f7',
  bgTertiary: '#e5ecf7',

  // Text
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  textTertiary: '#6b7280',

  // UI Components
  buttonBg: 'rgba(229, 236, 247, 0.9)',
  buttonBgHover: 'rgba(209, 221, 241, 0.95)',
  buttonBorder: 'rgba(31, 41, 55, 0.22)',

  // Modals & Panels
  panelBg: 'rgba(255, 255, 255, 0.92)',
  panelBorder: 'rgba(31, 41, 55, 0.18)',
  overlayBg: 'rgba(0, 0, 0, 0.4)',

  // Accents
  accentPrimary: 'rgba(59, 130, 246, 0.8)',
  accentSuccess: '#10b981',
  accentDanger: '#ef4444',

  // Scene / HUD
  sceneBg: '#ffffff',
  hudBg: 'rgba(243, 244, 246, 0.85)',
}

export function getTheme(style: 'light' | 'dark'): ThemeColors {
  return style === 'light' ? THEME_LIGHT : THEME_DARK
}
