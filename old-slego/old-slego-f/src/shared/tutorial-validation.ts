// // Tutorial Level Validation Functions

// import { ITutorialLevel, LevelValidationResult } from './tutorial';
// import { GAME_CONSTANTS } from './slego';
// import { isValidPosition } from './slego-utils';

// /**
//  * Validate a single tutorial level configuration
//  */
// export function validateLevelConfig(level: ITutorialLevel): LevelValidationResult {
//   const errors: string[] = [];
//   const warnings: string[] = [];

//   // Validate basic properties
//   if (!level.id || level.id < 1) {
//     errors.push(`Level ID must be a positive number, got: ${level.id}`);
//   }

//   if (!level.name || level.name.trim().length === 0) {
//     errors.push('Level name cannot be empty');
//   }

//   if (!level.description || level.description.trim().length === 0) {
//     errors.push('Level description cannot be empty');
//   }

//   if (!level.objective || level.objective.trim().length === 0) {
//     errors.push('Level objective cannot be empty');
//   }

//   if (!level.seed || level.seed.trim().length === 0) {
//     errors.push('Level seed cannot be empty');
//   }

//   // Validate piece count
//   if (!level.gameRounds || level.gameRounds < 1) {
//     errors.push(`Pieces to generate must be at least 1, got: ${level.gameRounds}`);
//   }

//   if (level.gameRounds > GAME_CONSTANTS.TOTAL_ROUNDS) {
//     warnings.push(
//       `Pieces to generate (${level.gameRounds}) exceeds normal game rounds (${GAME_CONSTANTS.TOTAL_ROUNDS})`
//     );
//   }

//   // Validate board structure
//   if (!level.initialBoard) {
//     errors.push('Initial board is missing or invalid');
//   } else {
//     try {
//       const cells = level.initialBoard.getCells();
//       // Check board dimensions
//       if (cells.length !== GAME_CONSTANTS.BOARD_SIZE) {
//         errors.push(`Board must have ${GAME_CONSTANTS.BOARD_SIZE} rows, got: ${cells.length}`);
//       } else {
//         // Check each row
//         for (let row = 0; row < cells.length; row++) {
//           const rowData = cells[row];
//           if (!Array.isArray(rowData)) {
//             errors.push(`Board row ${row} is not an array`);
//             continue;
//           }

//           if (rowData.length !== GAME_CONSTANTS.BOARD_SIZE) {
//             errors.push(
//               `Board row ${row} must have ${GAME_CONSTANTS.BOARD_SIZE} columns, got: ${rowData.length}`
//             );
//             continue;
//           }

//           // Check each cell
//           for (let col = 0; col < rowData.length; col++) {
//             const cell = rowData[col];
//             if (cell !== null && !GAME_CONSTANTS.COLORS.includes(cell as any)) {
//               errors.push(`Invalid color at position (tx: ${col}, ty: ${row}): ${cell}`);
//             }
//           }
//         }
//       }
//     } catch (error) {
//       errors.push('Failed to access board cells');
//     }
//   }

//   // Validate instructions
//   if (!level.steps || !Array.isArray(level.steps)) {
//     errors.push('Instructions must be an array');
//   } else {
//     if (level.steps.length === 0) {
//       warnings.push('Level has no instructions - consider adding guidance for players');
//     }

//     const stepNumbers = new Set<number>();
//     for (let i = 0; i < level.steps.length; i++) {
//       const instruction = level.steps[i];
//       if (!instruction) continue;

//       if (!instruction.step || instruction.step < 1) {
//         errors.push(`Instruction ${i} has invalid step number: ${instruction.step}`);
//       }

//       if (stepNumbers.has(instruction.step)) {
//         errors.push(`Duplicate step number: ${instruction.step}`);
//       }
//       stepNumbers.add(instruction.step);

//       if (!instruction.text || instruction.text.trim().length === 0) {
//         errors.push(`Instruction ${i} has empty text`);
//       }

//       if (!['start', 'piece-shown', 'placement'].includes(instruction.showAfter)) {
//         errors.push(`Instruction ${i} has invalid showAfter value: ${instruction.showAfter}`);
//       }

//       // Validate highlight position if provided
//       if (instruction.requiredAction && !isValidPosition(instruction.requiredAction)) {
//         errors.push(
//           `Instruction ${i} has invalid highlight position: (${instruction.requiredAction.tx}, ${instruction.requiredAction.ty})`
//         );
//       }
//     }
//   }

//   // Validate completion criteria
//   if (!level.completionCriteria) {
//     errors.push('Completion criteria is required');
//   } else {
//     const criteria = level.completionCriteria;

//     if (!criteria.requiredPlacements || criteria.requiredPlacements < 1) {
//       errors.push(`Required placements must be at least 1, got: ${criteria.requiredPlacements}`);
//     }

//     if (criteria.requiredPlacements > level.gameRounds) {
//       errors.push(
//         `Required placements (${criteria.requiredPlacements}) cannot exceed pieces to generate (${level.gameRounds})`
//       );
//     }

//     if (criteria.minScore !== undefined && criteria.minScore < 0) {
//       warnings.push(`Minimum score is negative: ${criteria.minScore}`);
//     }

