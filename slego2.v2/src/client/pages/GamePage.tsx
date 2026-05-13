import { useSlegoApp } from "../components/SlegoApp";
import { addStyle } from "../Styles";
import { TopBar } from "../components/TopBar";
import { GameComponent } from "../components/GameComponent";
import { Game } from "@shared/slego";

addStyle(".GamePage", {
  display: "flex",
  "flex-direction": "column",
  width: "100%",
  height: "100vh",
  "pointer-events": "auto"
});

addStyle(".GamePage .game-header", {
  background: "rgba(0, 0, 0, 0.9)",
  "border-bottom": "1px solid rgba(255, 255, 255, 0.1)"
});

export function GamePage() {
  const app = useSlegoApp();
  //let game = new GameVM(app);
  //app.currentGame.set(game);
  let game = Game.random();

  const gameComponent = new GameComponent(app, game);

  return (
    <div class="GamePage">
      <div class="game-header">
        <TopBar
          title="Competition"
          onBack={() => {
            // Return to menu
            app.currentScreen.set('menu');
          }}
        />
      </div>
      {gameComponent.render()}
    </div>
  );
}
