import { CanvasLayer, ICanvasLayerOptions } from "./controls/CanvasLayer";
import { TilePainter } from "./TilePainter";
import { GameScreen } from "./screens/GameScreen";
import { App } from "./controls/App";
import { Colors } from "./core/Colors";
import { IAnts, Layer } from "./controls/Layer";
import { IHand, PlayPosition, IPlayPosition } from "./core/BoardTiles";
import { DURATIONS } from "./core/IAnimation";
import { IPoint, Size } from "./core/Types";

export class Cross extends CanvasLayer {
  tileDrawer: TilePainter;
  gridSize: number;
  currentDraw?: IHand | null;
  playPosition: PlayPosition | null = null;
  antLines: IPoint[] = [];

  constructor(parent: Layer, options: Partial<ICanvasLayerOptions> = {}) {
    super(parent, { ...options, focusable: true });
    this.tileDrawer = new TilePainter(this.font, this, 1, 1);
    this.gridSize = this.tileDrawer.gridSize;
  }

  drawHand(newDraw: IHand | null) {
    this.clear();
    this.currentDraw = newDraw;
    if (newDraw) {
      this.tileDrawer.drawTile(1, 0, newDraw.top, 2, 1);
      this.tileDrawer.drawTile(0, 1, newDraw.left, 1, 2);
      this.tileDrawer.drawTile(1, 1, newDraw.center, 2, 2, true);
      this.tileDrawer.drawTile(2, 1, newDraw.right, 3, 2);
      this.tileDrawer.drawTile(1, 2, newDraw.bottom, 2, 3);
      this.calcAnts();
      this.drawAntLines(this.antLines, { color: Colors.semi_white })
    } else {
      this.antLines = [];
    }
    let calculatedSize = this.gridSize * 3 + 6;
    super.setSize(new Size(calculatedSize, calculatedSize));
  }
  
  onTick(): void {
    super.onTick();
  }

  calcAnts() {
    let draw = this.currentDraw;
    if (!draw) return;
    let b0 = 0;
    let b1 = this.gridSize;
    let b2 = this.gridSize + 1;
    let b3 = this.gridSize * 2 + 4;
    let b4 = this.gridSize * 2 + 5;
    let b5 = this.gridSize * 3 + 5;
    let lines = [];
    lines.push({ x: b1, y: b1 });
    if (draw.top) lines.push({ x: b2, y: b1 }, { x: b2, y: b0 }, { x: b3, y: b0 }, { x: b3, y: b1 });
    lines.push({ x: b4, y: b1 });
    if (draw.right) lines.push({ x: b4, y: b2 }, { x: b5, y: b2 }, { x: b5, y: b3 }, { x: b4, y: b3 });
    lines.push({ x: b4, y: b4 });
    if (draw.bottom) lines.push({ x: b3, y: b4 }, { x: b3, y: b5 }, { x: b2, y: b5 }, { x: b2, y: b4 });
    lines.push({ x: b1, y: b4 });
    if (draw.left) lines.push({ x: b1, y: b3 }, { x: b0, y: b3 }, { x: b0, y: b2 }, { x: b1, y: b2 });
    lines.push({ x: b1, y: b1 });
    this.antLines = lines;
  }

  getAnts(): IAnts {

    if (this.currentDraw) return [{ points: this.antLines, color: this.playPosition == null ? Colors.orange : undefined }];
    else return [];
  }

  async moveToPlayPosition(playPosition: IPlayPosition | null, options: { animate?: number | number, init?: boolean }) {
    if (!options.init) {
      if ((this.playPosition == null && playPosition == null)
        || this.playPosition && this.playPosition.equals(playPosition)) return;
    }
    this.playPosition = playPosition ? PlayPosition.from(playPosition) : null;
    if (playPosition) {
      let boardLayer = GameScreen.instance.boardLayer;
      let tileSize = boardLayer.tileSize;
      let { x, y } = boardLayer.position;
      await this.moveTo({
        x: (playPosition.tx - 1) * tileSize + x - 1,
        y: (playPosition.ty - 1) * tileSize + y - 1
      }, options.animate ?? 0);
    } else {
      await this.moveTo(GameScreen.instance.crossLanding, options.animate ?? 0);
    }
  }

  moveCenterTo(pt: IPoint) {
    this.playPosition = null;
    let newPoint = {
      x: pt.x - this.gridSize * 1.5 - 3,
      y: pt.y - this.gridSize * 1.5 - 3
    };
    this.moveTo(newPoint, 0)
  }


  moveTo(pos: IPoint, animate: number): Promise<void> {
    return super.moveTo(pos, animate);
  }

  onPaint(): void {
    if (this.currentDraw) this.drawHand(this.currentDraw);
  }

  onKeyPress(key: string): boolean {
    let landscape = App.instance.landscape_mode;
    let move = (dx: number, dy: number) => {
      let newPos: IPlayPosition | undefined;
      let tx: number, ty: number;
      if (this.playPosition) {
        tx = this.playPosition.tx + dx;
        ty = this.playPosition.ty + dy;
        newPos = { tx, ty };
      } else {
        if (landscape) {
          if (dx == -1) newPos = { tx: 4, ty: 2 };
        } else {
          if (dy == -1) newPos = { tx: 2, ty: 4 };
        }
      }
      if (newPos) {
        if (newPos.tx == 5 && landscape || newPos.ty == 5 && !landscape) {
          this.moveToPlayPosition(null, { animate: DURATIONS.MOVE_CROSS_WITH_KEYBOARD });
          return true;
        }
        else if (newPos.tx >= 0 && newPos.tx < 5 && newPos.ty >= 0 && newPos.ty < 5) {
          this.moveToPlayPosition(newPos, { animate: DURATIONS.MOVE_CROSS_WITH_KEYBOARD })
          return true;
        }
      }
      return super.onKeyPress(key);
    }

    switch (key) {
      case "ArrowLeft":
        return move(- 1, 0)
      case "ArrowRight":
        return move(+ 1, 0)
      case "ArrowUp":
        return move(0, -1)
      case "ArrowDown":
        return move(0, +1)
      case "Enter":
        if (this.playPosition) {
          GameScreen.instance.playCross(this.playPosition);
          return true;
        }
        break;
    }
    return super.onKeyPress(key);
  }
}
