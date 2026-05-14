import { Button } from "../controls/Button";
import { ISize } from "../core/Types";
import { Colors } from "../core/Colors";
import { PagedScreen } from "./PagedScreen";
import { Fonts } from "../Fonts";
import { IScreen } from "../core/IScreen";
import { App } from "../controls/App";

export class MainMenu extends PagedScreen implements IScreen {

  constructor(app: App) {
    super(app, { backButton: false });
    this.color = Colors.white_ish;
    this._flowLayout.spaceBetweenSections = 4

    this.addSection(
      { spans: [{ layer: new Button(this, "Play", { ...Button.MenuButton, href: "#play" }) }] },
      { spans: [{ layer: new Button(this, "Scores", { ...Button.MenuButton, href: "#scores" }) }] },
      { spans: [{ layer: new Button(this, "Achievements", { ...Button.MenuButton, href: "#achievements" }) }] },
      { spans: [{ layer: new Button(this, "Settings", { ...Button.MenuButton, href: "#settings" }) }] },
      { spans: [{ layer: new Button(this, "Login", { ...Button.MenuButton, href: "#login" }) }] },
      { spans: [{ layer: new Button(this, "About", { ...Button.MenuButton, href: "#about" }) }] }
    )
  }

  onParentSizeChanged(parentSize: ISize): void {
    super.onParentSizeChanged(parentSize)
    this.setSize(parentSize);
  }

  init(_screenName: string, _args: string[]): void {

  }
  
  protected _printTitle(): void {
    this.print(15, 4, "SLEG○", { font: Fonts.font10_slego });
  }
}
