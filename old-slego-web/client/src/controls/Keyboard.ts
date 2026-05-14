import { Button } from "../controls/Button";
import { Layer } from "./Layer";

export interface IKeyboardOptions {

}

export class Keyboard extends Layer {
  musicOn: boolean = true;
  soundOn: boolean = true;

  constructor(parent: Layer, options: Partial<IKeyboardOptions> = {}) {
    super(parent, options)

    let x = 4
    let y = 80;
    let keyboard: string[] = [
      "0123456789-*",
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      "abcdefghijklmnopqrstuvwxyz"
    ]

    for (let line of keyboard) {
      x = 4;
      for (let ch of line) {
        if (x > 127) { x = 4; y += 12 };
        new Button(this, ch, { initialRect: { x, y } });
        x += 10;
      }
      y += 12;
    }
    new Button(this, "←", { initialRect: { x: 44, y } });
    new Button(this, "OK", { initialRect: { x: 64, y } });
  }


}
