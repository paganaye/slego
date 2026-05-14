import { Tile } from './Tile.js';
import { GameScale } from './GameScale.js';

export class Piece {
  root: HTMLElement;
  worldX: number;
  worldY: number;
  tiles: any[];
  _shapeOffsets: any[] = [];
  _tileId: string = "";
  _pointer: any;
  onDrop?: (point: { x: number, y: number }) => boolean;

  /**
   * A piece is a group of tiles positioned by integer offsets,
   * centered on its own local origin (0,0) which aligns to the center of a board cell.
   * shapeOffsets: Array of {dx, dy} in tile units, e.g. plus shape:
   *   [{dx:0,dy:0},{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}]
   */
  constructor(shapeOffsets: any[], tileFactoryId = 'tile1', opts: any = {}) {
    this.shapeOffsets = shapeOffsets.map(o => ({ dx: o.dx, dy: o.dy }));
    this.tileFactoryId = tileFactoryId;
    this.root = document.createElement('div');
    this.root.className = 'piece';
    this.root.dataset.gray = opts.gray ? 'true' : 'false';

    // build tiles
    this.tiles = this.shapeOffsets.map(() => new Tile(tileFactoryId));
    for (let i = 0; i < this.tiles.length; i++) {
      const t = this.tiles[i];
      const o = this.shapeOffsets[i];
      // local position (relative to piece center) - using fixed TILE_SIZE
      const x = o.dx * GameScale.TILE_SIZE_PX;
      const y = o.dy * GameScale.TILE_SIZE_PX;
      t.setPosition(x, y);
      this.root.appendChild(t.root);
    }

    this.worldX = 0;
    this.worldY = 0;

    this._pointer = { dragging: false, offX: 0, offY: 0 };
    this._wireDrag();
  }

  setGray(v: boolean) { this.root.dataset.gray = v ? 'true' : 'false'; }

  setPosition(x: number, y: number) {
    this.worldX = x; this.worldY = y;
    this._applyTransform();
  }

  _applyTransform() {
    this.root.style.transform =
      `translate(${this.worldX}px, ${this.worldY}px) translate(-50%, -50%))`;
  }

  get shapeOffsets() { return this._shapeOffsets; }
  set shapeOffsets(v) { this._shapeOffsets = v; }

  get tileFactoryId() { return this._tileId; }
  set tileFactoryId(v) { this._tileId = v; }

  getWorldTileCenters() {
    const centers = [];
    for (const o of this.shapeOffsets) {
      const lx = o.dx * GameScale.TILE_SIZE_PX;
      const ly = o.dy * GameScale.TILE_SIZE_PX;
      centers.push({ x: this.worldX + lx, y: this.worldY + ly });
    }
    return centers;
  }

  _wireDrag() {
    // pointer events on the piece container
    this.root.style.touchAction = 'none';

    this.root.addEventListener('pointerdown', (e) => {
      this._pointer.dragging = true;
      this.root.setPointerCapture(e.pointerId);
      // offset from piece center to pointer
      this._pointer.offX = this.worldX - e.clientX;
      this._pointer.offY = this.worldY - e.clientY;
      this.root.style.zIndex = '10';
    });

    window.addEventListener('pointermove', (e) => {
      if (!this._pointer.dragging) return;
      this.setPosition(e.clientX + this._pointer.offX, e.clientY + this._pointer.offY);
    });

    window.addEventListener('pointerup', (e) => {
      if (!this._pointer.dragging) return;
      this._pointer.dragging = false;
      this.root.releasePointerCapture(e.pointerId);
      this.root.style.zIndex = '';
      // Let a board (if registered) try to place us
      if (typeof this.onDrop === 'function') {
        const placed = this.onDrop({ x: this.worldX, y: this.worldY });
        if (!placed) {
          // optional: snap back visual hint could be added here
        }
      }
    });
  }
}
