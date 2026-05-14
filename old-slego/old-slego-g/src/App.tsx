import { SlegoGame } from './components/SlegoGame';
import { ThemeSelector } from './components/ThemeSelector';



export function App() {
  return <>
    <svg width="0" height="0" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
      <defs>
        <symbol id="circle-tile" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="35" fill="currentColor" opacity="0.9" />
        </symbol>
        <symbol id="square-tile" viewBox="0 0 100 100">
          <rect x="15" y="15" width="70" height="70" fill="currentColor" opacity="0.9" />
        </symbol>
        <symbol id="triangle-tile" viewBox="0 0 100 100">
          <polygon points="50,20 80,70 20,70" fill="currentColor" opacity="0.9" />
        </symbol>
        <symbol id="diamond-tile" viewBox="0 0 100 100">
          <polygon points="50,15 85,50 50,85 15,50" fill="currentColor" opacity="0.9" />
        </symbol>
        <symbol id="star-tile" viewBox="0 0 100 100">
          <polygon points="50,10 61,35 90,35 68,52 79,85 50,68 21,85 32,52 10,35 39,35" fill="currentColor" opacity="0.9" />
        </symbol>
        <symbol id="cross-tile" viewBox="0 0 100 100">
          <polygon points="35,15 65,15 65,35 85,35 85,65 65,65 65,85 35,85 35,65 15,65 15,35 35,35" fill="currentColor" opacity="0.9" />
        </symbol>

        {/* SLEGO color tiles - using dynamic colors */}
        <symbol id="tile-red" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#ff4444" stroke="#cc0000" stroke-width="2" />
        </symbol>
        <symbol id="tile-blue" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#4444ff" stroke="#0000cc" stroke-width="2" />
        </symbol>
        <symbol id="tile-green" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#44ff44" stroke="#00cc00" stroke-width="2" />
        </symbol>
        <symbol id="tile-magenta" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#ff44ff" stroke="#cc00cc" stroke-width="2" />
        </symbol>
      </defs>
    </svg>

    <ThemeSelector />
    <SlegoGame />
  </>;
}
