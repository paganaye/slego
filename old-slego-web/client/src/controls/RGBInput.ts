import { CanvasLayer, ICanvasLayerOptions } from "./CanvasLayer";
import { Size } from "../core/Types";
import { Layer } from "./Layer";
import { Setting } from "../core/Setting";
import { HexInput } from "./HexInput";
import { Colors, IRGBA } from "../core/Colors";

export interface IRGBInput extends Partial<ICanvasLayerOptions> {
  value: IRGBA,
  withAlpha?: boolean;
  changeValue?: (newValue: IRGBA) => boolean;
  valueChanged?: () => void;
}

export class RGBInput extends Layer {
  protected value: IRGBA;
  setting: Setting<any> | null | undefined;
  changeValue: ((newValue: IRGBA) => boolean) | undefined;
  fixedSize = new Size(93, 10);
  leftButton: any;
  redInput: HexInput;
  greenInput: HexInput;
  blueInput: HexInput;
  alphaInput?: HexInput;
  colorPanel?: CanvasLayer;

  constructor(parent: Layer, options: Partial<IRGBInput> = {}) {
    super(parent, options);
    this.changeValue = options.changeValue;
    this.value = this.setting?.getValue() ?? options.value ?? { r: 0, g: 0, b: 0, a: 255 };

    this.redInput = new HexInput(this, {
      initialRect: { x: 0, y: 0 },
      textWidth: 7,
      maxValue: 15,
      initialValue: Math.round(this.value.r / 0x11),
      changeValue: (v: number) => {
        this.value.r = v * 0x11;
        this.raiseChangeValue()
        return true;
      }
    });
    this.greenInput = new HexInput(this, {
      initialRect: { x: 26, y: 0 },
      maxValue: 15,
      textWidth: 7,
      initialValue: Math.round(this.value.g / 0x11),
      changeValue: (v: number) => {
        this.value.g = v * 0x11;
        this.raiseChangeValue()
        return true;
      }
    });
    this.blueInput = new HexInput(this, {
      initialRect: { x: 52, y: 0 },
      textWidth: 7,
      maxValue: 15,
      initialValue: Math.round(this.value.b / 0x11),
      changeValue: (v: number) => {
        this.value.b = v * 0x11;
        this.raiseChangeValue()
        return true;
      }
    });

    if (options.withAlpha) {
      this.alphaInput = new HexInput(this, {
        initialRect: { x: 78, y: 0 },
        textWidth: 7,
        maxValue: 15,
        initialValue: 15,
        changeValue: (v: number) => {
          this.value.a = v * 0x11;
          this.raiseChangeValue()
          return true;
        }
      })
      this.fixedSize = new Size(this.fixedSize.w + 32, this.fixedSize.h);
    }
    if (true) {
      this.colorPanel = new CanvasLayer(this, {
        initialRect: { x: 78 + (options.withAlpha ? 26 : 0), y: 0, w: 10, h: 10 },
        backgroundColor: Colors.red
      })
    }
    if (this.setting) {
      this.setting.observe((v) => this.setValue(v))
    }
    this.setSize(new Size(options.withAlpha ? 114 : 88, 10))
    this.changeColor();
  }

  raiseChangeValue() {
    if (this.setting) this.setting.setValue(this.value);
    this.changeColor();
  }

  setValue(newValue: IRGBA) {
    this.value = newValue;
    this.changeColor();
  }

  changeColor() {
    if (this.colorPanel) {
      this.colorPanel.backgroundColor = this.value;
      this.colorPanel.invalidate()
    }
  }
}
