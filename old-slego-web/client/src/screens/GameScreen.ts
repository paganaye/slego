import { Board } from "../Board";
import { Cross } from "../Cross";
import { Fonts } from "../Fonts";
import { App } from "../controls/App";
import { GameState } from "../core/GameState";
import { Round } from "../core/Round";
import { BoardOverlay } from "../BoardOverlay";
import { GameRoundAndScore as GameRoundAndScore } from "../GameRoundAndScoreLayer";
import { Sounds } from "../core/Sound";
import { CanvasLayer } from "../controls/CanvasLayer";
import { Button } from "../controls/Button";
import { LayerMouseEvent } from "../controls/Layer";
import { RoundPoints } from "../RoundPoints.1";
import { IScreen } from "../core/IScreen";
import { IPlayPosition, PlayPosition } from "../core/BoardTiles";
import { DURATIONS } from "../core/IAnimation";
import { IPoint, Point } from "../core/Types";

export class GameScreen extends CanvasLayer implements IScreen {
  backButton: Button;
  optionsButton: Button;
  //gameBackgroundLayer: GameLayer;
  gameRoundAndScoreLayer: GameRoundAndScore;
  roundPointsLayer: RoundPoints;
  boardLayer: Board;
  boardOverlay: BoardOverlay;
  cross: Cross;
  currentFocus: "cross" | "round" | "back" | "options" = "cross";
  boardPos: IPoint = { x: 0, y: 0 };
  crossLanding: IPoint = { x: 0, y: 0 };

  state!: GameState;
  currentRound!: Round;
  newPlayPosition: IPlayPosition | null = null;
  draggingCross: boolean = false;
  static instance: GameScreen;

  constructor(app: App) {
    super(app, { layerType: "Screen" });
    this.backButton = new Button(this, "←", {
      ...Button.LargeIconButton, initialRect: { x: 3, y: 3 }, onClick: () => {
        window.history.back();
      }, href: "#back"
    });
    // hamburger
    this.optionsButton = new Button(this, "☰", {
      ...Button.LargeIconButton, initialRect: { x: 100, y: 3 }, href: "#settings"
    });

    GameScreen.instance = this;

    let boardFont = Fonts.font15_slego;
    this.boardLayer = new Board(this, { font: boardFont });
    this.boardOverlay = new BoardOverlay(this, { font: boardFont });
    this.boardOverlay.setVisible(false, 0)

    this.gameRoundAndScoreLayer = new GameRoundAndScore(this);
    this.roundPointsLayer = new RoundPoints(this);
    this.cross = new Cross(this, { font: boardFont });

  }

  init(_screenName: string, args: string[]): void {
    let seed = args[0];
    let nbRounds = parseInt(args[1] ?? "40")
    this.state = new GameState(nbRounds, seed);
    this.gameRoundAndScoreLayer.init();

    this.setCurrentRoundNo(0);
    this.app.setFocus(this.cross);
  }

  getTitle(): string {
    return "Game"
  }

  onMouseEvent(event: LayerMouseEvent, pt: IPoint): boolean {
    let res = super.onMouseEvent(event, pt);
    if (res) return res;
    else return GameScreen.instance.onGameBackgroundMouseEvent(event, pt);
  }

  onSizeChanged(): void {
    this.optionsButton.moveTo({ x: this.size.w - this.optionsButton.size.w - 3, y: 3 }, DURATIONS.LAYOUT_CHANGE)
    let topBarMargin = 10;
    if (App.instance.landscape_mode) {
      let boardY = topBarMargin + (this.size.h - topBarMargin) / 2 - this.boardLayer.size.h / 2;
      this.boardLayer.moveTo({ x: 19, y: boardY }, DURATIONS.LAYOUT_CHANGE)
      let leftMargin = this.boardLayer.targetPos.x + this.boardLayer.size.w + 10;
      this.crossLanding = { x: leftMargin, y: boardY + 15 };
      this.gameRoundAndScoreLayer.moveTo({ x: leftMargin, y: 12 }, DURATIONS.LAYOUT_CHANGE);
      this.roundPointsLayer.moveTo({ x: leftMargin, y: 40 }, DURATIONS.LAYOUT_CHANGE);
    } else { // portrait
      let boardX = this.size.w / 2 - this.boardLayer.size.w / 2;
      let baseX = 20;
      this.boardLayer.moveTo({ x: boardX, y: 54 }, DURATIONS.LAYOUT_CHANGE)
      this.gameRoundAndScoreLayer.moveTo({ x: baseX, y: 18 }, DURATIONS.LAYOUT_CHANGE);
      let topMargin = this.boardLayer.targetPos.y + this.boardLayer.size.h + 10;
      this.crossLanding = { x: boardX + 15, y: topMargin };
      this.roundPointsLayer.moveTo({ x: baseX, y: topMargin }, DURATIONS.LAYOUT_CHANGE);
    }
    this.boardOverlay.moveTo(this.boardLayer.targetPos, DURATIONS.LAYOUT_CHANGE);
    this.boardOverlay.setVisible(false, 0)
    this.cross.moveToPlayPosition(this.cross.playPosition, { animate: DURATIONS.LAYOUT_CHANGE, init: true });

  }

  onPaint(): void {
    this.print(15, 4, "SLEG○", { font: Fonts.font10_slego });
  }

  currentDraw() {
    return this.currentRound.draw;
  }

  showState() {
    this.cross.drawHand(this.currentRound.draw);
  }

