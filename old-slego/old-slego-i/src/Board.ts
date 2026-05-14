import { CanvasLayer, ICanvasLayerOptions } from "./controls/CanvasLayer";
import { TilePainter } from "./TilePainter";
import { IPoint, Size, getRectanglePoints } from "./core/Types";
import { BoardTiles, emptyBoardTiles } from "./core/BoardTiles";
import { Layer } from "./controls/Layer";
import { IPointsLine } from "./RoundPoints";

export class Board extends CanvasLayer {
  tileDrawer: TilePainter;
  tileSize: number;
  currentTiles: BoardTiles;

  constructor(parent: Layer, options: Partial<ICanvasLayerOptions> = {}) {
    super(parent, options);
    this.tileDrawer = new TilePainter(this.font, this, 2, 2);
    this.tileSize = this.tileDrawer.gridSize;
    this.currentTiles = emptyBoardTiles();
    let calculatedSize = this.tileDrawer.gridSize * 5 + 4;
    super.setSize(new Size(calculatedSize, calculatedSize));
  }

  drawBoard(tiles: BoardTiles) {
    this.currentTiles = tiles;
    if (!tiles) {
      this.clear()
      return;
    }
    for (let y = 0; y < 5; y++) {
      let row = tiles[y] ?? [];
      for (let x = 0; x < 5; x++) {
        let tileType = row[x] ?? "·";
        this.tileDrawer.drawTile(x, y, tileType);
      }
    }
  }


  onPaint(): void {
    if (this.currentTiles) this.drawBoard(this.currentTiles);
  }

  eraseRoundLineTiles(pointsLine: IPointsLine) {
    let tileSize = this.tileSize;
    const { x, y, count, vertical } = pointsLine;
    let newLines: IPoint[] = [];
    if (vertical) {
      newLines.push(...getRectanglePoints(x * tileSize - 1, y * tileSize - 1, tileSize + 3, count * tileSize + 3));
      for (let i = 0; i < count; i++) {
        this.tileDrawer.eraseBoardTile(x, y + i);
      }
    }
    else {
      newLines.push(...getRectanglePoints(x * tileSize - 1, y * tileSize - 1, count * tileSize + 3, tileSize + 3));
      for (let i = 0; i < count; i++) {
        this.tileDrawer.eraseBoardTile(x + i, y);
      }
    }
  }


}

