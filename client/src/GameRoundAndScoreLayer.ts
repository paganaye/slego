import { Colors } from "./core/Colors";
import { CanvasLayer, ICanvasLayerOptions } from "./controls/CanvasLayer";
import { GameScreen } from "./screens/GameScreen";
import { RoundNoInput } from "./RoundNoInput";
import { Size } from "./core/Types";
import { Layer } from "./controls/Layer";

export class GameRoundAndScore extends CanvasLayer {
  roundNoInput: RoundNoInput;

  constructor(parent: Layer, options: Partial<ICanvasLayerOptions> = {}) {
    super(parent, options);
    this.roundNoInput = new RoundNoInput(this, { initialRect: { x: 42, y: 0 } });
    super.setSize(new Size(90, 24));
  }

  onPaint() {
    this.clear();
    this.print(11, 4, "Round", { color: Colors.semi_white });
    this.drawRoundAndScore();
    this.print(11, 15, "Score", { color: Colors.semi_white });
  }

  init() {
    this.roundNoInput.init();
  }

  drawRoundAndScore() {
    let score = GameScreen.instance.currentRound?.previousRound?.newGameScore ?? 0;
    this.roundNoInput.setValue(GameScreen.instance.state.currentRoundNo + 1);
    this.print(80, 15, score.toString().padStart(3, " ") + "◉", { alignRight: true, color: Colors.white_ish });
  }



}
