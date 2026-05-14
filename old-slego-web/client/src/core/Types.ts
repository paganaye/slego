export interface IPoint {
  readonly x: number;
  readonly y: number;
}

export class Point implements IPoint {
  static readonly Zero = new Point(0, 0)

  constructor(readonly x: number, readonly y: number) { }

  static from(pt?: Partial<IPoint>): Point {
    return new Point(pt?.x ?? 0, pt?.y ?? 0);
  }

  static roundedFrom(pt: IPoint): IPoint {
    return new Point(Math.round(pt.x), Math.round(pt.y));
  }

  static distance(pt1: IPoint, pt2: IPoint): number {
    let dx = pt2.x - pt1.x;
    let dy = pt2.y - pt1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  equals(pt?: IPoint) { return pt && this.x === pt.x && this.y === pt.y; }
}

export interface ISize {
  readonly w: number;
  readonly h: number;
}

export class Size implements ISize {
  static readonly Zero = new Size(0, 0)

  constructor(readonly w: number, readonly h: number) { }

  static from(sz?: Partial<ISize>): ISize {
    return new Size(sz?.w ?? 0, sz?.h ?? 0);
  }

  static roundedFrom(sz: ISize): IPoint {
    return new Point(Math.round(sz.w), Math.round(sz.h));
  }

  equals(sz?: ISize) { return sz && this.w === sz.w && this.h === sz.h; }

  static equals(sz1?: ISize, sz2?: ISize) {
    return sz1 === sz2 || (sz1 && sz2 && sz1.w === sz2.w && sz1.h === sz2.h)
  }
}


export interface IRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number
}

export class Rect implements IRect {
  static readonly Zero = new Rect(0, 0, 0, 0)

  constructor(readonly x: number, readonly y: number, readonly w: number, readonly h: number) { }

  get bottom(): number {
    return this.y + this.h;
  }

  get right(): number {
    return this.x + this.w;
  }
}

export function TwoDArray<T>(rows: number, cols: number, content: T): T[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => content));
}



export function forceRange(n: number, min: number, max: number) {
  if (n > max) return max;
  if (n < min) return min;
  return n;
}

export function getRectanglePoints(x: number, y: number, w: number, h: number, closing = true): IPoint[] {
  let result = [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
  if (closing) result.push({ x, y });
  return result;
}

export function mapObject<T extends Record<string, any>, U>(o: T, map: (value: T[keyof T]) => U): { [K in keyof T]: U } {
  const result: { [K in keyof T]?: U } = {};
  for (const key in o) {
    if (Object.prototype.hasOwnProperty.call(o, key)) {
      result[key as keyof T] = map(o[key]);
    }
  }
  return result as { [K in keyof T]: U };
}

export function lerp(start: number, end: number, t: number): number {
  return (1 - t) * start + t * end;
}