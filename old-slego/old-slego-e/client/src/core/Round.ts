import { IRoundPoints, calcRoundPoints, calculateFinalBoard } from "../RoundPoints";
import { BoardTiles, IHand, IPlayPosition, PlayPosition, copyBoard, emptyBoardTiles, placeCross } from "./BoardTiles";


export class Round {
  readonly roundNo: number;
  playPosition: IPlayPosition | null = null;
  roundPoints: IRoundPoints = { lines: [], covered: [], roundScore: 0, hasTotal: false };
  newGameScore: number = 0;
  intermediaryBoard: BoardTiles | null = null;
  finalBoard: BoardTiles | null = null;
  covered: IPlayPosition[] = [];

  static StartingRound: Round = new Round(null, {} as IHand);

  constructor(
    readonly previousRound: Round | null,
    readonly draw: IHand | null) {
    this.roundNo = previousRound ? previousRound.roundNo + 1 : 0;
  }

  shouldShowRoundPoints(): boolean {
    let currentGameScore = this.newGameScore;
    let previousGameScore = this.previousRound?.newGameScore ?? 0;
    return currentGameScore != previousGameScore;
  }

  clearPlay() {
    this.intermediaryBoard = null;
    this.finalBoard = null;
    this.playPosition = null;
    this.newGameScore = (this.previousRound?.newGameScore) ?? 0;
  }

  play(newPlayPosition: IPlayPosition) {
    this.playPosition = PlayPosition.from(newPlayPosition);
    this.calculateIntermediaryBoard();
    this.calculateFinalBoard();
  }

  private calculateIntermediaryBoard() {
    let newIntermediaryBoard = copyBoard(this.getStartingBoard());
    this.covered = [];
    if (this.playPosition) {
      placeCross(newIntermediaryBoard, this.covered, this.draw!, this.playPosition);
    }
    this.intermediaryBoard = newIntermediaryBoard;
  }


  private calculateFinalBoard() {
    let intermediaryBoard = this.getIntermediaryBoard();
    this.roundPoints = calcRoundPoints(intermediaryBoard!, this.covered);
    let newFinalBoard = calculateFinalBoard(intermediaryBoard, this.roundPoints);
    let newScore = (this.previousRound?.newGameScore ?? 0) + this.roundPoints.roundScore;
    if (newScore < 0) newScore = 0;
    this.newGameScore = newScore;
    this.finalBoard = newFinalBoard;
  }

  getStartingBoard(): BoardTiles {
    return (this.previousRound) ? this.previousRound.getFinalBoard()
      : emptyBoardTiles();
  }

  getCurrentBoard(): BoardTiles {
    return (this.playPosition) ? this.getFinalBoard()
      : this.getStartingBoard();

  }

  getIntermediaryBoard(): BoardTiles {
    if (!this.intermediaryBoard) {
      this.calculateIntermediaryBoard();
    }
    return this.intermediaryBoard!;
  }

  getFinalBoard(): BoardTiles {
    if (!this.finalBoard) {
      this.calculateFinalBoard();
    }
    return this.finalBoard!;
  }

}
