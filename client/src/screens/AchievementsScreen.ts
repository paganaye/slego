import { achievements } from "../Achievements";
import { App } from "../controls/App";
import { Colors } from "../core/Colors";
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

export class AchievementsScreen extends PagedScreen implements IScreen  {
    
  constructor(app: App) {
    super(app, { layerType: "Screen" });
    let achievementsDone = App.instance.achievementsDone.getValue();

    for (let k of Object.keys(achievements)) {
      let achievement = achievements[k];
      if (!achievement.hidden) {
        let done = achievementsDone[k];
        let medal = done ? ((achievement.level === "gold") ? "🥇"
          : (achievement.level === "silver") ? "🥈"
            : "🥉") : " ";
        let text = medal + " " + achievement.description;
        let color = (done) ? Colors.white : Colors.light_gray;
        this.addDiv({ text, color })
      }
    }
  }

  getTitle(): string {
    return "Achievements";
  }
}
