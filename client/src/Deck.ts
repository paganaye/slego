import { CanvasLayer, ICanvasLayerOptions } from "./controls/CanvasLayer";
import { Colors } from "./core/Colors";
import { GameScreen } from "./screens/GameScreen";
import { Layer } from "./controls/Layer";
import { IHand, TileType } from "./core/BoardTiles";

export class Deck extends CanvasLayer {

  constructor(parent: Layer, options: Partial<ICanvasLayerOptions> = {}) {
    super(parent, options);
  }

  onPaint(): void {
    this.drawRounds()
  }

  drawRounds() {
    let gameState = GameScreen.instance?.state;
    if (gameState) {
      let rounds = gameState.rounds;
      let expectedRows = Math.ceil(gameState.nbRounds / Math.floor(this.size.w / 5));
      let x = 0, y = this.size.h - expectedRows * 5;

      for (let i = 0; i < rounds.length; i++) {
        let round = rounds[i];
        if (!round.draw) continue;
        this.drawTinyCross(x + 1, y + 1, round.draw);
        x += 5;
        if (x + 5 > this.size.w) {
          x = 0;
          y += 5;
        }
      }
    }
  }

  drawTinyCross(x: number, y: number, hand?: IHand) {
    if (!hand) return
    this.fillRectangle(x, y, 3, 3, this.backgroundColor);
    this.drawSmallTile(x + 1, y, hand.top);
    this.drawSmallTile(x, y + 1, hand.left);
    this.drawSmallTile(x + 1, y + 1, hand.center);
    this.drawSmallTile(x + 2, y + 1, hand.right);
    this.drawSmallTile(x + 1, y + 2, hand.bottom);
  }

  drawSmallTile(x: number, y: number, tile: TileType | undefined) {
    if (tile) this.setPixel(x, y, Colors.byLetter[tile!]!);
  }  

}
