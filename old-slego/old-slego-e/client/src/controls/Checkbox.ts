import { Colors, IRGBA } from "../core/Colors";
import { CanvasLayer, ICanvasLayerOptions, IPrintOptions } from "./CanvasLayer";
import { IPoint, ISize, Size } from "../core/Types";
import { Layer, LayerMouseEvent } from "./Layer";
import { Setting } from "../core/Setting";
import { Fonts } from "../Fonts";

export interface ICheckboxOptions extends Partial<ICanvasLayerOptions & IPrintOptions> {
  textWidth: number;
  initialValue?: boolean;
  checkedIcon: string;
  uncheckedIcon: string;
  setting?: Setting<any> | null;
  borderColor?: IRGBA;
  changeValue?: (newValue: boolean) => boolean;
}



export class Checkbox extends CanvasLayer {
  text: string;
  value = false;
  options: ICheckboxOptions;
  borderTotalSize: number;
  static SmallBlueButton: Partial<ICheckboxOptions> =
    { backgroundColor: Colors.dark_blue, color: Colors.transparent, spaceBefore: 2, spaceAfter: 2 };
  static LargeBlueButton: Partial<ICheckboxOptions> =
    { backgroundColor: Colors.dark_blue, color: Colors.transparent, font: Fonts.font10_slego, spaceBefore: 2, spaceAfter: 2 };
  isDown: boolean = false;

  constructor(parent: Layer, text: string, options: Partial<ICheckboxOptions> = {}) {
    super(parent, options);
    this.text = text;
    this.options = {
      ...options,
      focusable: true,
      textWidth: options.textWidth ?? 26,
      borderColor: options.borderColor ?? this.color,
      changeValue: options.changeValue ?? ((_newValue: boolean) => { console.log("Checkbox clicked"); return false; }),
      spaceBefore: options.spaceBefore ?? 1,
      spaceAfter: options.spaceAfter ?? 1,
      checkedIcon: options.checkedIcon ?? "☑",
      uncheckedIcon: options.uncheckedIcon ?? "☐",
      setting: options.setting
    }
    if (!options.font) options.font = this.font;
    this.borderTotalSize = (this.options.borderColor ? 1 : 0);

    let calculatedSize1 = new Size(
      this.measureStringWidth(this.options.checkedIcon + " " + this.text, this.options).width + 2 * this.borderTotalSize,
      this.getFontHeight(this.options) + 2 * this.borderTotalSize);
    let calculatedSize2 = new Size(
      this.measureStringWidth(this.options.uncheckedIcon + " " + this.text, this.options).width + 2 * this.borderTotalSize,
      this.getFontHeight(this.options) + 2 * this.borderTotalSize);

    this.value = this.options.setting?.getValue() ?? this.options.initialValue ?? false;
    this.setSize({ w: Math.max(calculatedSize1.w, calculatedSize2.w), h: Math.max(calculatedSize1.h, calculatedSize2.h) });

    this.value = this.options.setting?.getValue() ?? this.options.initialValue ?? false;
    if (this.options.setting) {
      this.options.setting.observe(() => {
        this.setValue(this.options.setting?.getValue());
      });
    }
  }


  setValue(newValue: boolean): void {
    this.value = newValue;
    this.printText();

  }

  onMouseEvent(event: LayerMouseEvent, _point: IPoint): boolean {
    switch (event.type) {
      case "down":
        this.app.setFocus(this);
        this.raiseChangeValue(!this.value);
        this.isDown = true;
        break;
      case "up":
        this.isDown = false;
        break;
    }
    return true;
  }

  raiseChangeValue(newValue: boolean) {
    let handled = false;
    if (this.options.changeValue) handled = this.options.changeValue(newValue);
    if (!handled) {
      this.value = newValue;
      this.printText();
    }

  }

  onParentSizeChanged(_parentSize: ISize): void {
    // do not propagate
  }

  onAnimationFrame(): void {
    super.onAnimationFrame()
  }

  getIcon(): string {
    return (this.value) ? this.options.checkedIcon : this.options.uncheckedIcon;
  }

  printText() {
    this.print(this.borderTotalSize, this.borderTotalSize, this.getIcon() + " " + this.text, this.options)
  }

  onPaint(): void {
    this.printText();
  }
}


/*

export class Checkbox extends Button {
  protected value = false;
  options: ICheckboxOptions;

  constructor(parent: Layer, readonly text: string, options: Partial<ICheckboxOptions> = {}) {
    super(parent, options.uncheckedIcon ?? "☐ " + text, options);

    this.options = {
      textWidth: options.textWidth ?? 26,
      setting: options.setting,
      changeValue: options.changeValue
    } as ICheckboxOptions

    // this.leftButton = new Button(this, "[x] " + text, {
    //   ...Button.SmallBlueButton, initialRect: { x: 0, y: 0 }, onClick: () => {
    //     this.raiseChangeValue(!this.value);
    //   }
    // })
    let calculatedSize = new Size(
      this.options.textWidth + 30,
      this.font.height + 2);
    this.setSize(calculatedSize);
    this.value = this.options.setting?.getValue() ?? this.options.initialValue ?? false;
    if (this.options.setting) {
      this.options.setting.observe((v) => this.setValue(v))
    }
  }

  raiseChangeValue(newValue: boolean) {
    if (!this.options.changeValue || this.options.changeValue(newValue)) {
      this.value = newValue;
      if (this.options.setting) this.options.setting.setValue(newValue);
      this.refreshTextAndButtons();
    }
  }

  setSize(_newSize: ISize) {
    super.setSize(new Size(this.options.textWidth + 13, 15));
    this.refreshTextAndButtons();
  }

  refreshTextAndButtons() {
    // this.printText()
    if FontFace
    uncheckedIcon
    checkedIcon

  }

  getText(): string {
    return this.value.toString().padStart(2, " ") + " ";
  }

  printText() {
    let text = this.getText();
    this.print(14, 3, text, { color: Colors.black });
  }

  setValue(newValue: boolean) {
    this.value = newValue;
    this.refreshTextAndButtons();
  }

  onKeyPress(key: string): boolean {
    switch (key) {
      case "Enter":
        this.raiseChangeValue(!this.value);
        return true;
    }
    return super.onKeyPress(key);
  }

}
*/