import { Colors } from "./core/Colors";
import { CanvasLayer, ICanvasLayerOptions } from "./controls/CanvasLayer";
import { Size } from "./core/Types";
import { Fonts } from "./Fonts";
import { Layer } from "./controls/Layer";
import { IRoundPoints, RoundScoreLine } from "./RoundPoints";


export class RoundPoints extends CanvasLayer {
  roundPoints!: IRoundPoints;
  printLines: RoundScoreLine[] = [];

  constructor(parent: Layer, options: Partial<ICanvasLayerOptions> = {}) {
    super(parent, options);
    super.setSize(new Size(90, 57));
  }

  drawRound(roundPoints: IRoundPoints, maxLine?: number) {
    this.clear();
    this.roundPoints = roundPoints;

    // alignments: Alignments = { alignments: [], covered: [] };
    let covered = roundPoints.covered.length;
    let lines = maxLine === undefined ? roundPoints.lines : roundPoints.lines.slice(0, maxLine + 1);
    let nbLines = lines?.length ?? 0;

    let l3 = lines.filter(a => a.count == 3).length;
    let l4 = lines.filter(a => a.count == 4).length;
    let l5 = lines.filter(a => a.count == 5).length;
    let printLines: RoundScoreLine[] = [];
    if (l3) printLines.push({ left: l3 + " Small", value: 10 * l3 + "◉" });
    if (l4) printLines.push({ left: l4 + " Medium", value: 20 * l4 + "◉" });
    if (l5) printLines.push({ left: l5 + " Long", value: 30 * l5 + "◉" });
    if (nbLines > 1) printLines.push({ left: "Multiplier", value: "x" + nbLines + " " });
    if (maxLine === undefined) {
      if (covered) printLines.push({ left: "Covered", value: (-covered) + "◉" });
      if (printLines.length > 1) {
        printLines.push({ left: "Total", value: roundPoints.roundScore + "◉" });
      }
    }
    this.printLines = printLines;
    this.invalidate();
  }

  onPaint(): void {
    let y = 0;
    for (let line of this.printLines) {
      this.print(0, y, line.left, { color: Colors.gray, font: Fonts.font10 });
      this.print(80, y, line.value.toString(), { alignRight: true, color: Colors.white_ish });
      y += 10;
    }
  }
}
