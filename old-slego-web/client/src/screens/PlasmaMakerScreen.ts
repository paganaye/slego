import { App } from "../controls/App";
import { PagedScreen } from "./PagedScreen";
import { Fonts } from "../Fonts";
import { IScreen } from "../core/IScreen";
import { RGBInput } from "../controls/RGBInput";
import { ABCInput } from "../controls/ABCInput";
import { IPlasma } from "./Plasma";



export class PlasmaMakerScreen extends PagedScreen implements IScreen {
  musicOn: boolean = true;
  soundOn: boolean = true;
  plasma: IPlasma = {} as IPlasma;

  updatePlasma() {
    return true;
  }

  constructor(app: App) {
    super(app, { twoColumnsInLandscape: true });
    this.plasma = App.instance.backgroundLayer?.plasma!!    
    this.addDiv(
      { text: "x", font: Fonts.defaultFont },
      { layer: new ABCInput(this, { value: this.plasma.x, valueChanged: () => this.updatePlasma() }) });
    this.addDiv(
      { text: "y", font: Fonts.defaultFont },
      { layer: new ABCInput(this, { value: this.plasma.y, valueChanged: () => this.updatePlasma() }) });
    this.addDiv(
      { text: "x²", font: Fonts.defaultFont },
      { layer: new ABCInput(this, { value: this.plasma.x2, valueChanged: () => this.updatePlasma() }) });
    this.addDiv(
      { text: "y²", font: Fonts.defaultFont },
      { layer: new ABCInput(this, { value: this.plasma.y2, valueChanged: () => this.updatePlasma() }) });

    this.addDiv(
      { text: "Color1:", font: Fonts.defaultFont },
      { layer: new RGBInput(this, { value: this.plasma.c1, valueChanged: () => this.updatePlasma() }) });
    this.addDiv(
      { text: "Color2:", font: Fonts.defaultFont },
      { layer: new RGBInput(this, { value: this.plasma.c2, valueChanged: () => this.updatePlasma() }) });
    this.addDiv(
      { text: "Color3:", font: Fonts.defaultFont },
      { layer: new RGBInput(this, { value: this.plasma.c3, valueChanged: () => this.updatePlasma() }) });
    this.addDiv(
      { text: "Color4:", font: Fonts.defaultFont },
      { layer: new RGBInput(this, { value: this.plasma.c4, valueChanged: () => this.updatePlasma() }) });
  }

  getTitle(): string {
    return "Plasma maker";
  }
}
