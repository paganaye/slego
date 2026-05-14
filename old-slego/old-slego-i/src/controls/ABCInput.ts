import { CanvasLayer, ICanvasLayerOptions } from "./CanvasLayer";
import { Size } from "../core/Types";
import { Layer } from "./Layer";
import { Setting } from "../core/Setting";
import { HexInput } from "./HexInput";

export interface IABCValue {
  a: number, b: number, c: number
}
export interface IABCInput extends Partial<ICanvasLayerOptions> {
  value?: IABCValue;
  changeValue?: (newValue: IABCValue) => boolean;
  valueChanged?: () => void
}

export class ABCInput extends Layer {
  protected value: IABCValue;
  setting: Setting<any> | null | undefined;
  changeValue: ((newValue: IABCValue) => boolean) | undefined;
  fixedSize = new Size(93, 10);
  leftButton: any;
  inputA: HexInput;
  inputB: HexInput;
  inputC: HexInput;
  alphaInput?: HexInput;
  colorPanel?: CanvasLayer;

  constructor(parent: Layer, options: Partial<IABCInput> = {}) {
    super(parent, options);
    this.changeValue = options.changeValue;
    this.value = options.value ?? this.setting?.getValue()

    this.inputA = new HexInput(this, {
      initialRect: { x: 0, y: 0 },
      textWidth: 13,
      maxValue: 255,
      initialValue: Math.round(this.value.a * 0xFF),
      changeValue: (v: number) => {
        this.value.a = v / 0xFF;
        this.raiseChangeValue()
        return true;
      }
    });
    this.inputB = new HexInput(this, {
      initialRect: { x: 30, y: 0 },
      textWidth: 13,
      maxValue: 255,
      initialValue: Math.round(this.value.b * 0xFF),
      changeValue: (v: number) => {
        this.value.b = v / 0xFF;
        this.raiseChangeValue()
        return true;
      }
    });
    this.inputC = new HexInput(this, {
      initialRect: { x: 60, y: 0 },
      textWidth: 13,
      maxValue: 255,
      initialValue: Math.round(this.value.c * 0xFF),
      changeValue: (v: number) => {
        this.value.c = v / 0xFF;
        this.raiseChangeValue()
        return true;
      }
    });
    this.setSize(new Size(114, 10))
    if (this.setting) {
      this.setting.observe((v) => this.setValue(v))
    }
    this.raiseChangeValue();
  }

  raiseChangeValue() {
    if (this.changeValue) this.changeValue(this.value);
  }

  setValue(newValue: IABCValue) {
    if (this.setting) this.setting.setValue(this.value);
    this.value = newValue;
    this.inputA.setValue(this.value.a);
    this.inputB.setValue(this.value.b);
    this.inputC.setValue(this.value.c);
    this.raiseChangeValue();
  }

}
