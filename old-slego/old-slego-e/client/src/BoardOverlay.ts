import { CanvasLayer, ICanvasLayerOptions } from "./controls/CanvasLayer";
import { TilePainter } from "./TilePainter";
import { IPoint, Size, getRectanglePoints } from "./core/Types";
import { BoardTiles, emptyBoardTiles } from "./core/BoardTiles";
import { Round } from "./core/Round";
import { IAnts, Layer } from "./controls/Layer";
import { IPointsLine } from "./RoundPoints";

export class BoardOverlay extends CanvasLayer {
  tileDrawer: TilePainter;
  tileSize: number;
  currentTiles: BoardTiles;
  round?: Round;
  antLines: IAnts = [];
  // not focusable but still show ants 

  constructor(parent: Layer, options: Partial<ICanvasLayerOptions> = {}) {
    super(parent, options);
    this.tileDrawer = new TilePainter(this.font, this, 2, 2);
    this.tileSize = this.tileDrawer.gridSize;
    this.currentTiles = emptyBoardTiles();
    let calculatedSize = this.tileSize * 5 + 4;
    super.setSize(new Size(calculatedSize, calculatedSize));
  }

  getAnts(): IAnts {
    return this.antLines;
  }

  clearRoundLinesTiles(round: Round) {
    this.clear();
    this.round = round;
    this.antLines.length = 0
  }

  drawRoundLinesTiles(round: Round) {
    this.clearRoundLinesTiles(round);
    for (let i = 0; i < round.roundPoints.lines.length; i++) {
      let pointsLine = round.roundPoints.lines[i];
      let intermediaryBoard = round.getIntermediaryBoard();
      this.drawRoundLineTiles(intermediaryBoard, pointsLine);
    }
  }

  drawRoundLineTiles(boardTiles: BoardTiles, pointsLine: IPointsLine) {
    let tileSize = this.tileSize;
    const { x, y, count, vertical } = pointsLine;
    let newLines: IPoint[] = [];
    if (vertical) {
      newLines.push(...getRectanglePoints(x * tileSize, y * tileSize, tileSize + 3, count * tileSize + 3));
      for (let i = 0; i < count; i++) {
        this.tileDrawer.drawBoardTile(boardTiles, x, y + i);
      }
    }
    else {
      newLines.push(...getRectanglePoints(x * tileSize, y * tileSize, count * tileSize + 3, tileSize + 3));
      for (let i = 0; i < count; i++) {
        this.tileDrawer.drawBoardTile(boardTiles, x + i, y);
      }
    }
    this.antLines.push({ points: newLines });
  }

  onTick(): void {
    this.antLines.forEach(a => this.drawAntPath(a));

  }

  onPaint(): void {
    if (this.round) this.drawRoundLinesTiles(this.round);
  }
}

