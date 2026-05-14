// // Game Logic Service - Pure game logic without DOM dependencies
// import { SlegoGame } from '../../shared/slego-game';
// import { Position, Piece } from '../../shared/slego';
// import { Signal } from '../Signal';

// export interface GameState {
//   readonly slegoGame: SlegoGame | null;
//   readonly gameMode: 'competition' | 'tutorial';
//   readonly currentScreen: 'menu' | 'game' | 'result';
// }

// export class GameLogicService {
//   private state = new Signal<GameState>({
//     slegoGame: null,
//     gameMode: 'competition',
//     currentScreen: 'menu',
//   });

//   // Game actions
//   startGame() {
//     this.state.set({
//       ...this.state.get(), slegoGame: new SlegoGame(),
//       gameMode: 'competition',
//       currentScreen: 'game',
//     });
//   }

//   handleCellClick(tx: number, ty: number) {
//     let game = this.state.get().slegoGame;
//     if (!game) return false;

//     const position: Position = { tx, ty };

//     if (game.canPlacePiece(position)) {
//       game.setSelectedPosition(position);
//       return true;
//     }
//     return false;
//   }

//   placePiece(): boolean {
//     let game = this.state.get().slegoGame;
//     if (!game || !game.getSelectedPosition()) return false;

//     try {
//       game.placePiece(game.getSelectedPosition()!);
//       return true;
//     } catch (error) {
//       console.error('Error placing piece:', error);
//       return false;
//     }
//   }

//   passRound(): boolean {
//     let game = this.state.get().slegoGame;
//     if (!game) return false;

//     try {
//       game.passRound();
//       return true;
//     } catch (error) {
//       console.error('Error passing round:', error);
//       return false;
//     }
//   }
// }

// // Singleton instance
// export const gameLogic = new GameLogicService();
