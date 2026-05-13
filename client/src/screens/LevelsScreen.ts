import { PagedScreen } from "./PagedScreen";
import { Button, IButtonOptions } from "../controls/Button";
import { toBaseX } from "../core/baseX";
import { IScreen } from "../core/IScreen";
import { App } from "../controls/App";

export interface IGame {
  button: string;
  text: string;
  roundCount: number;
  seed: number;
}

export class LevelsScreen extends PagedScreen implements IScreen {
    
  games: IGame[] = [];
  title?: string
  gameCount?: number
  seed?: number;

  constructor(app: App) {
    super(app, { twoColumnsInLandscape: true });
  }

  init(screenName: string, _args: string[]) {
    this.title = screenName;
    this.clearSections();
    let gameCount = this.gameCount ?? 10;
    let buttonStyle: Partial<IButtonOptions> = { ...Button.MenuButton };

    this.games.length = 0;
    for (let i = 1; i <= gameCount; i++) {
      this.games.push({ button: "#" + i, text: "Easy", roundCount: 5, seed: 1_123_000 + i })
    }
    let addGameSection = (game: IGame) => {
      this.addDiv(
        {
          layer: new Button(this, game.button, {
            ...buttonStyle, onClick: () => {
              this.playGame(game)
            }
          })
        },
        { text: game.text, spaceBefore: 10, spaceAbove: -1 }
      )
    }
    for (let game of this.games) {
      addGameSection(game);
    }
    this.invalidate();
  }

  playGame(_game: IGame) {
    let args = [toBaseX(_game.seed)]
    if (_game.roundCount != 40) args.push(_game.roundCount.toString())
    this.app.navigateTo("game", args)
  }

  getTitle(): string {
    return this.title ?? "levels";
  }
}

