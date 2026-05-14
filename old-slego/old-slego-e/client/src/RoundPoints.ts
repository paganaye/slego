import { BoardTiles, IPlayPosition, copyBoard } from "./core/BoardTiles";

export interface IRoundPoints {
  lines: IPointsLine[];
  covered: IPlayPosition[];
  roundScore: number;
  hasTotal: boolean
}

export interface IPointsLine {
  x: number;
  y: number;
  count: number;
  vertical: boolean;
}

export interface RoundScoreLine {
  left: string;
  value: number | string;
}

export function calcRoundPoints(board: BoardTiles, covered: IPlayPosition[]): IRoundPoints {
  const lines: IPointsLine[] = [];

  // Search for horizontal alignments
  for (let y = 0; y < 5; y++) {
    let count = 1;

    for (let x = 1; x < board[y].length; x++) {
      if (board[y][x] === board[y][x - 1] && board[y][x] !== "·") {
        count++;
        if (count >= 3 && x === board[y].length - 1) {
          lines.push({ x: x - count + 1, y, count, vertical: false });
        }
      } else {
        if (count >= 3) {
          lines.push({ x: x - count, y, count, vertical: false });
        }
        count = 1;
      }
    }
  }

  // Search for vertical alignments
  for (let x = 0; x < board[0].length; x++) {
    let count = 1;

    for (let y = 1; y < 5; y++) {
      if (board[y][x] === board[y - 1][x] && board[y][x] !== "·") {
        count++;
        if (count >= 3 && y === board.length - 1) {
          lines.push({ x, y: y - count + 1, count, vertical: true });
        }
      } else {
        if (count >= 3) {
          lines.push({ x, y: y - count, count, vertical: true });
        }
        count = 1;
      }
    }
  }

  let roundScore = 0
  let nbLines = lines.length;
  for (const align of lines) {
    switch (align.count) {
      case 3: roundScore += 10; break;
      case 4: roundScore += 20; break;
      case 5: roundScore += 30; break;
    }
  }
  roundScore *= nbLines;
  roundScore -= covered.length
  lines.sort((a, b) => a.count - b.count);
  let hasTotal = (nbLines > 1) || (covered.length > 0)
  return { lines, covered, roundScore, hasTotal };
}

export function calculateFinalBoard(intermediaryBoard: BoardTiles, roundPoints: IRoundPoints): BoardTiles {
  let finalBoard: BoardTiles = copyBoard(intermediaryBoard);

  for (const align of roundPoints.lines) {
    const { x, y, count, vertical } = align;

    // Replace horizontal alignments with "·"
    if (!vertical) {
      for (let i = 0; i < count; i++) {
        finalBoard[y][x + i] = "·";
      }
    }
    // Replace vertical alignments with "·"
    else {
      for (let i = 0; i < count; i++) {
        finalBoard[y + i][x] = "·";
      }
    }
  }
  return finalBoard;
}
