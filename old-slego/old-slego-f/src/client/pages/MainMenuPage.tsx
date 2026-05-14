import { useSlegoApp } from "../components/SlegoApp";
import { playSound } from "../sound";
import { addStyle } from "../Styles";

addStyle(".menu-btn", {
  "background-color": "#ff4500",
  "color": "#ffffff",
  "border": "none",
  "padding": "15px 30px",
  "font-size": "1.1rem",
  "border-radius": "8px",
  "cursor": "pointer",
  "transition": "background-color 0.2s ease",
  "min-width": "200px"
});

addStyle(".menu-btn:hover", {
  "background-color": "#d93900"
});

addStyle(".menu-btn.secondary", {
  "background-color": "#666"
});

addStyle(".menu-btn.secondary:hover", {
  "background-color": "#555"
});

addStyle(".menu-buttons", {
  display: "flex",
  "flex-direction": "column",
  gap: "15px"
});

addStyle(".MainMenuPage", {
  display: "flex",
  "flex-direction": "column",
  "align-items": "center",
  gap: "20px",
  "pointer-events": "auto",
  "min-height": "100vh",
  padding: "20px",
  "box-sizing": "border-box"
});

addStyle(".MainMenuPage .logo-container", {
  "margin-bottom": "10px",
  "pointer-events": "auto"
});

addStyle(".MainMenuPage .description", {
  "font-size": "1rem",
  color: "#d1d5db",
  "pointer-events": "auto",
  "text-align": "center"
});

addStyle(".MainMenuPage .menu-buttons", {
  display: "flex",
  "flex-direction": "column",
  gap: "15px"
});

addStyle(".game-logo", {
  scale: "400%"
})
export function MainMenuPage() {
  console.log('🏠 MainMenuPage rendering...');
  const slegoApp = useSlegoApp();
  console.log('🎮 Game context received:', slegoApp);

  // Event handlers
  function handleStartGame() {
    console.log('🎮 Starting game...');
    console.log('Game context:', slegoApp);
    playSound('gameStart');
    try {
      slegoApp.currentScreen.set('game');
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  function handleShowLevels() {
    console.log('📚 Showing levels...');
    slegoApp.currentScreen.set('levels');
  };

  function handleShowHallOfFame() {
    console.log('🏆 Showing hall of fame...');
    slegoApp.currentScreen.set('hallOfFame');
  };

  function handleShowHelp() {
    console.log('❓ Showing help...');
    slegoApp.currentScreen.set('help');
  };

  return (
    <div class="MainMenuPage">
      <div class="logo-container">
        <img src="slego2-logo.svg" alt="SLEGO 2" class="game-logo" />
      </div>
      <p class="description">Classic 40 rounds solo puzzle game</p>
      <div class="menu-buttons">
        <button
          class="menu-btn secondary"
          onclick={handleShowLevels}
        >
          Tutorial Levels
        </button>
        <button
          class="menu-btn"
          onclick={handleStartGame}
        >
          Competition
        </button>
        <button
          class="menu-btn secondary"
          onclick={handleShowHallOfFame}
        >
          Hall of Fame
        </button>
        <button
          class="menu-btn secondary"
          onclick={handleShowHelp}
        >
          How to Play
        </button>
      </div>
    </div>
  );
}
