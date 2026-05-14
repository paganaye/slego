import { Layer } from "./Layer";
import { INumericInputOptions, NumericInput } from "./NumericInput";

export interface IHexInputOptions extends Partial<INumericInputOptions> {
}

export class HexInput extends NumericInput {
  constructor(parent: Layer, options: Partial<INumericInputOptions> = {}) {
    super(parent, options)
  }

  getText(): string {
    return this.value.toString(16);
  }  
  
}