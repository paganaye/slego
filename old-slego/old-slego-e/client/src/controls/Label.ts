import { DURATIONS } from "../core/IAnimation";
import { ISize } from "../core/Types";
import { CanvasLayer, ICanvasLayerOptions } from "./CanvasLayer";
import { Layer } from "./Layer";

export interface ILabelOptions extends Partial<ICanvasLayerOptions> {
  control?: Layer
}

export class Label extends CanvasLayer {
  control?: Layer;
  // protected value = 1;
  // leftButton: Button;
  // minValue: number;
  // maxValue: number;
  // leftButtonText: string;
  // rightButtonText: string;
  // textWidth: number;
  // step: number;
  // setting: Setting<any> | null | undefined;
  // changeValue: ((newValue: number) => boolean) | undefined;
  // rightButton: Button;
  // static separator = 1;
  // buttonTotalWidth: number;
  // calculatedSize: Size;
  constructor(parent: Layer, readonly text: string, options: Partial<ILabelOptions> = {}) {
    super(parent, options);
    this.control = options.control;
    if (this.control) this.setSize({ w: parent.width, h: this.control.height })
  }

  onParentSizeChanged(_size: ISize): void {
  }

  onSizeChanged(): void {
    super.onSizeChanged()
    if (this.control) {
      let { x, y, w } = this.parent!.targetRect;
      this.control.moveTo({ x: x + w - this.control.width, y: y }, DURATIONS.LAYOUT_CHANGE)
    }
  }

  onPaint(): void {
    this.print(0, 0, this.text)
  }

  
}
