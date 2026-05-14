// // Tutorial Game Engine - Extends SlegoGame with tutorial-specific functionality

// import { SlegoGame } from './slego-game';
// import { ITutorialLevel, ITutorialStep } from './tutorial';
// import { Piece, IPosition, RoundResult, GAME_CONSTANTS, Color } from './slego';
// import { makeRng128, ReproducibleRNG } from './rng128';

// /**
//  * Tutorial-specific game state extension
//  */
// interface TutorialGameState {
//   tutorialLevel: ITutorialLevel;
//   currentInstructionIndex: number;
//   placementCount: number;
//   levelComplete: boolean;
//   rng: ReproducibleRNG;
// }

// /**
//  * Tutorial Game Engine that extends SlegoGame with guided learning functionality
//  */
// export class TutorialGame extends SlegoGame {
//   private tutorialState: TutorialGameState;

//   constructor(levelConfig: ITutorialLevel) {
//     super();

//     // Initialize tutorial-specific state
//     this.tutorialState = {
//       tutorialLevel: levelConfig,
//       currentInstructionIndex: 0,
//       placementCount: 0,
//       levelComplete: false,
//       rng: makeRng128(levelConfig.seed),
//     };

//     // Initialize the game with the level's pre-configured board
//     this.initializeTutorialLevel();
//   }

//   /**
//    * Initialize the tutorial level with pre-configured board and pieces
//    */
//   private initializeTutorialLevel(): void {
//     // Reset the base game state
//     this.resetGame();

//     // Get the current state and modify it for tutorial

//     // Replace the board with the level's initial board
//     (this as any).state.board = this.tutorialState.tutorialLevel.initialBoard;

//     // Generate tutorial-specific pieces using reproducible RNG
//     const tutorialPieces = this.generateTutorialPieces();
//     (this as any).state.pieces = tutorialPieces;
//     (this as any).state.currentPiece = tutorialPieces[0] || null;
//   }

//   /**
//    * Generate pieces using the level's reproducible RNG
//    */
//   private generateTutorialPieces(): Piece[] {
//     const pieces: Piece[] = [];
//     const { rng } = this.tutorialState;
//     const gameRounds = this.tutorialState.tutorialLevel.gameRounds ?? 40;

//     for (let i = 0; i < gameRounds; i++) {
//       const piece: Piece = {
//         center: this.getRandomColorFromRNG(rng),
//         arms: {},
//       };

//       // Randomly add arms using RNG (each arm has 50% chance)
//       const armDirections = ['up', 'down', 'left', 'right'] as const;

//       for (const direction of armDirections) {
//         if (rng.float() < 0.5) {
//           piece.arms[direction] = this.getRandomColorFromRNG(rng);
//         }
//       }

//       pieces.push(piece);
//     }

//     return pieces;
//   }

//   /**
//    * Get a random color using the reproducible RNG
//    */
//   private getRandomColorFromRNG(rng: ReproducibleRNG): Color {
//     const colors = [...GAME_CONSTANTS.COLORS];
//     return rng.pick(colors);
//   }

//   /**
//    * Get the current instruction that should be displayed
//    */
//   getCurrentInstruction(): ITutorialStep | null {
//     const { steps: instructions } = this.tutorialState.tutorialLevel;

//     if (this.tutorialState.currentInstructionIndex >= instructions.length) {
//       return null;
//     }

//     return instructions[this.tutorialState.currentInstructionIndex] || null;
//   }

//   /**
//    * Advance to the next instruction
//    */
//   advanceInstruction(): void {
//     this.tutorialState.currentInstructionIndex++;
//   }

//   /**
//    * Get hint position for piece placement (if specified in current instruction)
//    */
//   getHintPosition(): IPosition | null {
//     const currentInstruction = this.getCurrentInstruction();
//     return currentInstruction
//       && typeof currentInstruction.requiredAction == 'object'
//       && currentInstruction.requiredAction.type == 'play' ? currentInstruction?.requiredAction
//       : null;
//   }

//   /**
//    * Check if the tutorial level is complete based on completion criteria
//    */
//   isLevelComplete(): boolean {
//     if (this.tutorialState.levelComplete) {
//       return true;
//     }

//     //const { completionCriteria } = this.tutorialState.levelConfig;
//     //    const gameState = this.getState();

//     // Special case: if no pieces to generate and no placements required, complete immediately
//     // if (
//     //   this.tutorialState.levelConfig.gameRounds === 0 &&
//     //   completionCriteria.requiredPlacements === 0
//     // ) {
//     //   this.tutorialState.levelComplete = true;
//     //   return true;
//     // }

