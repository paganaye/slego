import { App } from "./App";
import { CanvasLayer } from "./CanvasLayer";
import { Colors } from "../core/Colors";
import { IAnts, Layer } from "./Layer";

export class FocusLayer extends CanvasLayer {
  private _currentFocus: Layer | null = null;
  initDone = false;
  controls: Layer[] = [];
  antLines: IAnts = [];

  constructor(readonly app: App) {
    super(app);
    this._layerElement.style.zIndex = '999';
    this._layerElement.style.pointerEvents = 'none';
  }


  init() {
    this.initDone = true;
    if (this.app.activeScreen) {
      let focusableControls: Layer[] = []
      for (let control of this.app.activeScreen.recurseChildren()) {
        if (control.focusable) focusableControls.push(control);
      }
      this.setFocus(focusableControls[0])
      this.controls = focusableControls;
    }
  }

  onKeyPress(key: string): boolean {
    if (!this.initDone) this.init();
    if (this._currentFocus) {
      let handled = this._currentFocus.onKeyPress(key);
      if (handled) return true;
    }
    if (key == "Enter") {
      if (this._currentFocus) {
        // enter simulate a mouse click in the center !!
        let btn = this._currentFocus;
        btn.onMouseEvent({ type: "down" }, btn.getCenter());
        setTimeout(() => {
          btn.onMouseEvent({ type: "up" }, btn.getCenter());
        }, 250)
        return true;
      }
    }
    let currentFocus = this._currentFocus || this;
    let currentCenter = currentFocus.getAbsolutePos(currentFocus.getCenter());

    let arrowAngle = {
      ArrowDown: -90,
      ArrowUp: 90,
      ArrowRight: 0,
      ArrowLeft: 180
    }[key]

    if (arrowAngle === undefined) return false;

    let best: Layer | undefined;
    let bestDeviationPlusDist: number = Number.MAX_VALUE;

    this.controls.forEach(target => {
      if (target != this._currentFocus && target.isOpaque()) {
        let targetCenter = target.getAbsolutePos(target.getCenter());
        let dx = targetCenter.x - currentCenter.x;
        let dy = currentCenter.y - targetCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) / Math.PI * 180;
        let deviation = Math.abs(angle - arrowAngle!);
        if (deviation > 180) deviation = 360 - deviation;
        // we choose the next control base mainly on its direction but then on distance
        let deviationPlusDist = distance + deviation / 2;
        if (deviation < 90 && deviationPlusDist < bestDeviationPlusDist) {
          best = target;
          bestDeviationPlusDist = deviationPlusDist;
        }
      }
    });
    if (best) {
      this.setFocus(best);
      return true;
    }
    return false;
  }

  onPaint(): void {
    this.antLines = [{ points: [{ x: 0, y: 0 }, { x: this.size.w, y: this.size.h }] }];
  }

  onAnimationFrame(): void {
    this.clear();
    if (this.app.isBusy) {
      this.rectangle(0, 0, this.size.w, this.size.h, Colors.red);
    }
    if (this._currentFocus && this._currentFocus.opacity > 0.1) {
      let ants = this._currentFocus.getAnts();
      this.antLines = ants;
      this.withOffset(this._currentFocus.getAbsolutePos(), () => {
        this.antLines.forEach(antPath => this.drawAntPath(antPath));
      });
    }
    super.onAnimationFrame();
  }

  setFocus(newFocus: Layer | null): void {
    this._currentFocus = newFocus;
    if (newFocus) {
      newFocus.focus()
    } else {
      (document.activeElement as any)?.blur();
    }
  }

}

