import { App } from "../controls/App";
import { NumericInput } from "../controls/NumericInput";
import { PagedScreen } from "./PagedScreen";
import { Fonts } from "../Fonts";

export class AdventureScreen extends PagedScreen {
  musicOn: boolean = true;
  soundOn: boolean = true;

  constructor(app: App) {
    super(app, { layerType: "Screen" });
    let x = 92;
    this.addDiv(
      { text: "1-20 Beginner", font: Fonts.defaultFont },
      {
        layer: new NumericInput(this, { initialRect: { x, y: 20 }, step: 5, initialValue: 100, setting: App.instance.musicVolume })
      });
    this.addDiv(
      { text: "21-40 Intermediate", font: Fonts.defaultFont },
      {
        layer: new NumericInput(this, { initialRect: { x, y: 35 }, step: 5, initialValue: 100, setting: App.instance.soundVolume })
      });
    this.addDiv(
      { text: "41-.. Advanced", font: Fonts.defaultFont },
      {
        layer: new NumericInput(this, { initialRect: { x, y: 50 }, minValue: 1, maxValue: 5, initialValue: 3, setting: App.instance.animationSpeed })
      })
  }

  getTitle(): string {
    return "Adventure";
  }
}
