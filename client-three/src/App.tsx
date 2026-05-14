import { createSignal, onCleanup, onMount } from 'solid-js'
import './App.css'
import { Game, initialGameState } from './Game'
import type { GameState } from './Game'
import { Scene3D } from './Scene3D'
import { SettingsProvider } from './SettingsContext'
import { SettingsModal } from './SettingsModal'
import { ThemeApplier } from './ThemeApplier'

const DEV_SEED = 'SLEGO_DEV_SEED_V2'

function AppContent() {
  const gameSeed = import.meta.env.DEV ? DEV_SEED : new Date().toISOString()
  const game = new Game(gameSeed)
  let state: GameState = initialGameState(game)
  let scene3d: Scene3D | undefined
  const [isMenuOpen, setIsMenuOpen] = createSignal(false)
  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false)
  let containerRef: HTMLDivElement | undefined

  onMount(() => {
    if (!containerRef) return
    scene3d = new Scene3D(containerRef, state);
    (window as any).slego = scene3d;
    scene3d.initializePhysicsAsync().catch(err => console.error('Physics initialization error:', err))
    onCleanup(() => scene3d?.dispose())
  })

  return (
    <div class="app-shell">
      <ThemeApplier />
      <div class="scene-container" ref={containerRef} />

      <button class="hud-button" onClick={() => setIsMenuOpen((open) => !open)}>
        {isMenuOpen() ? 'Close Menu' : 'Open Menu'}
      </button>

      {isMenuOpen() && (
        <aside class="menu-panel">
          <h2>Menu</h2>
          <button class="panel-button" onClick={() => { setIsSettingsOpen(true); setIsMenuOpen(false) }}>
            Settings
          </button>
          <button class="panel-button" onClick={() => setIsMenuOpen(false)}>
            Back To Game
          </button>
        </aside>
      )}

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  )
}

export function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  )
}
