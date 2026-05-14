import { App } from "../controls/App";
import { IScreen } from "../core/IScreen";
import { PagedScreen } from "./PagedScreen";


export class AboutScreen extends PagedScreen implements IScreen {

  constructor(app: App) {
    super(app, { layerType: "Screen" });
    this.addRichText(`    
** What is SLEGO?
SLEGO is a game set on a 5x5 board that combines strategy and skill.
··□··
·○·✕· 
✕△···
···○·
·□·△·

If you ever wished for Tetris without the ticking clock, SLEGO is your answer. First introduced in 2007, it's now accessible for all to play again.
** Objective
Your mission? Secure the highest score in 40 rounds.

** The Board
Visualize a 5x5 grid.
   ·····
   ·····   
   ····· 
   ·····
   ·····
Your task? Place tiles within any of these 25 squares.

** The Tiles
Each round offers a tile, made up of 1 to 5 colored squares arranged randomly.
For example
   □
   △○ or □□✕
   ✕

** Placing Tiles
You have the freedom to place tiles anywhere on the board. But remember, if you overlay an existing tile, it deducts 1 ◉. If a tile fall out of the board, there's no deduction.

** Scoring
Forming an horizontal or vertical line of 3 or more tiles gives you points.
·····
·□□□· 10◉
·○○○○ 20◉
✕✕✕✕✕ 30◉
·····
Your round score is the sum of these line multiplied by the number of lines formed.

Example: In the previous example you'd get (10 + 20 + 30) x 3.

** Difficulty Levels
There is not difficulty level, everyone get the points that match their level:
Casual play: ~200 ◉.
Skillful maneuvering: ~500 ◉.
For the masters: Touching 700 ◉ takes skill, prowess, and maybe a smidge of luck.

** Achievements
Seek out achievements that span from basic objectives to formidable challenges.

** Rewinding Time
Erred in a move? Breathe easy! Roll back your moves to a few rounds prior, or even reset to the beginning. There's absolutely no time pressure.

** Tutorial
New to SLEGO? Our extensive tutorial got you covered, introducing both fundamental and advanced tactics.

** Tips & Tricks
Always strategize for the upcoming tiles.
Prioritize creating opportunities for future multi-block alignments.
The achievements can offer gameplay direction and targets.
Jump Right In!
Feel like testing your mettle? Dive in, lay down those tiles, and let your strategy shine.

** Platform
Play SLEGO on any web browser-equipped device.

** Who Can Play?
SLEGO welcomes all, irrespective of age, especially if you have a penchant for Tetris or similar tile-matching challenges.

** Global Competition:
Watch out! A global live version is brewing, akin to a chilled-out bingo round.
Flaunt your SLEGO prowess! Battle for supremacy on the global leaderboard, ascending ranks by amplifying your scores.

** Design
SLEGO is designed with the high resolution graphics and state of the art sound chip music of the 1980s.
Sound effects have been created are played using the jsfxr library from: https://sfxr.me/ 
The musics have been found at https://twitter-archive.beepbox.co/ and are played by the BeepBox library.

** Monetization
Play to your heart's content; SLEGO is entirely free.

** The End
Have a good game
`);
  }

  getTitle(): string {
    return "About SLEGO";
  }
}

