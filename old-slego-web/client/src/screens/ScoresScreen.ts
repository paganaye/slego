import { App } from "../controls/App";
import { IScreen } from "../core/IScreen";
import { PagedScreen } from "./PagedScreen";

// interface IScore {
//   userId?: number
//   userName?: string;
//   date: number;
//   score: number;
//   game: string;
// }

// type ScorePeriod = "day" | "week" | "month" | "year" | "ever";

// interface IScores<TPeriod extends ScorePeriod> {
//   type: TPeriod;
//   signature: number;
//   scores: IScore[];
// }

// interface IAllScores {
//   day: IScores<"day">;
//   week: IScores<"week">;
//   month: IScores<"month">;
//   year: IScores<"year">;
//   ever: IScores<"ever">;
// }


export class ScoreScreen extends PagedScreen  implements IScreen{
    
  constructor(app: App) {
    super(app, { layerType: "Screen" });
  }

  getTitle(): string {
    return "Scores";
  }
}
