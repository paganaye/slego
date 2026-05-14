import { Show, createSignal, onMount } from "solid-js";
import { Button } from "../components/Button";
import { useSlegoApp } from "../components/SlegoApp";
import { addStyle } from "../Styles";

addStyle(".menu-buttons", {
  display: "flex",
  flexDirection: "column",
  gap: "15px"
});

addStyle(".MainMenuPage", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  minHeight: "100vh",
  padding: "20px",
  boxSizing: "border-box"
});

addStyle(".MainMenuPage .logo-header", {
  marginBottom: "10px",
  display: 'flex',
  flexDirection: 'row',
  gap: '1em'
});

addStyle(".MainMenuPage .description", {
  fontSize: "0.6rem",
  color: "rgb(var(--text-color) / 0.45)",
  textAlign: "center"
});

addStyle(".MainMenuPage .menu-buttons", {
  display: "flex",
  flexDirection: "column",
  gap: "15px"
});

addStyle(".game-logo", {
})
export function MainMenuPage() {
  console.log('🏠 MainMenuPage rendering...');
  const slegoApp = useSlegoApp()!;

  const [currentTheme, setCurrentTheme] = createSignal('system');

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('theme-dark');
    const isLight = html.classList.contains('theme-light');

    if (!isDark && !isLight) { // From System -> Force Dark
      html.classList.add('theme-dark');
      setCurrentTheme('dark');
    } else if (isDark) { // From Dark -> Force Light
      html.classList.remove('theme-dark');
      html.classList.add('theme-light');
      setCurrentTheme('light');
    } else { // From Light -> Back to System
      html.classList.remove('theme-light');
      setCurrentTheme('system');
    }
  };

  return (
    <div class="MainMenuPage">
      <div class="logo-header">
        <img src="slego2-logo.svg" alt="SLEGO 2" class="game-logo" />
        <div class="title-column">
          <p class="title">SLEGO</p>
          <p class="description">Classic puzzle game since 2007</p>
        </div>
      </div>
      <div class="page-content">
        <div class="menu-buttons">
          <Button
            class="menu-btn blue"
            onclick={() => slegoApp.navigateTo('tutorialLevels')}
          >Tutorial Levels</Button>

          <Button
            class="menu-btn red"
            onclick={() => slegoApp.navigateTo('competitionLevels')}
          >Competition</Button>

          <Button
            class="menu-btn green"
            onclick={() => slegoApp.navigateTo('hallOfFame')}
          >Hall of Fame</Button>

          <Button
            class="menu-btn magenta"
            onclick={() => slegoApp.navigateTo('help')}
          >How to Play</Button>

          <Show when={import.meta.env.DEV}>
            <div style={{ "margin-top": "30px", "border-top": "1px solid #888", "padding-top": "15px", "font-size": "0.8rem", "display": "flex", "flex-direction": "column", "gap": "10px" }}>
              <strong>Debug Tools</strong>
              <Button class="blue" onclick={toggleTheme}>
                Toggle Theme (Current: {currentTheme()})
              </Button>
            </div>
          </Show>
        </div>
      </div>
    </div >
  );
}
