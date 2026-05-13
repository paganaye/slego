import { CanvasLayer } from "../controls/CanvasLayer";
import { IPoint, ISize } from "./Types";
import { Font } from "../controls/Font";
import { Layer } from "../controls/Layer";
import { Fonts } from "../Fonts";
import { IRGBA } from "./Colors";
import { DURATIONS } from "./IAnimation";

export interface ITextSpan {
  text: string;
  color?: IRGBA;
  backgroundColor?: IRGBA;
  font?: Font;
  spaceBefore?: number, spaceBetween?: number, spaceAfter?: number;
  spaceAbove?: number, spaceBelow?: number;
}

export interface IDiv {
  spans: ISpan[]
  align?: Align;
}

export type Align = "left" | "center" | "right" | "justify";

export interface ILayerSpan {
  layer: Layer
  alignRight?: boolean;
}

export type ISpan = (ITextSpan | ILayerSpan);

export type PrintedLine = ISpan & {
  x: number;
  y: number;
  w: number;
  h: number;
  columNo: number;
}



export class FlowLayout {
  pageCount!: number;
  spaceBetweenColumns = 2
  spaceBetweenSections: number = 0;

  private divs: IDiv[] = [];
  private printedLines: PrintedLine[] = [];
  private y!: number;
  private columnNo!: number;
  private width!: number;
  private columnWidth!: number;
  private height!: number;
  private _columnCount = 1;

  constructor(readonly canvasLayer: CanvasLayer, size: ISize) {
    this.printedLines = [];
    this.setSize(size)
    this.clearSections();
  }

  setSize(size: ISize) {
    this.width = size.w;
    this.height = size.h;
    this._recalcColumnWidth();
  }

  setColumnCount(columnCount: number) {
    this._columnCount = columnCount;
    this._recalcColumnWidth();
  }

  private _recalcColumnWidth() {
    if (this._columnCount > 1) {
      this.columnWidth = Math.floor(this.width - (this._columnCount - 1) * this.spaceBetweenColumns) / this._columnCount;
    } else {
      this.columnWidth = this.width;
    }
  }

  clearSections() {
    this.divs.forEach(div => {
      div.spans.forEach(part => {
        if ("layer" in part) part.layer.dispose();
      })
    })
    this._initFlow();
  }

  _initFlow() {
    this.divs.length = 0;
    this.printedLines.length = 0
    this.y = 0;
    this.columnNo = 0;
    this.pageCount = 1;
  }

  reflow() {
    let savedDivs = this.divs.slice();
    this._initFlow();
    for (let div of savedDivs) {
      this.addDiv(div)
    }
  }

