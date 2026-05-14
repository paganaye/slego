import { Colors, IRGBA } from "../core/Colors";
import { Font } from "./Font";
import { Fonts } from "../Fonts";
import { IAntPath, ILayerOptions, Layer } from "./Layer";
import { IPoint, Point } from "../core/Types";

export interface ICanvasLayerOptions extends ILayerOptions {
  backgroundColor: IRGBA;
  color: IRGBA;
  font: Font;
}

export interface IPrintOptions {
  maxWidth?: number,
  alignRight?: boolean
  color?: IRGBA,
  backgroundColor?: IRGBA,
  font?: Font
  spaceBefore?: number, spaceBetween?: number, spaceAfter?: number,
  spaceAbove?: number, spaceBelow?: number
}

interface IMeasuredWidth {
  width: number;
  charCount: number;
  overflow: boolean;
  hardBreak?: boolean;
}

export interface ICircleOptions {
  color?: IRGBA;
  color2?: IRGBA
  sectionMin?: number;
  sectionMax?: number;
}

export interface ILineOptions {
  color?: IRGBA;
}

export class CanvasLayer extends Layer {
  private canvasElt: HTMLCanvasElement = document.createElement("canvas");
  private _paintRequired: boolean = true;

  ctx: CanvasRenderingContext2D;
  dataArray!: Uint8ClampedArray;
  imgData!: ImageData;
  pixelsChanged = false;
  private _paintOffset: IPoint = new Point(0, 0);
  backgroundColor: IRGBA;
  color: IRGBA;
  font: Font;
  pixelNo: number = 0;

  constructor(parent: Layer, options: Partial<ICanvasLayerOptions> = {}) {
    super(parent, options);
    this.ctx = this.canvasElt.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = false;
    this.canvasElt.style.position = "absolute";
    this._layerElement.style.imageRendering = "pixelated";
    this._layerElement.appendChild(this.canvasElt);

    this.font = options.font ?? (parent as CanvasLayer).font ?? Fonts.defaultFont;
    this.backgroundColor = options.backgroundColor ?? (parent as CanvasLayer).backgroundColor ?? Colors.transparent;
    this.color = options.color = options.color ?? (parent as CanvasLayer).color ?? Colors.white_ish;
  }

  withOffset(point: IPoint, action: () => void) {
    let originalPointOffset = this._paintOffset;
    try {
      this._paintOffset = Point.roundedFrom({
        x: this._paintOffset.x + point.x,
        y: this._paintOffset.y + point.y
      });
      action();
    } finally {
      this._paintOffset = originalPointOffset
    }
  }

  addElement(elt: HTMLElement) {
    this._layerElement.appendChild(elt);
    //this.parent._addElement(elt);
  }

  onPaint(): void { }

  onAnimationFrame(): void {
    if (this._paintRequired) {
      this._paintRequired = false;
      this.clear();
      this.onPaint();
    }
    if (this.pixelsChanged && this.imgData) {
      this.ctx.putImageData(this.imgData, 0, 0);
      this.pixelsChanged = false;
    }
  }

  protected _onSizeChanged() {
    let { w, h } = this.size;
    this.canvasElt.width = w;
    this.canvasElt.height = h;
    if (w == 0) w = 1;
    if (h == 0) h = 1;
    this.dataArray = new Uint8ClampedArray(w * h * 4);
    this.imgData = new ImageData(this.dataArray, w, h);
    super._onSizeChanged()
    this.invalidate()
  }

  invalidate() {
    this._paintRequired = true;
  }

  setPixel(x: number, y: number, color: IRGBA) {
    x = (x + this._paintOffset.x) | 0;
    y = (y + this._paintOffset.y) | 0;
    // if (!this.dataArray) debugger;
    if (x < 0 || x >= this.size.w || y < 0 || y >= this.size.h || !this.dataArray) return;
    let idx = (y * this.size.w + x) * 4;
    this.dataArray[idx] = color.r | 0; // Red
    this.dataArray[idx + 1] = color.g | 0;
    this.dataArray[idx + 2] = color.b | 0;
    this.dataArray[idx + 3] = color.a | 0;
  }

