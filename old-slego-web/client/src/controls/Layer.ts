import { IRGBA } from "../core/Colors";
import { IApp } from "../core/IApp";
import { IScreen } from "../core/IScreen";
import { IPoint, IRect, ISize, Point, Rect, Size } from "../core/Types";
import { Styles } from "./Styles";

export interface ILayerOptions {
  initialRect: Partial<IRect>
  visible: boolean;
  focusable: boolean;
  opacity: number;
  tag?: string;
  layerType?: LayerType;
  focusMargin?: number;
}

export type LayerType = "App" | "Screen" | "Control";

export interface IAntPath {
  points: IPoint[]
  color?: IRGBA
  close?: boolean
}

export interface LayerMouseEvent {
  type: "down" | "up" | "drag" | "cancel";
  capture?: Layer | undefined;
}


export type IAnts = IAntPath[]

export abstract class Layer {
  readonly layerType?: LayerType;
  readonly app!: IApp;
  readonly screen?: IScreen
  readonly children: Layer[] = [];
  readonly focusable: boolean;

  protected readonly _layerElement: HTMLElement;
  private _position: IPoint;
  private _targetPos?: IPoint;
  private _size: ISize;
  private _visible: boolean;
  private _opacity: number;
  protected _focusMargin?: number;

  static {
    // layers display the focus outline themselves
    Styles.addStyle(".layer:focus-visible", "outline-style: none !important")
    Styles.addStyle(".layer", "overflow: hidden")
  }

  constructor(readonly parent: Layer | null, options: Partial<ILayerOptions> = {}) {
    this.layerType = options.layerType ?? "Control";
    this.parent = parent;
    switch (this.layerType) {
      case "App":
        this.app = this as any;
        break;
      case "Screen":
        this.app = parent!.app;
        this.screen = this as any;
        break;
      default:
        this.app = parent!.app;
        this.screen = parent!.screen;
        break;
    }
    this._layerElement = document.createElement(options.tag ?? "div") as HTMLDivElement;
    this._layerElement.style.position = "absolute";
    this.setContainerClasslist()
    if (parent) {
      parent.children.push(this);
      parent._layerElement.appendChild(this._layerElement);
    }

    this.onAnimationFrame
    this._position = Point.from({ x: options.initialRect?.x ?? 0, y: options.initialRect?.y ?? 0 })
    this._size = Size.from(options.initialRect)
    this._visible = options.visible ?? true;
    if (!this._visible) this._layerElement.style.display = "none";
    this.focusable = options.focusable ?? false;
    if (this.focusable) {
      this._layerElement.tabIndex = parent?.children.length ?? 0;
    }
    this._opacity = options.opacity ?? 1;
    this._focusMargin = options.focusMargin;
    if (this._position.x || this._position.y) {
      this.moveTo(this._position, 0)
    }
    if (this._size.w && this._size.h) {
      setTimeout(() => this._onSizeChanged());
    }
  }

  init(_screenName: string, _args: string[]) {
    console.log("Init is not implemented in " + this.constructor.name)
  }

  dispose() {
    if (this.parent) {
      let childIdx = this.parent.children.indexOf(this);
      if (childIdx >= 0) this.parent.children.splice(childIdx);
      this._layerElement.remove();
    }
  }

  get targetPos(): IPoint {
    return this._targetPos ?? this._position;
  }

  get size(): ISize {
    return this._size;
  }

  get width(): number {
    return this._size.w;
  }

  get height(): number {
    return this._size.h;
  }

  get targetRect(): IRect {
    let targetPos = this.targetPos;
    return new Rect(targetPos.x, targetPos.y, this._size.w, this._size.h);
  }

  get position(): IPoint {
    return this._position;
  }

  get opacity(): number {
    return this._opacity;
  }

  setContainerClasslist() {
    this._layerElement.classList.add("layer");
    let layerClass: string | undefined = this.constructor.name;
    this._layerElement.classList.add(layerClass);
  }

