import { Size } from "../core/Types";
import { CanvasLayer, ICanvasLayerOptions } from "./CanvasLayer";
import { Layer } from "./Layer";

export interface IDynamicTextOptions extends Partial<ICanvasLayerOptions> {
  changeValue?: (newValue: string) => boolean;
  initialValue?: string;
}

export class DynamicText extends CanvasLayer {
  calculatedSize: Size;
  private value: string = "";

  constructor(parent: Layer, options: Partial<IDynamicTextOptions> = {}) {
    super(parent, { ...options });
    this.calculatedSize = new Size(
      120,
      11);
    super.setSize(this.calculatedSize);
    this.refreshText();
  }

  refreshText() {
    this.print(0, 0, this.value);
  }

  getText(): string {
    return this.value.toString();
  }


  setValue(newValue: string) {
    this.value = newValue;
    this.refreshText();
  }


}
