import { createContext, useContext } from "solid-js";
import { JSX } from "solid-js";
import { ITutorialLevel } from "../tutorial";
import { Signal } from "../Signal";

export type SCREEN = 'menu' | 'game' | 'levels' | 'hallOfFame' | 'help' | 'tutorial';
export type ScreenComponent = () => JSX.Element;
import { MainMenuPage } from '../pages/MainMenuPage';
import { GamePage } from '../pages/GamePage';
import { TutorialLevelsPage } from '../pages/TutorialLevelsPage';
import { HallOfFamePage } from '../pages/HallOfFamePage';
import { HelpPage } from '../pages/HelpPage';
import { TutorialPage } from "../pages/TutorialPage";
import { addStyle } from "../Styles";

// Screen components mapping
const screens: Record<SCREEN, ScreenComponent> = {
  menu: () => <MainMenuPage />,
  game: () => <GamePage />,
  levels: () => <TutorialLevelsPage />,
  hallOfFame: () => <HallOfFamePage />,
  help: () => <HelpPage />,
  tutorial: () => <TutorialPage />
};

export const SlegoAppContext = createContext<SlegoApp>();

addStyle(".SlegoApp-container", {
  height: "100vh",
  width: "100vw",
  display: "flex",
  "align-items": "center",
  "justify-content": "center"
});

addStyle(".SlegoApp", {
  display: "flex",
  "max-width": "900px",
  "max-height": "640px",
  "flex-direction": "column"
});

export class SlegoApp {
  readonly currentScreen = new Signal<SCREEN>('menu');
  readonly currentTutorial = new Signal<ITutorialLevel | null>(null);

  render() {
    return (
      <div class="SlegoApp-container">
        <div class="SlegoApp">
          <SlegoAppContext.Provider value={this}>
            {screens[this.currentScreen.get()]!!()}
          </SlegoAppContext.Provider>
        </div>
      </div>
    );

  }
}

export function useSlegoApp() {
  const context = useContext(SlegoAppContext);
  if (context === undefined) {
    throw new Error("useSlegoApp must be used within a SlegoAppContext.Provider");
  }
  return context;
}
