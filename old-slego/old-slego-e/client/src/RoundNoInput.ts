import { INumericInputOptions, NumericInput } from "./controls/NumericInput";
import { Layer } from "./controls/Layer";
import { GameScreen } from "./screens/GameScreen";

export class RoundNoInput extends NumericInput {

  constructor(parent: Layer, options: Partial<INumericInputOptions>) {
    super(parent, {
      ...options,
      minValue: 1,
      maxValue: 40,
      changeValue: (v: number) => {
        GameScreen.instance.setCurrentRoundNo(v - 1);
        return true;
      }
    })
    // this.gameScreen = (parent.screenMainLayer as GameScreen);
  }

  init() {
    this.maxValue = (this.screen as any)?.state?.nbRounds + 1;
  }

  getText() {
    if (this.value == this.maxValue) {
      return "End";
    } else {
      return super.getText();
    }
  }

}
