import { GameScreen } from "./screens/GameScreen";
import { App } from "./controls/App";
import { PlayScreen } from "./screens/PlayScreen";
import { AboutScreen } from "./screens/AboutScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { TestScreen } from "./screens/TestScreen";
import { ScoreScreen } from "./screens/ScoresScreen";
import { MainMenu } from "./screens/MainMenu";
import { AchievementsScreen } from "./screens/AchievementsScreen";
import { SplashScreen } from "./screens/SplashScreen";
import { LevelsScreen } from "./screens/LevelsScreen";
import { IScreenConstructor } from "./core/IScreen";
import { PlasmaMakerScreen } from "./screens/PlasmaMakerScreen";
import { SoundMakerScreen } from "./screens/SoundMakerScreen";
import { LoginScreen } from "./screens/LoginScreen";

const screens = {
  "": SplashScreen,
  "menu": MainMenu,
  "about": AboutScreen,
  "game": GameScreen,
  "play": PlayScreen,
  "scores": ScoreScreen,
  "settings": SettingsScreen,
  "login": LoginScreen,
  "achievements": AchievementsScreen,
  "test": TestScreen,
  "beginner-levels": LevelsScreen,
  "intermediary-levels": LevelsScreen,
  "advanced-levels": LevelsScreen,
  "plasma": PlasmaMakerScreen,
  "sounds": SoundMakerScreen,
} satisfies Record<string, IScreenConstructor>;

export class Slego extends App {
  getTitle(): string {
    return "SLEGO"
  }

  constructor(parent: HTMLElement) {
    // List of 16/9 ratios
    //   64 x 36
    //   80 x 45
    //   96 x 54
    //   112 x 63
    //   128 x 72 <= TRS 80
    //   144 x 81
    //   160 x 90 <= Amstrad CPC 
    //   176 x 99 <== Vic 20
    //   192 x 108
    //   208 x 117
    //   224 x 126
    //   240 x 135 <== Oric-1 width
    //   256 x 144 <== ZX Spectrum, MSX
    //   272 x 153
    //   288 x 162
    //   304 x 171
    //   320 x 180 <== Commodore 64, Atari 800, Atari ST
    //
    let debug = (document.location.hostname === "localhost");
    super(parent, screens as any, { debug, LANDSCAPE_WIDTH: 240 })
  }

}
