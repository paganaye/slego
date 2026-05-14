import { Colors } from "../core/Colors";
import { IPoint, Size } from "../core/Types";
import { App } from "./App";
import { IAnts, ILayerOptions, Layer, LayerMouseEvent } from "./Layer";
import { Styles } from "./Styles";

export interface ITextInputOptions extends Partial<ILayerOptions> {
  changeValue?: (newValue: string) => boolean;
  initialValue?: string;
  name?: string;
  type?: string;
}

export class TextInput extends Layer {
  calculatedSize: Size;
  value: string = "";
  changeValue?: (newValue: string) => boolean;

  static {
    Styles.addStyle("@font-face",
      "font-family: 'WebPortfolio'; src: url('/web_portfolio_6x8.woff') format('woff');")

    Styles.addStyle(".font-8-bit",
      // "font-family: 'Press Start 2P', cursive;"
      `font-family: WebPortfolio, cursive;`
      + `border: 0;`
      + `background: ${Colors.toCss(Colors.dark_blue)};`
      + `color: ${Colors.toCss(Colors.white_ish)};`
      + `padding: 0px;`
      + `height: 10px !important;`
      + `border:0;`);

  }

  constructor(parent: Layer, options: Partial<ITextInputOptions> = {}) {
    super(parent, { ...options, tag: "input", focusable: true });
    this._layerElement.classList.add("font-8-bit");
    let thisInputElt = this._layerElement as HTMLInputElement
    thisInputElt.value = "Abc";
    thisInputElt.style.fontSize = (App.instance.pixelSize * 1) + "pt";
    if (options.name) thisInputElt.name = options.name;
    if (options.type) thisInputElt.type = options.type;
    this.changeValue = options.changeValue;
    thisInputElt.addEventListener("focus", () => {
      this.app.setFocus(this);
    })
    thisInputElt.addEventListener("input", () => {
      this.raiseChangeValue(thisInputElt.value);
    })
    this.calculatedSize = new Size(
      40,
      11);
    super.setSize(this.calculatedSize);
    this.refreshText();
  }

  getAnts(): IAnts {
    return super.getAnts()
  }

  onMouseEvent(_event: LayerMouseEvent, _point: IPoint): boolean {
    return false;
  }

  onKeyPress(key: string): boolean {
    if (key === "ArrowUp" || key === "ArrowDow") return false;
    else return true;
  }

  raiseChangeValue(newValue: string) {
    // if (newValue > this.maxValue) newValue = this.maxValue;
    // if (newValue < this.minValue) newValue = this.minValue;
    if (!this.changeValue || this.changeValue(newValue)) {
      this.value = newValue;
      // if (this.setting) this.setting.setValue(newValue);
      this.refreshText();
    }
  }

  refreshText() {
    let thisInputElt = this._layerElement as HTMLInputElement
    if (this.value != thisInputElt.value) {
      thisInputElt.value = this.value;
    }
  }

  getText(): string {
    return this.value.toString();
  }


  setValue(newValue: string) {
    this.value = newValue;
    this.refreshText();
  }


}
