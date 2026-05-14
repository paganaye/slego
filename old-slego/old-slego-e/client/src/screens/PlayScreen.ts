import { PagedScreen } from "./PagedScreen";
import { Button, IButtonOptions } from "../controls/Button";
import { IScreen } from "../core/IScreen";
import { App } from "../controls/App";

export class PlayScreen extends PagedScreen  implements IScreen{
    
  constructor(app: App) {
    super(app, { twoColumnsInLandscape: true });
    //this.flowLayout.spaceBetweenSections = 0;
    let buttonStyle: Partial<IButtonOptions> = { ...Button.MenuButton, minWidth: 40 };

    let addSection = (button: string, text: string, href: string) => {

      this.addDiv(
        {
          layer: new Button(this, button, {
            ...buttonStyle, href
          })
        },
        { text, spaceBefore: 10, spaceAbove: -1 }
      )
    }
    addSection("Tutorial", "0/10", "#tutorial-levels");
    addSection("Beginner levels", "0/20", "#beginner-levels");
    addSection("Interm. levels", "0/40", "#intermediary-levels");
    addSection("Advanced levels", "0/100", "#advanced-levels");
    addSection("Solo game", "...", "#game");
    addSection("Competition", "TODO", "#TODO");


  }

  getTitle(): string {
    return "Play SLEGO";
  }
}

