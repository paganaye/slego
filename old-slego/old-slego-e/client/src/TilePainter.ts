import { Colors, IRGBA } from "./core/Colors";
import { Font } from "./controls/Font";
import { CanvasLayer } from "./controls/CanvasLayer";
import { BoardTiles, TileType } from "./core/BoardTiles";

export class TilePainter {
  gridSize: number;
  constructor(readonly font: Font, readonly layer: CanvasLayer, readonly xOffset: number = 0, readonly yOffset: number = 0) {
    this.gridSize = font.height + 2;
  }

  static tileTypeMappings: Record<TileType, { char: string, bgColor: IRGBA, fgColor: IRGBA }> = {
    '·': { char: '·', bgColor: Colors.white_ish, fgColor: Colors.light_gray },
    '□': { char: '□', bgColor: Colors.dark_green, fgColor: Colors.green },
    '△': { char: '△', bgColor: Colors.dark_yellow, fgColor: Colors.yellow },
    '○': { char: '○', bgColor: Colors.dark_red, fgColor: Colors.red },
    '✕': { char: '✕', bgColor: Colors.dark_blue, fgColor: Colors.blue },
  };

  drawTile(tx: number, ty: number, tileType: TileType | undefined, dx: number = 0, dy: number = 0, extraRectangle: boolean = false) {
    let px = tx * this.gridSize + this.xOffset + dx;
    let py = ty * this.gridSize + this.yOffset + dy;


    if (tileType) {
      const { char, bgColor: backColor, fgColor: foreColor } = TilePainter.tileTypeMappings[tileType];
      this.font.printLetter(this.layer, { x: px, y: py }, char, {
        backgroundColor: backColor, color: foreColor,
        spaceAbove: 1, spaceBelow: 1,
        spaceBefore: 1, spaceAfter: 1
      });
      if (extraRectangle) {
        this.layer.rectangle(px - 1, py - 1, this.gridSize + 2, this.gridSize + 2, foreColor);
      }
    } else {
      this.layer.fillRectangle(px, py, this.gridSize, this.gridSize, Colors.transparent);
    }

  }

  eraseBoardTile(tx: number, ty: number) {
    this.drawTile(tx, ty, "·");
  }

  drawBoardTile(tiles: BoardTiles, tx: number, ty: number) {
    let tile = tiles[ty][tx];
    this.drawTile(tx, ty, tile);
  }
}
