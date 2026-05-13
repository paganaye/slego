import { SlegoBoard, SlegoTile, LineScore, RoundScore } from './Types';

export class Board {
    private array: SlegoBoard;

    constructor(array?: SlegoBoard) {
        this.array = array?.slice() ?? this.createInitialState();
    }

    getColors(): any {
        return this.array.slice();
    }

    private createInitialState(): SlegoBoard {
        return Array(5).fill(null).map(() => Array(5).fill(null));
    }

    placeSlegoPiece(slegoTiles: SlegoTile[], col: number, row: number): { overwriteCount: number, newBoard: Board } {
        let overwriteCount = 0;
        const newArray = this.array.map(row => [...row]);

        for (const tile of slegoTiles) {
            const c = col + tile.dx;
            const r = row + tile.dy;

            if (c < 0 || c >= 5 || r < 0 || r >= 5) continue;

            if (newArray[r][c] !== null) {
                overwriteCount++;
            }

            newArray[r][c] = tile.color;
        }
        this.array = newArray;
        return { overwriteCount, newBoard: new Board(newArray) };
    }

    previewPiecePlacement(slegoTiles: SlegoTile[], col: number, row: number): { overwriteCount: number, newBoard: Board | null } {
        let overwriteCount = 0;
        const newArray = this.array.map(row => [...row]);

        for (const tile of slegoTiles) {
            const c = col + tile.dx;
            const r = row + tile.dy;

            if (c < 0 || c >= 5 || r < 0 || r >= 5) {
                // Part of the piece is off the board, so it can't be placed.
                // To be consistent with the original logic, we should probably allow this and just ignore off-board tiles.
                // The original code just `continue`d.
                continue;
            }

            if (newArray[r][c] !== null) {
                overwriteCount++;
            }

            newArray[r][c] = tile.color;
        }

        return { overwriteCount, newBoard: new Board(newArray) };
    }

    clearLines(lines: LineScore[]): Board {
        const newArray = this.array.map(row => [...row]);
        for (const line of lines) {
            if (line.type === 'horizontal') {
                for (let i = 0; i < line.length; i++) {
                    newArray[line.startRow][line.startCol + i] = null;
                }
            } else { // vertical
                for (let i = 0; i < line.length; i++) {
                    newArray[line.startRow + i][line.startCol] = null;
                }
            }
        }
        this.array = newArray;
        return new Board(newArray);
    }

    findLines(): LineScore[] {
        const lines: LineScore[] = [];

        const lengthPoints = [0, 0, 0, 10, 20, 30];

        // Check horizontal lines
        for (let row = 0; row < 5; row++) {
            let centerColor = this.array[row][2];
            if (!centerColor) continue;
            let start = 2;
            let end = 2;
            while (start > 0 && this.array[row][start - 1] === centerColor) start--;
            while (end < 4 && this.array[row][end + 1] === centerColor) end++;
            let length = (end - start) + 1;

            if (length >= 3) lines.push({
                type: 'horizontal',
                length,
                points: lengthPoints[length],
                color: centerColor,
                startCol: start,
                startRow: row
            })
        }

        // Check vertical lines
        for (let col = 0; col < 5; col++) {
            let centerColor = this.array[2][col];
            if (!centerColor) continue;
            let start = 2;
            let end = 2;
            while (start > 0 && this.array[start - 1][col] === centerColor) start--;
            while (end < 4 && this.array[end + 1][col] === centerColor) end++;
            let length = (end - start) + 1;

            if (length >= 3) lines.push({
                type: 'vertical',
                length,
                points: lengthPoints[length],
                color: centerColor,
                startCol: col,
                startRow: start
            })
        }

        return lines;
    }


    /**
 * Calculate score for a round after placing a piece
 */
    calculateRoundScore(
        previousRoundScore: RoundScore | null,
        overwriteCount: number
    ): RoundScore {
        const lines = this.findLines();
        const basePoints = lines.reduce((sum, line) => sum + line.points, 0);
        const multiplier = lines.length;
        const overwritePenalty = overwriteCount;
        const currentTotal = previousRoundScore?.gameTotal ?? 0;

        // Calculate the theoretical round score
        const theoreticalRoundScore = basePoints * multiplier - overwritePenalty;

        // But limit the actual round score so total can't go below 0
        const actualRoundScore = Math.max(theoreticalRoundScore, -currentTotal);
        const gameTotal = currentTotal + actualRoundScore;

        return {
            lines,
            basePoints,
            lineCount: multiplier,
            overwritePenalty,
            roundScore: actualRoundScore,
            theoreticalRoundScore,
            gameTotal
        };
    }

    clearCompletedLines(roundScore: RoundScore): Board {
        if (roundScore.lineCount === 0) {
            return this;
        }
        const newBoard = new Board(this.array);

        for (let line of roundScore.lines) {
            for (let i = 0; i < line.length; i++) {
                if (line.type == 'horizontal') newBoard.array[line.startRow][line.startCol + i] = null
                else newBoard.array[line.startRow + i][line.startCol] = null
            }
        }
        return newBoard;
    }


}