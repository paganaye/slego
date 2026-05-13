import { createSignal, onCleanup, onMount } from 'solid-js'
import './App.css'
import { Game, initialGameState } from './Game'
import type { GameState } from './Game'
import { Scene3D } from './Scene3D'

const DEV_SEED = 'SLEGO_DEV_SEED_V2'

export function App() {
  const gameSeed = import.meta.env.DEV ? DEV_SEED : new Date().toISOString()
  const game = new Game(gameSeed)
  let state: GameState = initialGameState(game)
  let scene3d: Scene3D | undefined
  const [isMenuOpen, setIsMenuOpen] = createSignal(false)
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
      <div class="scene-container" ref={containerRef} />

      <button class="hud-button" onClick={() => setIsMenuOpen((open) => !open)}>
        {isMenuOpen() ? 'Close Menu' : 'Open Menu'}
      </button>

      {isMenuOpen() && (
        <aside class="menu-panel">
          <h2>Menu</h2>
          <p>The game screen stays primary. This panel is the secondary screen.</p>
          <button class="panel-button" onClick={() => setIsMenuOpen(false)}>
            Back To Game
          </button>
        </aside>
      )}
    </div>
  )
}


