import { Button } from "./Button";
import { Colors } from "../core/Colors";
import { CanvasLayer, ICanvasLayerOptions } from "./CanvasLayer";
import { Size } from "../core/Types";
import { Layer } from "./Layer";
import { Setting } from "../core/Setting";

export interface INumericInputOptions extends Partial<ICanvasLayerOptions> {
  minValue: number;
  maxValue: number;
  leftButtonText: string;
  rightButtonText: string;
  textWidth: number;
  step: number;
  initialValue?: number;
  setting?: Setting<any> | null;
  changeValue?: (newValue: number) => boolean;
  silent: boolean;
}

export class NumericInput extends CanvasLayer {
  protected value = 1;
  leftButton: Button;
  minValue: number;
  maxValue: number;
  leftButtonText: string;
  rightButtonText: string;
  textWidth: number;
  step: number;
  setting: Setting<any> | null | undefined;
  changeValue: ((newValue: number) => boolean) | undefined;
  rightButton: Button;
  static separator = 1;
  buttonTotalWidth: number;
  calculatedSize: Size;
  silent: boolean;
  textOptions = {
    color: Colors.white_ish,
    backgroundColor: Colors.semi_black,
    spaceBefore: 1, spaceAfter: 1
  }

  constructor(parent: Layer, options: Partial<INumericInputOptions> = {}) {
    super(parent, options);

    this.minValue = options.minValue ?? 0;
    this.maxValue = options.maxValue ?? 100;
    this.leftButtonText = options.leftButtonText ?? "<";
    this.rightButtonText = options.rightButtonText ?? ">";
    this.textWidth = options.textWidth ?? Math.max(
      this.measureStringWidth(this.minValue.toString(), this.textOptions).width,
      this.measureStringWidth(this.maxValue.toString(), this.textOptions).width);
    this.step = options.step ?? 1;
    this.setting = options.setting;
    this.changeValue = options.changeValue;
    this.silent = options.silent ?? false;

    this.leftButton = new Button(this, this.leftButtonText, {
      ...Button.BlueButton, initialRect: { x: 0, y: 0 }, onClick: () => {
        this.raiseChangeValue(this.value - this.step);
      },
      href: "#previous-round",
      silent: this.silent
    })
    this.buttonTotalWidth = this.leftButton.width + NumericInput.separator;

    this.rightButton = new Button(this, this.rightButtonText, {
      ...Button.BlueButton, initialRect: { x: this.textWidth + this.buttonTotalWidth + 1, y: 0 }, onClick: () => {
        this.raiseChangeValue(this.value + this.step);
      },
      href: "#next-round",
      silent: this.silent
    });

    this.calculatedSize = new Size(
      this.textWidth + this.buttonTotalWidth * 2,
      this.leftButton.size.h);
    //this.setSize(calculatedSize);
    this.value = this.setting?.getValue() ?? options.initialValue ?? this.minValue;
    if (this.setting) {
      this.setting.observe((v) => this.setValue(v))
    }
    super.setSize(this.calculatedSize);
    this.refreshTextAndButtons();
  }

  getValue(): number {
    return this.value;
  }

  raiseChangeValue(newValue: number) {
    if (newValue > this.maxValue) newValue = this.maxValue;
    if (newValue < this.minValue) newValue = this.minValue;
    if (!this.changeValue || this.changeValue(newValue)) {
      this.value = newValue;
      if (this.setting) this.setting.setValue(newValue);
      this.refreshTextAndButtons();
    }
  }

  refreshTextAndButtons() {
    this.leftButton.setEnabled(this.value > this.minValue);
    this.rightButton.setEnabled(this.value < this.maxValue);
    this.invalidate();
  }

  onPaint(): void {
    this.printText()
  }

  getText(): string {
    return this.value.toString();
  }

  printText() {
    let text = this.getText();
    this.print(this.buttonTotalWidth, 1, text, this.textOptions);
  }

  setValue(newValue: number) {
    this.value = newValue;
    this.refreshTextAndButtons();
  }

  onKeyPress(key: string): boolean {
    switch (key) {
      case "ArrowLeft":
        if (this.value > 1) {
          this.raiseChangeValue(this.value - this.step);
        }
        return true;
      case "ArrowRight":
        this.raiseChangeValue(this.value + this.step);
        return true;
    }
    return super.onKeyPress(key);
  }

}
