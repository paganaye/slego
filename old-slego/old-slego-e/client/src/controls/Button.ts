import { CanvasLayer, ICanvasLayerOptions, IPrintOptions } from "./CanvasLayer";
import { Colors, IRGBA } from "../core/Colors";
import { Fonts } from "../Fonts";
import { Layer, LayerMouseEvent } from "./Layer";
import { IPoint, ISize, Size } from "../core/Types";
import { Sounds } from "../core/Sound";

export interface IButtonOptions extends Partial<ICanvasLayerOptions & IPrintOptions> {
  borderColor?: IRGBA;
  onClick: () => void;
  repeat?: boolean;
  minWidth?: number;
  href?: string;
  silent?: boolean;
  enabled?: boolean;
}

export class Button extends CanvasLayer {
  text: string;
  borderSize: number;
  static BlueButton: Partial<IButtonOptions> =
    { backgroundColor: Colors.dark_blue, color: Colors.white_ish, spaceBefore: 2, spaceAfter: 2 };
  static LargeIconButton: Partial<IButtonOptions> =
    { backgroundColor: Colors.dark_blue, color: Colors.white_ish, font: Fonts.font10_slego, spaceBefore: 2, spaceAfter: 2 };
  static MenuButton: Partial<IButtonOptions> = {
    backgroundColor: Colors.semi_black, color: Colors.white_ish, spaceBefore: 3, spaceAfter: 3, spaceAbove: 1, spaceBetween: 2, spaceBelow: 1
  }

  isDown: boolean = false;
  borderColor?: IRGBA;
  onClick: () => void;
  spaceBefore: number;
  spaceAfter: number;
  silent: boolean;
  private _enabled: boolean;

  constructor(parent: Layer, text: string, options: Partial<IButtonOptions> = {}) {
    super(parent, { ...options, tag: options.tag ?? "a", focusable: true });
    this.text = text;
    this.borderColor = options.borderColor;
    this.onClick = options.onClick ?? (() => {
      if (options.href) this.app.navigateTo(options.href)
      else console.log("Button with no action or href clicked")
    });
    this.spaceBefore = options.spaceBefore ?? 1;
    this.spaceAfter = options.spaceAfter ?? 1;

    // if (options.href) 
    (this._layerElement as HTMLAnchorElement).href = options.href ?? "#";
    this._layerElement.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("Link Clicked", this._layerElement);
    });


    if (!options.font) options.font = this.font;
    this.borderSize = (this.borderColor ? 1 : 0);
    this.silent = options.silent ?? false;
    this._enabled = options.enabled ?? true;

    let calculatedSize = new Size(
      this.measureStringWidth(this.text, this).width + 2 * this.borderSize,
      this.getFontHeight(this) + 2 * this.borderSize);

    this.setSize(calculatedSize);
  }

  onMouseEvent(event: LayerMouseEvent, pt: IPoint): boolean {
    switch (event.type) {
      case "down":
        if (!this._enabled) return true;
        if (!this.silent) Sounds.mouseDown.play();
        this.app.setFocus(this);
        this.isDown = true;
        this.invalidate();
        event.capture = this;
        break;
      case "up":
        if (!this._enabled) return true;
        if (this.isDown) {
          if (!this.silent) Sounds.mouseUp.play();
          this.isDown = false;
          this.invalidate();
          this.onClick()
        }
        break;
      case "drag":
        let newDown = pt.x >= 0 && pt.y >= 0 && pt.x < this.size.w && pt.y < this.size.h
        if (newDown != this.isDown) {
          this.isDown = newDown;
          this.invalidate();
        }
    }
    return true;
  }

  onParentSizeChanged(_parentSize: ISize): void {
    // do not propagate
  }

  setEnabled(value: boolean) {
    if (value == this._enabled) return
    this._enabled = value;
    this.invalidate();
  }
  onPaint() {
    if (this.borderColor) {
      let { w, h } = this.size;
      this.rectangle(0, 0, w, h, this.borderColor)
    }
    let options = { ...this }
    if (!this._enabled) {
      options.color= Colors.light_gray;
      options.backgroundColor= Colors.gray;
    } else if (this.isDown) {
      options.backgroundColor= Colors.blue;
    }
    this.print(this.borderSize, this.borderSize, this.text, options)
  }
}
