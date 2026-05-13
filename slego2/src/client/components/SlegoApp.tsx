import { createContext, useContext } from "solid-js";
import { JSX } from "solid-js";
import { TutorialTarget } from "../../shared/tutorial";
import { Signal } from "../Signal";

export type ScreenComponent = () => JSX.Element;
import { MainMenuPage } from '../pages/MainMenuPage';
import { GamePage } from '../pages/GamePage';
import { TutorialLevelsPage } from '../pages/TutorialLevelsPage';
import { HallOfFamePage } from '../pages/HallOfFamePage';
import { HelpPage } from '../pages/HelpPage';
import { CompetitionLevelsPage } from "../pages/CompetitionLevelsPage";
import { addStyle } from "../Styles";
import { Game, IPosition } from "@shared/slego";

// Screen components mapping
const screens = {
  menu: () => <MainMenuPage />,
  game: () => <GamePage />,
  tutorialLevels: () => <TutorialLevelsPage />,
  hallOfFame: () => <HallOfFamePage />,
  help: () => <HelpPage />,
  competitionLevels: () => <CompetitionLevelsPage />
} as const;
export type SCREEN = keyof typeof screens;

export const SlegoAppContext = createContext<SlegoApp>();



addStyle(".SlegoApp-container", {
  display: "flex",
  //alignItems: "center",
  backgroundColor: "rgb(var(--bg-color))",
  color: "var(--text-color)",
  minHeight: "100vh",
  justifyContent: "center"
});

addStyle(".SlegoApp", {
  display: "flex",
  width: "min(100%, 800px)",
  height: "min(100%, 640px)",
  maxHeight: "100vh",
  flexDirection: "column"
});

addStyle(".page-content", {
  padding: '1em',
  overflowY: "auto"
});


export class SlegoApp {
  readonly currentScreen: Signal<SCREEN>;
  readonly currentLevel: Signal<number>;
  readonly currentGame = new Signal<Game | null>(null);

  readonly tutorialTarget = new Signal<TutorialTarget | null>(null);
  readonly tutorialTile = new Signal<IPosition | null>(null);
  readonly previousScreen: Signal<SCREEN | null>;


  constructor() {
    // params are used for debugging mainly
    const params = new URLSearchParams(window.location.search);
    this.currentScreen = new Signal<SCREEN>(params.get('screen') as SCREEN ?? 'menu')
    this.currentLevel = new Signal(0);
    this.previousScreen = new Signal<SCREEN | null>(null);
  }

  navigateTo(screen: SCREEN) {
    this.previousScreen.set(this.currentScreen.get());
    this.currentScreen.set(screen);
  }

  render() {
    return (
      <div class="SlegoApp-container">
        <div class="SlegoApp">
          <SlegoAppContext.Provider value={this}>
            {screens[this.currentScreen.get()]?.()}
          </SlegoAppContext.Provider>
        </div>
      </div>
    );

  }
}

export function useSlegoApp() {
  const context = useContext(SlegoAppContext)!;
  return context;
}