  isVisible(): boolean {
    return this._visible;
  }

  async setVisible(visible: boolean, animate: number | undefined = undefined) {
    let setOpacity = (newOpacity: number) => {
      this._opacity = newOpacity;
      this._layerElement.style.opacity = newOpacity.toString();
      if (newOpacity <= 0) {
        if (this._visible) {
          this._visible = false;
          this._layerElement.style.display = "none";
        }
      }
      else {
        if (!this._visible) {
          this._visible = true;
          this._layerElement.style.display = "inherit";
        }
      }
    }
    let previousOpacity = this._opacity;
    let nextOpacity = visible ? 1 : 0;
    if (nextOpacity == this._opacity) return;
    if (animate) {
      await this.app.animate((p: number) => {
        setOpacity(previousOpacity * (1 - p) + nextOpacity * p);
      }, animate);
    } else {
      setOpacity(nextOpacity);
    }
  }

  setSize(newSize: ISize) {
    if (Size.equals(this._size, newSize)) return
    this._size = Size.from(newSize);
    this._onSizeChanged()
  }

  protected _onSizeChanged() {
    // wWe change the div width and height.
    // The impact is minimal as generally contains only a canvas with an absolute position
    this._layerElement.style.width = this.size.w + "px";
    this._layerElement.style.height = this.size.h + "px";
    this.children.forEach((l) => l.onParentSizeChanged(this._size));
    this.onSizeChanged();
  }

  onKeyPress(_key: string): boolean {
    return false;
  }

  onMouseEvent(_event: LayerMouseEvent, _point: IPoint): boolean {
    return false;
  }

  isOpaque() {
    return this._opacity !== 0;
  }

  getCenter(): IPoint {
    return { x: Math.floor(this._size.w / 2), y: Math.floor(this._size.h / 2) };
  }


  getAnts(): IAnts {
    let focusMargin = this._focusMargin ?? 1
    let x1 = - focusMargin - 1;
    let y1 = -focusMargin - 1;
    let x2 = this._size.w + focusMargin * 2 - 1;
    let y2 = this._size.h + focusMargin * 2 - 1;
    return [{
      points: [
        { x: x1, y: y1 },
        { x: x2, y: y1 },
        { x: x2, y: y2 },
        { x: x1, y: y2 },
        { x: x1, y: y1 }
      ]
    }]
  }

  getAbsolutePos(point: IPoint = { x: 0, y: 0 }): IPoint {
    let layer: Layer | null = this;
    let { x, y } = point
    while (layer) {
      x += layer._position.x;
      y += layer._position.y;
      layer = layer.parent;
    }
    return new Point(x, y);
  }

  // ------------------------------------------------
  // overridables that doesn't require a super call.
  // ------------------------------------------------

  onSizeChanged() { }

  onTick(): void { }

  onAnimationFrame(): void { }

  onParentSizeChanged(_size: ISize): void {
  }

  async moveTo(pos: IPoint, animate: number) {
    if (animate) {
      let originalPosition = Point.from(this._position);
      let targetPosition = Point.from(pos);
      this._targetPos = targetPosition;
      await this.app.animate((p) => {
        let newPos = {
          x: originalPosition.x * (1 - p) + targetPosition.x * p,
          y: originalPosition.y * (1 - p) + targetPosition.y * p
        }
        this.moveTo(newPos, 0)
      }, animate);
    } else {
      this._position = Point.roundedFrom(pos);
      this._targetPos = this._position;
      this._layerElement.style.left = this._position.x + "px";
      this._layerElement.style.top = this._position.y + "px";
    }
  }

  *recurseChildren(filter?: (layer: Layer) => boolean): Generator<Layer, void, undefined> {
    if (!filter || filter(this)) {
      yield this;
      for (let child of this.children) {
        yield* child.recurseChildren()
      }
    }
  }

  focus() {
    this._layerElement.focus();
  }
}