  async setCurrentRoundNo(newRoundNo: number) {
    if (newRoundNo < 0 || newRoundNo >= this.state.rounds.length) return;
    this.state.currentRoundNo = newRoundNo;
    this.currentRound = this.state.rounds[newRoundNo];
    this.newPlayPosition = null;
    this.cross.drawHand(this.currentDraw());
    this.gameRoundAndScoreLayer.drawRoundAndScore()
    this.boardLayer.drawBoard(this.currentRound.getStartingBoard())
    await this.cross.setVisible(true, DURATIONS.CROSS_VISIBLE);
  }

  getPlayPositionFromPoint(pt: IPoint): PlayPosition {
    let tileSize = this.boardLayer.tileSize;
    let boardPosition = this.boardLayer.position;

    let playPos = new PlayPosition(
      (pt.x - boardPosition.x - 1) / tileSize,
      (pt.y - boardPosition.y - 1) / tileSize);
    return playPos;
  }
  lineMadeCounter = 0;


  async playCross(newCrossPos: IPlayPosition) {
    //if (withSound) moveSound.play()

    await this.app.runBlocking(async () => {
      this.currentRound.play(newCrossPos);
      for (let i = this.state.currentRoundNo + 1; i < this.state.nbRounds; i += 1) {
        this.state.rounds[i].clearPlay()
      }
      let showRoundPoints = this.currentRound.shouldShowRoundPoints();
      let showBoardOverlay = this.currentRound.roundPoints.lines.length > 0

      this.boardLayer.drawBoard(this.currentRound.getIntermediaryBoard())
      await this.cross.setVisible(false, DURATIONS.CROSS_HIDDEN);
      this.cross.moveToPlayPosition(null, { animate: 0 })
      if (showRoundPoints) {
        this.roundPointsLayer.drawRound(this.currentRound.roundPoints, 0);
        this.roundPointsLayer.setVisible(true, DURATIONS.ROUND_POINTS_VISIBLE);
      }
      if (showBoardOverlay) {
        if (this.currentRound.roundPoints.roundScore < 0) {
          Sounds.explosion.play();
        }
        this.boardOverlay.clearRoundLinesTiles(this.currentRound)
        //TODO  this.focusLayer.currentFocus = this.boardOverlay;

        let lines = this.currentRound.roundPoints.lines
        await this.boardOverlay.setVisible(true, DURATIONS.OVERLAY_VISIBLE)
        for (let lineNo = 0; lineNo < lines.length; lineNo++) {
          switch (lineNo) {
            case 0: Sounds.lineMade1.play(); break;
            case 1: Sounds.lineMade2.play(); break;
            case 2: Sounds.lineMade3.play(); break;
            case 3: Sounds.lineMade4.play(); break;
            case 4: Sounds.lineMade5.play(); break;
            case 5: Sounds.lineMade6.play(); break;
            default:
              Sounds.lineMade1.play(); break;
          }
          let pointsLine = this.currentRound.roundPoints.lines[lineNo];
          let intermediaryBoard = this.currentRound.getIntermediaryBoard();
          this.boardOverlay.drawRoundLineTiles(intermediaryBoard, pointsLine)
          this.boardLayer.eraseRoundLineTiles(pointsLine);
          this.roundPointsLayer.drawRound(this.currentRound.roundPoints, lineNo);
          await this.app.delay(DURATIONS.MADE_A_LINE);
        }
        if (this.currentRound.roundPoints.hasTotal) {
          this.roundPointsLayer.drawRound(this.currentRound.roundPoints);
        }

        // this.boardLayer.drawBoard(this.currentRound.getFinalBoard())
        await this.app.delay(DURATIONS.ROUND_POINTS);
        // we don't await here as we disappear with the round points
        /*await*/ this.boardOverlay.setVisible(false, DURATIONS.OVERLAY_HIDDEN)
        //TODO this.focusLayer.currentFocus = this.crossLayer;
      } else {
        // I am not sure it is required, we already shown the intermediary board 
        this.boardLayer.drawBoard(this.currentRound.getFinalBoard())
        await this.app.delay(DURATIONS.NO_POINTS);
      }
      if (showRoundPoints) {
        this.roundPointsLayer.setVisible(false, DURATIONS.ROUND_POINTS_HIDDEN);
      }
      Sounds.startRound.play()
      await this.setCurrentRoundNo(this.state.currentRoundNo + 1)
    })
  }

  dragCross(pt: IPoint) {
    let playPos = this.getPlayPositionFromPoint(pt);

    if (playPos.isValid() && this.currentRound.roundNo < this.state.rounds.length) {
      //TODO this.focusLayer.currentFocus = this.crossLayer;
      let newPlayPosition = playPos.floor();
      Sounds.explosion.play();
      this.cross.moveToPlayPosition(newPlayPosition, { animate: DURATIONS.DRAG_CROSS_WITH_MOUSE });
      this.newPlayPosition = newPlayPosition;
      return true;
    } else {
      this.cross.moveCenterTo(pt);
      this.newPlayPosition = null;
    }
  }

  onGameBackgroundMouseEvent(event: LayerMouseEvent, pt: IPoint): boolean {
    switch (event.type) {
      case "down":
        let distanceToCross = Point.distance(pt, this.cross.getAbsolutePos(this.cross.getCenter()));
        let playPos = this.getPlayPositionFromPoint(pt);
        if (distanceToCross <= this.cross.size.w / 2 || playPos.isValid()) {
          this.draggingCross = true;
          this.app.setFocus(this.cross);
          this.dragCross(pt)
          return true;
        }
        break;
      case "drag":
        if (this.draggingCross) this.dragCross(pt)
        break;
      case "up":
        this.draggingCross = false;
        let newPlayPosition = this.newPlayPosition;
        if (newPlayPosition) {
          this.newPlayPosition = null;
          this.playCross(newPlayPosition!!);
        } else {
          this.cross.moveToPlayPosition(null, { init: true });
        }
        break;
    }
    return false;
  }
}
