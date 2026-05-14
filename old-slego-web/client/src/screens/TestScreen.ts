import { CanvasLayer } from "../controls/CanvasLayer";
import { IState } from "../core/State";
import { MutableState, constState, hh_mm_ss, join } from "../core/MutableState";
import { IPoint, Point } from "../core/Types";
import { App } from "../controls/App";
import { IScreen } from "../core/IScreen";

export class TestScreen extends CanvasLayer implements IScreen {
    
  content: ReactiveText;

  constructor(app: App) {
    super(app, { layerType: "Screen" });
document.createElement("div");
    let name = new MutableState("Pascal ");
    this.content = new ReactiveText(constState(Point.Zero), join(name, hh_mm_ss(App.instance.nowDate)))
  }

  getTitle(): string {
    return "Test"
  }

  onAnimationFrame(): void {
    super.onAnimationFrame();
    if (this.content.needPrint) {
      this.content.print(this)
    }
    this.clear();
    this.drawLine({ x: 4, y: 4 }, { x: 16, y: 20 })

    this.drawCircle({ x: 20, y: 20 }, 20, { sectionMin: 0, sectionMax: 7 })
  }

}


class ReactiveText {
  needPrint: boolean = true;

  constructor(readonly position: IState<IPoint>, readonly text: IState<any>) {
    text.observe((_value: any) => {
      this.needPrint = true;
    })
    position.observe((_value: any) => {
      this.needPrint = true;
    })
  }

  print(canvas: CanvasLayer) {
    let { x, y } = this.position.getValue();
    canvas.print(x, y, this.text.getValue()?.toString() ?? "")
    this.needPrint = false;
  }

}


