import { App } from "../controls/App";
import { NumericInput } from "../controls/NumericInput";
import { PagedScreen } from "./PagedScreen";
import { Fonts } from "../Fonts";
import { IScreen } from "../core/IScreen";
import { TextInput } from "../controls/TextInput";
import { Button } from "../controls/Button";

export class SettingsScreen extends PagedScreen implements IScreen {
  musicOn: boolean = true;
  soundOn: boolean = true;

  constructor(app: App) {
    super(app, { twoColumnsInLandscape: true });
    this.addDiv(
      { text: "Music volume:", font: Fonts.defaultFont },
      { layer: new NumericInput(this, { step: 5, initialValue: 100, setting: App.instance.musicVolume }) });
    this.addDiv(
      { text: "Sound volume:", font: Fonts.defaultFont },
      { layer: new NumericInput(this, { step: 5, initialValue: 100, setting: App.instance.soundVolume }) });
    this.addDiv(
      { text: "Animation speed:", font: Fonts.defaultFont },
      { layer: new NumericInput(this, { minValue: 1, maxValue: 5, initialValue: 3, setting: App.instance.animationSpeed }) })
    this.addDiv(
      { text: "User name:", font: Fonts.defaultFont },
      { layer: new TextInput(this, { initialValue: "" }) });
    this.addDiv(
      {
        layer: new Button(this, "Login with google", {
          onClick: () => {
            location.href = "/slego-io-dev/auth/google";
          }
        })
      });
    this.addDiv(
      {
        layer: new Button(this, "Login with facebook", {
          onClick: () => {
            location.href = "/slego-io-dev/auth/facebook";
          }
        })
      });
  }

  getTitle(): string {
    return "Settings";
  }
}
