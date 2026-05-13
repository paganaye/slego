import { CanvasLayer } from "./CanvasLayer";
import { Colors, IRGBA } from "../core/Colors";
import { IPoint } from "../core/Types";

//-------------- Classes --------------
export interface FontCharacter {
  bits: string[];
  width: number;
}

interface IPrintLetterOptions {
  color: IRGBA, backgroundColor: IRGBA,
  spaceBefore: number, spaceAfter: number,
  spaceAbove: number, spaceBelow: number
}

interface IFontOptions {
  fallbackFont?: Font
}

export class Font {
  defaultChar: FontCharacter;
  fallbackFont?: Font;
  readonly height: number;
  readonly chars: Record<string, FontCharacter> = {};

  constructor(readonly defaultCharacter: string, readonly spaceWidth: number, lines: string[], options: Partial<IFontOptions> = {}) {
    this.height = lines.length - 1;
    this.append(lines)
    this.chars[' '] = { width: spaceWidth, bits: [] };
    this.defaultChar = this.chars[defaultCharacter];
    this.fallbackFont = options.fallbackFont;
  }

  append(lines: string[]): Font {
    let l0 = lines.shift()!;
    let idx = 0;
    while (idx < l0.length) {
      let ch = l0[idx];
      let width = 0;
      while (l0[idx + width + 1] == ' ') width++;
      let bits: string[] = [];
      for (let y = 0; y < this.height; y++) {
        let line = (lines[y] ?? "").substring(idx + 1, idx + width + 1);
        bits.push(line);
      }
      let newChar = { width, bits };
      this.chars[ch] = newChar;
      idx += width + 1;
    }
    return this;
  }

  getLetterWidth(str: string): number {
    if (str === " ") return this.spaceWidth;
    let char = this.chars[str] ?? this.defaultChar;
    return char.width ?? 0;
  }

  printLetter(layer: CanvasLayer, pos: IPoint, letter: string, options: Partial<IPrintLetterOptions>): void {
    let char = this.chars[letter]

    if (!char) {
      if (this.fallbackFont) {
        return this.fallbackFont.printLetter(layer, pos, letter, options);
      }
      char = this.defaultChar;
    }

    // if (!color) color = Colors.byLetter[letter] ?? foreColor;
    let charWidth = this.getLetterWidth(letter);
    let totalWidth = charWidth;
    totalWidth += options.spaceBefore ?? 0;
    totalWidth += options.spaceAfter ?? 0;

    let { x, y } = pos;
    let x0 = x;
    let backgroundColor = options.backgroundColor ?? layer.backgroundColor
    let color = options.color ?? layer.color

    blankLines(options.spaceAbove);
    for (let y1 = 0; y1 < this.height; y1++) {
      x = x0;
      addBackColorPixels(options.spaceBefore);
      let bits = char.bits[y1] ?? "";
      for (let x1 = 0; x1 < charWidth; x1++) {
        let bit = bits[x1];
        ({
          " ": () => addBackColorPixels(1),
          undefined: () => addBackColorPixels(1),
          "Y": () => addPixel(Colors.yellow),
          "y": () => addPixel(Colors.dark_yellow),
          "B": () => addPixel(Colors.blue),
          "b": () => addPixel(Colors.dark_blue),
          "G": () => addPixel(Colors.green),
          "g": () => addPixel(Colors.dark_green),
          "R": () => addPixel(Colors.red),
          "r": () => addPixel(Colors.dark_red),
          "O": () => addPixel(Colors.orange),
          "o": () => addPixel(Colors.dark_orange),
          "w": () => addPixel(Colors.white_ish),
          "W": () => addPixel(Colors.white)
        }[bit] || (() => addForeColorPixel()))()
      }
      addBackColorPixels(options.spaceAfter);
      y++;
    }
    blankLines(options.spaceBelow);
    layer.pixelsChanged = true;

    function addForeColorPixel() {
      layer.setPixel(x, y, color);
      x++;
    }

    function addPixel(color: IRGBA) {
      layer.setPixel(x, y, color);
      x++;
    }

    function addBackColorPixels(n: number | undefined) {
      if (!n) return
      for (let i = 0; i < n; i++) {
        layer.setPixel(x, y, backgroundColor);
        x++;
      }
    }

    function blankLines(n: number | undefined) {
      if (!n) return
      for (let i = 0; i < n; i++) {
        x = x0;
        addBackColorPixels(totalWidth);
        y++;
      }
    }

  }

}
