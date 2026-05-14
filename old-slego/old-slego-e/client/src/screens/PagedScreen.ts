import { CanvasLayer, ICanvasLayerOptions } from "../controls/CanvasLayer";
import { Button } from "../controls/Button";
import { FlowLayout, IDiv, ISpan } from "../core/FlowLayout";
import { Fonts } from "../Fonts";
import { App } from "../controls/App";
import { DURATIONS } from "../core/IAnimation";

interface IPagedCanvasLayerOptions extends ICanvasLayerOptions {
  backButton?: boolean
  twoColumnsInLandscape?: boolean;
}

export class PagedScreen extends CanvasLayer {
  backButton?: Button;
  prevButton: Button;
  nextButton: Button;
  pageNo = 0;
  protected _flowLayout: FlowLayout;
  twoColumnsInLandscape: boolean;
  leftMargin = 10;
  rightMargin = 10;
  
  constructor(app: App, options: Partial<IPagedCanvasLayerOptions> = {}) {
    super(app, options);

    this.twoColumnsInLandscape = options.twoColumnsInLandscape ?? false;

    if (options.backButton ?? true) {
      this.backButton = new Button(this, "←", {
        ...Button.LargeIconButton, initialRect: { x: 3, y: 3 }, onClick: () => {
          window.history.back();
        }, href: "#back",

      });
    }
    this.prevButton = new Button(this, "↑", {
      ...Button.BlueButton, initialRect: { x: 90, y: 3 }, onClick: () => {
        if (this.pageNo > 0) {
          this.pageNo -= 1;
          this.invalidate();
        }
      }, href: "#previous-page"
    });
    this.nextButton = new Button(this, "↓", {
      ...Button.BlueButton, initialRect: { x: 104, y: 3 }, onClick: () => {
        if (this.pageNo < this._flowLayout.pageCount - 1) {
          this.pageNo += 1;
          this.invalidate();
        }
      }, href: "#next-page"
    });
    this._flowLayout = new FlowLayout(this, { w: 0, h: 0 });
  }

  onSizeChanged() {
    this.nextButton.moveTo({ x: this.size.w - this.nextButton.width - 3, y: 3 }, DURATIONS.LAYOUT_CHANGE)
    this.prevButton.moveTo({ x: this.nextButton.targetPos.x - this.prevButton.width - 3, y: 3 }, DURATIONS.LAYOUT_CHANGE)
    // 
    if (this.twoColumnsInLandscape) {
      this._flowLayout.setColumnCount((this.size.w > this.size.h) ? 2 : 1)
    }
    this._flowLayout.setSize({ w: this.size.w - this.leftMargin - this.rightMargin, h: this.size.h - 20 });
    this._flowLayout.reflow()
  }

  onPaint() {
    if (this.pageNo >= this._flowLayout.pageCount) this.pageNo = this._flowLayout.pageCount - 1;
    this.prevButton.setVisible(this.pageNo > 0)
    this.nextButton.setVisible(this.pageNo < this._flowLayout.pageCount - 1)
    this._flowLayout.print(this.backgroundColor, this.pageNo, { x: this.leftMargin, y: 18 });
    this._printTitle();
  }

  protected _printTitle() {
    this.print(16, 4, this.getTitle(), { font: Fonts.font10bold });
  }

  getTitle(): string {
    return this.constructor.name;
  }

  clearSections() {
    this._flowLayout.clearSections();
  }

  addDiv(...spans: ISpan[]) {
    this._flowLayout.addDiv({
      spans: spans,
      align: "left"
    })
  }

  addSection(...divs: IDiv[]) {
    this._flowLayout.addSection(...divs);
  }

  addRichText(text: string) {
    this._flowLayout.addRichText(text)
  }
}

