import { RandomGame } from "../RandomGame";
import { Round } from "./Round";
import { toBaseX } from "./baseX";



export class GameState {
  readonly rounds: Round[] = [];
  currentRoundNo: number = 0;

  constructor(readonly nbRounds: number, readonly seed: string) {
    this.rounds = RandomGame.getRandomGame(nbRounds, seed);
    this.currentRoundNo = 0;
  }

  toPlayBaseX(): string {
    let result = 0n;
    let multipler = 1n;
    for (let round of this.rounds) {
      let playPosition = round.playPosition;
      let playPosNumber = playPosition ? BigInt(playPosition.tx + playPosition.ty * 5) : 26n;
      result += playPosNumber * multipler;
      multipler *= 26n;
    }
    return toBaseX(result);
  }

  fromPlayBaseX(baseX: bigint) {
    let multipler = 1n;
    for (let round of this.rounds) {
      let playPosNumber = (baseX / multipler) % 26n;
      if (playPosNumber == 26n) {
        round.playPosition = null;
      } else {
        let tx: number, ty: number;
        tx = Number(playPosNumber % 5n);
        ty = Number((playPosNumber / 5n) % 5n);
        round.playPosition = { tx, ty };
      }
    }
  }
}