  addDiv(div: IDiv) {
    this.divs.push(div);
    if (this.width == 0 || this.height == 0) return
    let moveToNextColumn = (lineNo: number) => {
      //      let paragraphStartLineNo = this.printedLines.length;
      //      let paragraphStartY = y;
      let previousLine = this.printedLines[lineNo - 1];
      this.columnNo = previousLine.columNo + 1;
      this.y = 0;
      currentLineHeight = 0;
      for (; lineNo < this.printedLines.length; lineNo++) {
        let line = this.printedLines[lineNo];
        if (line.x < x) {
          x = 0;
          this.y += currentLineHeight;
        }
        if (this.y + line.h > this.height) {
          this.columnNo += 1;
          this.y = 0;
        }
        line.y = this.y;
        line.columNo = this.columnNo;
        x += line.w;
        if (line.h > currentLineHeight) {
          currentLineHeight = line.h;
        }
      }

    };

    let sectionStartColumnNo = this.columnNo;
    let sectionStartY = this.y;
    let sectionStartLineNo = this.printedLines.length;
    let sectionLineNo = 0;
    let x = 0;
    let currentLineHeight = 0;
    for (let part of div.spans) {
      if ("layer" in part) {
        let layer = part.layer
        if (layer.size.w == 0 || layer.size.w > this.columnWidth) {
          layer.setSize({ w: this.columnWidth, h: layer.height });
        }
        if (x + layer.size.w > this.columnWidth) {
          this.y += currentLineHeight;
          x = 0;
          currentLineHeight = 0;
        }
        if (this.y + layer.size.h > this.height) {
          this.columnNo += 1;
          x = 0;
          this.y = 0;
        }
        if (layer.size.h > currentLineHeight) {
          currentLineHeight = layer.size.h;
        }
        if (part.alignRight) {
          x = this.columnWidth - layer.size.w;
        }

        this.printedLines.push({ x, y: this.y, layer, columNo: this.columnNo, w: layer.size.w, h: layer.size.h });
        x += layer.size.w;
      } else {

        let text = part.text;
        let font = (part.font ?? Fonts.defaultFont);
        text = text.trimEnd();
        sectionLineNo += 1;
        // let textHeight = font.height;

        // if (text.length == 0) {
        //   textHeight /= 2;
        // } else {

        let paragraphStartLineNo = this.printedLines.length;
        while (text.length) {
          let remainingColumnWidth = this.columnWidth - x;
          let { charCount, overflow, width: measuredWidth, hardBreak } = this.canvasLayer.measureStringWidth(text, { maxWidth: remainingColumnWidth, font });
          if (this.y + font.height > this.height) {
            this.columnNo += 1;
            x = 0;
            this.y = 0;
          }
          let nextText;
          if (overflow) {
            if (hardBreak && x > 0) {
              nextText = text;
              text = ""
            } else {
              nextText = text.substring(charCount + 1).trimStart();
              text = text.substring(0, charCount + 1).trimEnd();
            }
          } else {
            nextText = "";
          }
          // switch (part.align) {
          //   case "center":
          //     x += Math.floor(Math.max(0, remainingColumnWidth - measuredWidth) / 2);
          //     break;
          //   case "right":
          //     x += Math.max(0, remainingColumnWidth - measuredWidth);
          //     break;
          //   default:
          //     x = 0;
          //     break;
          // }
          if (text.length > 0) {
            this.printedLines.push({ ...part, text, x, y: this.y, columNo: this.columnNo, font, w: measuredWidth, h: font.height });
            x += measuredWidth + 1;
          }
          if (font.height > currentLineHeight) {
            currentLineHeight = font.height;
          }
          if (overflow) {
            x = 0;
            this.y += currentLineHeight;
            currentLineHeight = 0;
          }
          text = nextText;
        }
        if (this.y > this.height && sectionLineNo > 2) {
          moveToNextColumn(paragraphStartLineNo);
        }
        // }
      }
    }
    if (this.columnNo > sectionStartColumnNo && sectionStartY > 0) {
      moveToNextColumn(sectionStartLineNo)
    }
    if (x > 0) this.y += currentLineHeight;
    let newPageCount = Math.ceil((this.columnNo + 1) / this._columnCount);
    if (newPageCount != this.pageCount) {
      this.pageCount = newPageCount;
    }
  }

  addSection(...divs: IDiv[]) {
    divs.forEach(d => this.addDiv(d));
  }


  print(backgroundColor: IRGBA, pageNo: number, org: IPoint = { x: 0, y: 0 }) {
    this.canvasLayer.fillRectangle(org.x, org.y, this.width, this.height, backgroundColor) // Colors.green)
    let columMin = pageNo * this._columnCount;
    let columMax = (pageNo + 1) * this._columnCount;
    this.printedLines.forEach(line => {
      if (line.columNo >= columMin && line.columNo < columMax) {
        let columnX = (line.columNo - columMin) * (this.columnWidth + this.spaceBetweenColumns)
        if ("layer" in line) {
          line.layer.moveTo({ x: line.x + org.x + columnX, y: line.y + org.y }, 0);
          line.layer.setVisible(true, DURATIONS.LAYOUT_CHANGE);
        } else {
          this.canvasLayer.print(line.x + org.x + columnX, line.y + org.y, line.text, line);
        }
      } else {
        if ("layer" in line) {
          line.layer.setVisible(false, 0);
        }
      }
    });
    // this.canvasLayer.drawLine(pt, { x: pt.x + this.width, y: pt.y + this.height }, { color: Colors.red })
  }

  addRichText(text: string) {
    text.split("\n**").forEach(section => {
      if (section.trim().length == 0) return

      section.split("\n").forEach((text, index) => {
        this.addDiv({
          spans: [{
            text: index == 0 ? text.trim() : text,
            font: index == 0 ? Fonts.font10bold : Fonts.font10
          }]
        });
      });
    })
  }
}



