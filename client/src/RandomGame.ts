import { TileType, IHand } from "./core/BoardTiles";
import { Round } from "./core/Round";
import { Xoroshiro128Plus } from "./core/Xoroshiro128Plus";
import { fromBaseX } from "./core/baseX";

export class RandomGame {

  random: Xoroshiro128Plus;

  private constructor(seed: bigint) {
    this.random = new Xoroshiro128Plus(seed);
  }

  static getRandomGame(nbRounds: number, seed: string) {
    let bigIntSeed = fromBaseX(seed)
    let randomGame = new RandomGame(bigIntSeed);
    return randomGame.getRandomRounds(nbRounds)
  }

  private getRandomRounds(nbRounds: number): Round[] {
    let rounds: Round[] = []
    let previousRound: Round = Round.StartingRound;
    for (let roundNo = 0; roundNo <= nbRounds; roundNo++) {
      let newRound: Round = new Round(previousRound, roundNo == nbRounds ? null : this.getRandomHand());
      rounds.push(newRound);
      previousRound = newRound;
    }
    return rounds;
  }

  private getRandomTile(): TileType {
    switch (this.random.getRand(4)) {
      case 0: return "○"; // each have 18.75% chance
      case 1: return "✕";
      case 2: return "□";
      default: return "△";
    }
  }

  private getRandomTileOrUndefined(): TileType | undefined {
    if (this.random.getRand(4) == 0) {
      return undefined; // 25% chance
    } else {
      return this.getRandomTile();
    }
  }

  private getRandomHand(): IHand {
    return {
      top: this.getRandomTileOrUndefined(),
      left: this.getRandomTileOrUndefined(),
      center: this.getRandomTile(),
      right: this.getRandomTileOrUndefined(),
      bottom: this.getRandomTileOrUndefined()
    }
  }
}
