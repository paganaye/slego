import { IABCValue } from "../controls/ABCInput";
import { App } from "../controls/App";
import { CanvasLayer } from "../controls/CanvasLayer";
import { IRGBA, lerpRGBA } from "../core/Colors";

export interface IPlasma {
  x: IABCValue;
  y: IABCValue;
  x2: IABCValue;
  y2: IABCValue;
  c1: IRGBA;
  c2: IRGBA;
  c3: IRGBA;
  c4: IRGBA;
}

export class Plasma extends CanvasLayer {
  plasma: IPlasma = {
    x: { a: Math.random(), b: Math.random(), c: Math.random() },
    y: { a: Math.random(), b: Math.random(), c: Math.random() },
    x2: { a: Math.random(), b: Math.random(), c: Math.random() },
    y2: { a: Math.random(), b: Math.random(), c: Math.random() },
    c1: { r: 0x00, b: 0x0, g: 0x0, a: 0xff },
    c2: { r: 0x44, b: 0x88, g: 0x00, a: 0xff },
    c3: { r: 0x0, b: 0x88, g: 0x88, a: 0xff },
    c4: { r: 0x44, b: 0x0, g: 0x88, a: 0xff }
  }

  constructor(app: App) {
    super(app, { layerType: "Screen" });
  }

  onTick(): void { }

  onAnimationFrame() {
    function lerpFourColors(c1: IRGBA, c2: IRGBA, c3: IRGBA, c4: IRGBA, t: number): IRGBA {
      if (t <= 1 / 3) {
        // Interpolate between c1 and c2
        if (t < 0) t = 0;
        return lerpRGBA(c1, c2, t * 3);
      } else if (t <= 2 / 3) {
        // Interpolate between c2 and c3
        return lerpRGBA(c2, c3, (t - 1 / 3) * 3);
      } else {
        // Interpolate between c3 and c4
        if (t > 1) t = 1;
        return lerpRGBA(c3, c4, (t - 2 / 3) * 3);
      }
    }

    function readABC(abc: IABCValue): IABCValue {
      return {
        a: abc.a,
        b: abc.b,
        c: abc.c
      }
    }
    let px = readABC(this.plasma.x)
    let px2 = readABC(this.plasma.x2)
    let py = readABC(this.plasma.y)
    let py2 = readABC(this.plasma.y2)
    let { c1, c2, c3, c4 } = this.plasma;


    let time = Date.now() / 1500;
    for (let y = 0; y < this.size.h; y++) {
      for (let x = 0; x < this.size.w; x++) {
        // Generate plasma patterns using sin and cos functions
        const v = 0.5 *
          (Math.sin(px.a * x * px.b / 3 + px.c * time)
            + Math.sin(py.a * y * py.b / 3 + py.c * time)
            + Math.sin(px2.a * x * px2.b + px2.c * time)
            + Math.sin(py2.a * y * py2.b + py2.c * time)) / 2;


        let c = lerpFourColors(c1, c2, c3, c4, v);
        // Set the pixel color
        this.setPixel(x, y, c);
      }
    }
    this.pixelsChanged = true;
    super.onAnimationFrame();
  }

}
