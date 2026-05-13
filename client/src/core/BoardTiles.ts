import { TwoDArray } from "./Types";

export type TileType = "□" | "○" | "△" | "✕" | "·"

export type BoardTiles = TileType[][];

export function emptyBoardTiles(): BoardTiles {
  return TwoDArray(5, 5, '·')
}

export function placeCross(newBoard: BoardTiles, covered: IPlayPosition[], hand: IHand | undefined, playPosition: IPlayPosition | undefined) {
  if (!hand || !playPosition) return
  let { tx, ty } = playPosition!;
  function placeTile(type: TileType | undefined, dx: number, dy: number) {
    if (!type || type == '·') return
    let tx2 = tx + dx;
    let ty2 = ty + dy;
    if (tx2 >= 0 && tx2 < 5 && ty2 >= 0 && ty2 < 5 && newBoard[ty2][tx2] != '·') {
      covered.push({ tx: tx2, ty: ty2 })
    }
    if (tx2 >= 0 && tx2 < 5 && ty2 >= 0 && ty2 < 5) newBoard[ty2][tx2] = type;
  }
  placeTile(hand.top, 0, -1)
  placeTile(hand.left, -1, 0)
  placeTile(hand.center, 0, 0)
  placeTile(hand.right, 1, 0)
  placeTile(hand.bottom, 0, 1)

}

export function copyBoard(previousBoard: BoardTiles): BoardTiles {
  return previousBoard.map(row => row.slice());
}

export class PlayPosition implements IPlayPosition {

  constructor(readonly tx: number, readonly ty: number) { }

  static from(pt: IPlayPosition): PlayPosition {
    return new PlayPosition(pt.tx ?? 0, pt.ty ?? 0);
  }

  static isValid(playPos: IPlayPosition): boolean {
    return (playPos.tx >= 0 && playPos.tx < 5
      && playPos.ty >= 0 && playPos.ty < 5);
  }

  static floor(playPos: PlayPosition): PlayPosition {
    return new PlayPosition(
      Math.floor(playPos.tx),
      Math.floor(playPos.ty));
  }

  floor() {
    return PlayPosition.floor(this);
  }

  isValid() {
    return PlayPosition.isValid(this);
  }


  equals(pt?: IPlayPosition | null) { return pt && this.tx === pt.tx && this.ty === pt.ty; }
}
export interface IPlayPosition {
  tx: number
  ty: number
}

export interface IHand {
  top?: TileType | undefined
  left?: TileType | undefined
  center: TileType | undefined
  right?: TileType | undefined
  bottom?: TileType | undefined
}
export class Hand implements IHand {
  constructor(readonly top: TileType | undefined,
    readonly left: TileType | undefined,
    readonly center: TileType | undefined,
    readonly right: TileType | undefined,
    readonly bottom: TileType | undefined) { }
}