  rectangle(x0: number, y0: any, w: any, h: any, color: IRGBA) {
    let x1 = x0 + w - 1;
    let y1 = y0 + h - 1;
    for (let y = y0; y <= y1; y++) {
      this.setPixel(x0, y, color);
      this.setPixel(x1, y, color);
    }
    for (let x = x0 + 1; x < x1; x++) {
      this.setPixel(x, y0, color);
      this.setPixel(x, y1, color);
    }
    this.pixelsChanged = true;
  }

  fillRectangle(x1: number, y1: number, w: number, h: number, color: IRGBA) {
    let x2 = x1 + w;
    let y2 = y1 + h;
    for (let y = y1; y < y2; y++) {
      for (let x = x1; x < x2; x++) {
        this.setPixel(x, y, color);
      }
    }
    this.pixelsChanged = true;
  }

  clear(color: IRGBA = this.backgroundColor) {
    this.fillRectangle(0, 0, this.size.w, this.size.h, color);
  }

  measureStringWidth(str: string, options: IPrintOptions = {}): IMeasuredWidth {
    let width = options.spaceBefore ?? 0;
    let firstChar = true;
    let font = options.font ?? Fonts.defaultFont;
    let spaceBetween = options.spaceBetween ?? 1;
    let charCount = 0;
    let lastFittingResult: IMeasuredWidth | undefined;
    let hasMaxWidth = options.maxWidth !== undefined;
    for (let letter of str) {
      let charWidth = font.getLetterWidth(letter);
      if (hasMaxWidth && (letter == ' ' || letter == '-')) {
        lastFittingResult = { charCount, overflow: true, width: width + (options.spaceAfter ?? 0) };
      }
      else if (hasMaxWidth && width + charWidth + (firstChar ? 0 : spaceBetween) + (options.spaceAfter ?? 0) > options.maxWidth!!) {
        if (lastFittingResult) return lastFittingResult;
        else {
          // we can't split at a space or a dash we'are going to split midword
          width += options.spaceAfter ?? 0
          return { overflow: true, charCount: charCount, width, hardBreak: true }
        }
      }
      if (firstChar) firstChar = false;
      else width += spaceBetween;
      width += charWidth;
      charCount += 1;
    }
    width += options.spaceAfter ?? 0
    return { overflow: false, charCount: charCount, width }
  }

  getFontHeight(printOptions: IPrintOptions): number {
    let font = printOptions.font ?? Fonts.defaultFont;
    let result = (printOptions.spaceAbove ?? 0)
      + font.height
      + (printOptions.spaceBelow ?? 0);
    return result;
  }

  print(x0: number, y0: number, str: string,
    options: IPrintOptions = {}) {

    let { maxWidth, color, backgroundColor, font } = options;
    if (!color) color = this.color;
    if (!backgroundColor) backgroundColor = this.backgroundColor;
    if (!font) font = this.font;

    if (options.alignRight) {
      let stringWidth = this.measureStringWidth(str, options).width;
      x0 -= stringWidth;

    }
    let x = 0, y = 0;
    let len = str.length;
    let letterOptions = { color, backgroundColor, spaceBefore: 0, spaceAfter: 0, spaceAbove: options.spaceAbove, spaceBelow: options.spaceBelow };
    for (let idx = 0; idx < len; idx++) {
      let l = str[idx];
      let firstChar = idx == 0;
      let lastChar = idx == len - 1;

      let width = font.getLetterWidth(l);
      if (maxWidth && x + width > maxWidth) {
        break;
      }
      letterOptions.spaceBefore = firstChar ? (options.spaceBefore ?? 0) : (options.spaceBetween ?? 1);
      letterOptions.spaceAfter = lastChar ? (options.spaceAfter ?? 0) : 0;
      font.printLetter(this, { x: x0 + x, y: y0 + y }, l, letterOptions);
      x += letterOptions.spaceBefore + width + letterOptions.spaceAfter;
    }
  }


