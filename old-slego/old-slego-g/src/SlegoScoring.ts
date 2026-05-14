import { SlegoBoard } from './Types.js';


/**
 * Find all qualifying lines (3+ consecutive same color) in the current board state
 */





/**
 * Create an empty SLEGO board
 */
export function array5x5(value: number | null): SlegoBoard {
    let result = Array.from({ length: 5 }, () => Array(5).fill(value));
    return result;
}