//     if (typeof criteria.mustCompleteAllPieces !== 'boolean') {
//       errors.push('mustCompleteAllPieces must be a boolean value');
//     }
//   }

//   return {
//     isValid: errors.length === 0,
//     errors,
//     warnings,
//   };
// }

// /**
//  * Validate all tutorial levels
//  */
// export function validateAllLevels(levels: ITutorialLevel[]): LevelValidationResult {
//   const allErrors: string[] = [];
//   const allWarnings: string[] = [];

//   if (!Array.isArray(levels)) {
//     return {
//       isValid: false,
//       errors: ['Levels must be an array'],
//       warnings: [],
//     };
//   }

//   if (levels.length === 0) {
//     return {
//       isValid: false,
//       errors: ['At least one level is required'],
//       warnings: [],
//     };
//   }

//   // Check for duplicate IDs
//   const levelIds = new Set<number>();
//   const duplicateIds: number[] = [];

//   for (const level of levels) {
//     if (levelIds.has(level.id)) {
//       duplicateIds.push(level.id);
//     }
//     levelIds.add(level.id);
//   }

//   if (duplicateIds.length > 0) {
//     allErrors.push(`Duplicate level IDs found: ${duplicateIds.join(', ')}`);
//   }

//   // Check for sequential IDs starting from 1
//   const sortedIds = Array.from(levelIds).sort((a, b) => a - b);
//   for (let i = 0; i < sortedIds.length; i++) {
//     if (sortedIds[i] !== i + 1) {
//       allWarnings.push(
//         `Level IDs should be sequential starting from 1. Missing or out of order: ${i + 1}`
//       );
//       break;
//     }
//   }

//   // Validate each level individually
//   for (const level of levels) {
//     const result = validateLevelConfig(level);

//     // Prefix errors and warnings with level ID
//     result.errors.forEach((error) => {
//       allErrors.push(`Level ${level.id}: ${error}`);
//     });

//     result.warnings.forEach((warning) => {
//       allWarnings.push(`Level ${level.id}: ${warning}`);
//     });
//   }

//   // Check progression difficulty
//   validateLevelProgression(levels, allWarnings);

//   return {
//     isValid: allErrors.length === 0,
//     errors: allErrors,
//     warnings: allWarnings,
//   };
// }

// /**
//  * Validate that levels have appropriate difficulty progression
//  */
// function validateLevelProgression(levels: ITutorialLevel[], warnings: string[]): void {
//   const sortedLevels = [...levels].sort((a, b) => a.id - b.id);

//   for (let i = 1; i < sortedLevels.length; i++) {
//     const prevLevel = sortedLevels[i - 1];
//     const currentLevel = sortedLevels[i];

//     if (!prevLevel || !currentLevel) continue;

//     // Check if piece count generally increases
//     if (currentLevel.gameRounds < prevLevel.gameRounds) {
//       warnings.push(
//         `Level ${currentLevel.id} has fewer pieces (${currentLevel.gameRounds}) than previous level ${prevLevel.id} (${prevLevel.gameRounds})`
//       );
//     }

//     // Check if minimum score requirements generally increase
//     if (prevLevel.completionCriteria.minScore && currentLevel.completionCriteria.minScore) {
//       if (currentLevel.completionCriteria.minScore < prevLevel.completionCriteria.minScore) {
//         warnings.push(
//           `Level ${currentLevel.id} has lower minimum score (${currentLevel.completionCriteria.minScore}) than previous level ${prevLevel.id} (${prevLevel.completionCriteria.minScore})`
//         );
//       }
//     }
//   }
// }

// /**
//  * Validate that a level configuration is suitable for tutorial purposes
//  */
// export function validateTutorialSuitability(level: ITutorialLevel): LevelValidationResult {
//   const errors: string[] = [];
//   const warnings: string[] = [];

//   // Basic validation first
//   const basicValidation = validateLevelConfig(level);
//   errors.push(...basicValidation.errors);
//   warnings.push(...basicValidation.warnings);

//   if (!basicValidation.isValid) {
//     return { isValid: false, errors, warnings };
//   }

//   // Tutorial-specific validation
//   if (level.gameRounds > 10) {
//     warnings.push('Tutorial levels with more than 10 pieces may be overwhelming for new players');
//   }

//   if (level.steps.length === 0) {
//     errors.push('Tutorial levels must have at least one instruction');
//   }

//   // Check for start instruction
//   const hasStartInstruction = level.steps.some((inst) => inst.showAfter === 'start');
//   if (!hasStartInstruction) {
//     warnings.push('Tutorial levels should have at least one instruction shown at start');
//   }

//   // Check instruction text length
//   for (const instruction of level.steps) {
//     if (instruction.text.length > 200) {
//       warnings.push(
//         `Instruction step ${instruction.step} is very long (${instruction.text.length} chars) - consider breaking it up`
//       );
//     }
//   }

//   // Check for reasonable completion criteria
//   if (level.completionCriteria.minScore && level.completionCriteria.minScore > 100) {
//     warnings.push(
//       `High minimum score requirement (${level.completionCriteria.minScore}) may be difficult for tutorial players`
//     );
//   }

//   return {
//     isValid: errors.length === 0,
//     errors,
//     warnings,
//   };
// }
