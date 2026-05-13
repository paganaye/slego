import { useSlegoApp } from "../components/SlegoApp";
import { addStyle } from "../Styles";
import { TopBar } from "../components/TopBar";
import { GameComponent } from "../components/GameComponent";
import { TutorialComponent } from "../components/TutorialComponent";
import { createMemo, on } from "solid-js";
import { Game } from "@shared/slego";

addStyle(".GamePage", {
  display: "flex",
  flexDirection: "column",
});

export function GamePage() {
  const app = useSlegoApp();

  const onPlayAgain = () => {
    const oldGame = app.currentGame.get()!;
    const newGame = oldGame.tutorial
      ? Game.fromTutorial(oldGame.tutorial)
      : Game.random({ rounds: oldGame.rounds, seed: oldGame.seed!, name: oldGame.name });
    app.currentGame.set(newGame);
  };

  //  let game = app.currentGame.get()!;

  const gameComponent = createMemo(on(app.currentGame.get, (value) => {
    let game = value as Game;
    return game.tutorial
      ? new TutorialComponent({ app, game, onPlayAgain })
      : new GameComponent({ app, game, onPlayAgain });

  }));

  const title = createMemo(() => {
    return <p>{app.currentGame.get()?.name}</p>;
  });

  return (
    <div class="GamePage">
      <div class="game-header">
        <TopBar
          title={title()}
          onBack={() => {
            const previousScreen = app.previousScreen.get();
            if (previousScreen) {
              app.navigateTo(previousScreen);
            } else {
              app.navigateTo('menu'); // Fallback to menu if no previous screen
            }
          }}
        />
      </div>
      {gameComponent().render()}
    </div>
  );
}