//     // // Check if minimum score requirement is met (if specified)
//     // if (completionCriteria.minScore !== undefined) {
//     //   if (gameState.totalScore < completionCriteria.minScore) {
//     //     return false;
//     //   }
//     // }

//     // // Check if required number of placements is met
//     // if (this.tutorialState.placementCount < completionCriteria.requiredPlacements) {
//     //   return false;
//     // }

//     // // Check if all pieces must be completed
//     // if (completionCriteria.mustCompleteAllPieces) {
//     //   const totalPieces = this.tutorialState.levelConfig.gameRounds ?? 40;
//     //   if (this.tutorialState.placementCount < totalPieces) {
//     //     return false;
//     //   }
//     // }

//     // All criteria met
//     this.tutorialState.levelComplete = true;
//     return true;
//   }

//   /**
//    * Override piece placement to handle tutorial-specific logic
//    */
//   override placePiece(position: IPosition): RoundResult {
//     // Call the parent implementation
//     const result = super.placePiece(position);

//     // Update tutorial state
//     this.tutorialState.placementCount++;

//     // Advance instruction after placement
//     this.advanceInstruction();

//     // Check if level is complete
//     this.isLevelComplete();

//     return result;
//   }

//   /**
//    * Get tutorial-specific game information
//    */
//   getTutorialInfo() {
//     const { tutorialLevel: levelConfig } = this.tutorialState;

//     return {
//       levelId: levelConfig.id,
//       levelName: levelConfig.name,
//       objective: levelConfig.objective,
//       placementCount: this.tutorialState.placementCount,
//       //requiredPlacements: levelConfig.completionCriteria.requiredPlacements,
//       isComplete: this.isLevelComplete(),
//       currentInstruction: this.getCurrentInstruction(),
//       hintPosition: this.getHintPosition(),
//     };
//   }

//   /**
//    * Get the level configuration
//    */
//   getLevelConfig(): ITutorialLevel {
//     return this.tutorialState.tutorialLevel;
//   }

//   /**
//    * Reset the tutorial level to its initial state
//    */
//   resetTutorialLevel(): void {
//     this.tutorialState.currentInstructionIndex = 0;
//     this.tutorialState.placementCount = 0;
//     this.tutorialState.levelComplete = false;
//     this.tutorialState.rng.reset();

//     this.initializeTutorialLevel();
//   }

//   /**
//    * Serialize tutorial game state
//    */
//   serializeTutorial(): string {
//     const baseState = this.serialize();
//     const tutorialData = {
//       levelConfig: this.tutorialState.tutorialLevel,
//       currentInstructionIndex: this.tutorialState.currentInstructionIndex,
//       placementCount: this.tutorialState.placementCount,
//       levelComplete: this.tutorialState.levelComplete,
//       rngState: this.tutorialState.rng.serialize(),
//     };

//     return JSON.stringify({
//       baseState,
//       tutorialData,
//     });
//   }

//   /**
//    * Deserialize tutorial game state
//    */
//   static deserializeTutorial(data: string): TutorialGame {
//     const parsed = JSON.parse(data);
//     const { baseState, tutorialData } = parsed;

//     // Create tutorial game with the level config
//     const tutorialGame = new TutorialGame(tutorialData.levelConfig);

//     // Restore base game state
//     const baseGame = SlegoGame.deserialize(baseState);
//     (tutorialGame as any).state = (baseGame as any).state;

//     // Restore tutorial state
//     tutorialGame.tutorialState.currentInstructionIndex = tutorialData.currentInstructionIndex;
//     tutorialGame.tutorialState.placementCount = tutorialData.placementCount;
//     tutorialGame.tutorialState.levelComplete = tutorialData.levelComplete;
//     tutorialGame.tutorialState.rng.deserialize(tutorialData.rngState);

//     return tutorialGame;
//   }

//   /**
//    * Check if a specific instruction should be shown now
//    */
//   shouldShowInstruction(
//     _instruction: ITutorialStep,
//     _timing: 'start' | 'piece-shown' | 'placement'
//   ): boolean {
//     // return (
//     //   instruction.showAfter === timing &&
//     //   instruction.step <= this.tutorialState.currentInstructionIndex + 1
//     // );
//     return true;
//   }

//   /**
//    * Get completion progress as a percentage
//    */
//   getCompletionProgress(): number {
//     const tutorialLevel = this.tutorialState.tutorialLevel;
//     return Math.min(100, (this.tutorialState.placementCount / (tutorialLevel.gameRounds ?? 40)) * 100);
//   }
// }
