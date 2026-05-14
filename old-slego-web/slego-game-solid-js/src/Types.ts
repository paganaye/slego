export type SlegoColor = 'red' | 'blue' | 'green' | 'magenta';

export type SlegoBoard = (SlegoColor | null)[][];

export interface LineScore {
    type: 'horizontal' | 'vertical';
    length: number;
    points: number;
    color: SlegoColor;
    startCol: number;
    startRow: number;
}

export interface RoundScore {
    lines: LineScore[];
    basePoints: number;
    lineCount: number;
    overwritePenalty: number;
    roundScore: number;
    theoreticalRoundScore: number;
    gameTotal: number;
}

export interface SlegoTile {
    dx: number;
    dy: number;
    color: SlegoColor;
}
