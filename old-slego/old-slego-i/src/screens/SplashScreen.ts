import { App } from "../controls/App";
import { CanvasLayer } from "../controls/CanvasLayer";
import { Colors } from "../core/Colors";
import { IScreen } from "../core/IScreen";
import { Sounds } from "../core/Sound";
import { ISize } from "../core/Types";

export class SplashScreen extends CanvasLayer implements IScreen {
  textColor = { color: Colors.green, backgroundColor: Colors.dark_green };
  yPos: number = 1

  constructor(app: App) {
    super(app, { layerType: "Screen" });
    // this.setSize(app.size);
    this.backgroundColor= Colors.dark_green;
  }

  async runSplash() {
    await this.app.delay(0.5)
    this.printLine("ORIC EXTENDED BASIC")
    await this.app.delay(0.1)
    this.printLine("47870 BYTES FREE")
    await this.app.delay(0.1)
    this.printLine("Ready")
    // await this.type("ZAP", 51);
    // this.printLine("Ready", this.textColor)
    await this.type("RUN");
    await this.app.delay(0.3)
    Sounds.explosion.play();
    this.app.navigateTo("menu", undefined, { saveToHistory: false })
    this.dispose();
  }

  onParentSizeChanged(_size: ISize): void {
      
  }

  getTitle(): string {
    return "Splash"
  }

  async printLine(line: string) {
    this.print(16, this.yPos, line, this.textColor)
    this.yPos += 10;
  }

  async type(chars: string) {
    for (let i = 0; i < chars.length; i++) {
      await this.app.delay(0.3)
      Sounds.mouseDown.play();
      let letter = chars[i];
      this.print(16 + i * 6, this.yPos, letter, this.textColor)

    }
  }

  init(_screenName: string, _args: string[]): void {
    this.runSplash()
  }

}