  drawCircle(pointA: IPoint, radius: number, options: ICircleOptions = {}) {
    const color = options.color ?? Colors.black_ish;
    const sectionMin = options.sectionMin ?? 0;
    const sectionMax = options.sectionMax ?? 7;
    let { x: cx, y: cy } = pointA;

    const drawSymmetricPixels = (dx: number, dy: number) => {
      if (sectionMin <= 0 && sectionMax >= 0) this.setPixel(cx + dx, cy - dy, color);
      if (sectionMin <= 1 && sectionMax >= 1) this.setPixel(cx + dy, cy - dx, color);
      if (sectionMin <= 2 && sectionMax >= 2) this.setPixel(cx + dy, cy + dx, color);
      if (sectionMin <= 3 && sectionMax >= 3) this.setPixel(cx + dx, cy + dy, color);
      if (sectionMin <= 4 && sectionMax >= 4) this.setPixel(cx - dx, cy + dy, color);
      if (sectionMin <= 5 && sectionMax >= 5) this.setPixel(cx - dy, cy + dx, color);
      if (sectionMin <= 6 && sectionMax >= 6) this.setPixel(cx - dy, cy - dx, color);
      if (sectionMin <= 7 && sectionMax >= 7) this.setPixel(cx - dx, cy - dy, color);
    };
    drawSymmetricPixels(radius, 0);
    let dy = radius;
    let p = 1 - radius;
    for (let dx = 1; dx <= radius; dx++) {
      if (p > 0) {
        dy--;
        p -= 2 * dy;
      }
      p += 2 * dx + 1;
      if (dy < dx) break;
      drawSymmetricPixels(dx, dy);
    }
    this.pixelsChanged = true;
  }

  drawLine(pointA: IPoint, pointB: IPoint, options: ILineOptions = {}) {
    let x = pointA.x;
    let y = pointA.y;
    let x2 = pointB.x;
    let y2 = pointB.y;

    const dx = Math.abs(x2 - x);
    const dy = Math.abs(y2 - y);
    const sx = (x < x2) ? 1 : -1;
    const sy = (y < y2) ? 1 : -1;
    let error = dx - dy;
    let color = options.color ?? Colors.black_ish;

    while (true) {
      this.setPixel(x, y, color);
      if (x === x2 && y === y2) {
        break;
      }

      const error2 = 2 * error;
      if (error2 > -dy) {
        error -= dy;
        x += sx;
      }
      if (error2 < dx) {
        error += dx;
        y += sy;
      }
    }
    this.pixelsChanged = true;
  }

  drawAntPath(path: IAntPath) {
    this.initPixelNo()
    this.drawAntLines(path.points, { dotted: true, close: path.close, color: path.color })
  }

  initPixelNo() {
    this.pixelNo = 8 - (this.app.tickNo.getValue() % 8);
  }

  getAntColor(color: IRGBA, color2: IRGBA): IRGBA {
    return (this.pixelNo % 8 < 4) ? color : color2
  }

  getAntColor2(color: IRGBA, color2: IRGBA): IRGBA {
    return ((8 - (this.pixelNo % 8)) < 4) ? color : color2
  }

  drawAntLines(lines: IPoint[] | null, options: { close?: boolean, dotted?: boolean, color?: IRGBA, color2?: IRGBA } = {}) {
    let len = lines?.length ?? 0;
    if (!len) return
    if (options.close) lines!.push(lines![0])
    let color = options.color ?? Colors.semi_white; //  Colors.semi_white;
    let color2 = options.color2 ?? Colors.semi_black; //.semi_black;
    if (!options.dotted) color2 = color;
    let drawAntLine = (pointA: IPoint, pointB: IPoint) => {
      let x = Math.round(pointA.x);
      let y = Math.round(pointA.y);
      let x2 = Math.round(pointB.x);
      let y2 = Math.round(pointB.y);
      const dx = Math.abs(x2 - x);
      const dy = Math.abs(y2 - y);
      const sx = (x < x2) ? 1 : -1;
      const sy = (y < y2) ? 1 : -1;
      let error = dx - dy;

      while (x !== x2 || y !== y2) {
        const error2 = 2 * error;
        if (error2 > -dy) {
          error -= dy;
          x += sx;
        }
        if (error2 < dx) {
          error += dx;
          y += sy;
        }
        this.pixelNo += 1;
        this.setPixel(x, y, this.getAntColor(color, color2));
      }
    }
    for (let i = 0; i < len - 1; i++) {
      drawAntLine(lines![i], lines![i + 1]);
    }
    this.pixelsChanged = true;
  }
}


