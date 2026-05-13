// SLEGO Game Types and Constants

import { Rng128 } from "./Rng128";
import { ITutorialLevel } from "./tutorial";

export type Color = 'RED' | 'BLUE' | 'GREEN' | 'MAGENTA';

export interface IPosition {
    tx: number;
    ty: number;
}

export interface ITile extends IPosition {
    color: Color;
}

export interface Piece {
    center: Color;
    up?: Color;
    down?: Color;
    left?: Color;
    right?: Color;
}

export class Game {
    readonly rounds: number;
    readonly name: string;
    readonly pieces: Piece[];
    readonly tutorial?: ITutorialLevel | undefined;
    readonly seed?: string;

    private constructor(props: {
        name: string,
        pieces: Piece[],
        seed: string,
        tutorial?: ITutorialLevel | undefined,
        initialBoard: Array<Array<Color | null>> | undefined
    }) {
        this.name = props.name;
        this.pieces = props.pieces;
        this.seed = props.seed;
        this.tutorial = props.tutorial;
        this.rounds = props.pieces.length
    }

    static random(options: { rounds: number, seed: string, name: string }) {
        let pieces = Game.getRandomGamePieces(options.rounds, options.seed);
        return new Game({ name: options.name, pieces, seed: options.seed, tutorial: undefined, initialBoard: undefined });
    }
    static fromTutorial(tutorial: ITutorialLevel) {
        let pieces = Game.getRandomGamePieces(tutorial.rounds, tutorial.seed);
        return new Game({ name: tutorial.name, pieces, seed: tutorial.seed, tutorial: tutorial, initialBoard: tutorial.initialBoard });
    }

    static getRandomGamePieces(count: number = 40, seed: string = new Date().toISOString()): Piece[] {
        function generateRandomPiece(rng: Rng128): Piece {
            const piece: Piece = {
                center: getRandomColor(rng)
            };
            const armDirections = ['up', 'down', 'left', 'right'] as const;

            for (const direction of armDirections) {
                if (rng.nextFloat() < 0.5) {
                    piece[direction] = getRandomColor(rng);
                }
            }
            return piece;
        }

        let rng = new Rng128(seed);
        const pieces: Piece[] = [];
        for (let i = 0; i < count; i++) {
            pieces.push(generateRandomPiece(rng));
        }
        return pieces;
    }
}

export interface LineSegment {
    direction: 'horizontal' | 'vertical';
    start: IPosition;
    length: number;
    color: Color;
    segmentScore: number;
}

interface NextRoundArgs {
    baseScore: number;
    overwrites: number;
    playPosition: IPosition | null;
    roundScore: number;
    segments: LineSegment[];
    intermediaryBoard: Board;

    board: Board;
    total: number;
}

export class Round {
    readonly roundNo: number;
    readonly intermediaryBoard: Board;
    readonly board: Board;
    readonly playPosition: IPosition | null;
    readonly segments: LineSegment[];
    readonly baseScore: number;
    readonly overwrites: number;
    readonly roundScore: number;
    readonly total: number;
    readonly piece: Readonly<Piece> | null;

    private constructor(readonly game: Game, previousRound: Round | null, args: NextRoundArgs) {
        this.roundNo = previousRound ? previousRound.roundNo + 1 : 0;
        this.board = args.board;
        this.intermediaryBoard = args.intermediaryBoard;
        this.piece = this.getPiece(this.roundNo - 1);
        this.playPosition = args.playPosition;
        this.segments = args.segments;
        this.baseScore = args.baseScore;
        this.overwrites = args.overwrites;
        this.roundScore = args.roundScore;
        this.total = args.total;
    }

    private getPiece(roundNo: number) {
        return this.game.pieces[roundNo] ?? null
    }

    static roundZero(game: Game): Round {
        return new Round(game, null, {
            baseScore: 0,
            intermediaryBoard: new Board(),
            board: new Board(),
            overwrites: 0,
            playPosition: null,
            roundScore: 0,
            segments: [],
            total: 0
        });
    }

    static newRound(
        previousRound: Round,
        args: NextRoundArgs): Round {
        return new Round(previousRound.game, previousRound, args);
    }

    pass(): Round {
        return new Round(this.game, this, {
            baseScore: 0,
            board: this.board,
            intermediaryBoard: this.board,
            overwrites: 0,
            playPosition: null,
            roundScore: 0,
            segments: [],
            total: this.total
        });
    }

    withPiecePlaced(piece: Piece, playPosition: IPosition): Round {
        if (!piece || !playPosition) return this;
        let { intermediaryCells, overwrites } = this._placePiece(piece, playPosition);
        let segments = this._findSegments(intermediaryCells);
        let { baseScore, roundScore, total } = this._calcScore(this, overwrites, segments);
        let finalCells = this._clearCompletedSegments(intermediaryCells, segments);
        return Round.newRound(this, {
            baseScore,
            intermediaryBoard: new Board(intermediaryCells),
            board: new Board(finalCells),
            overwrites,
            playPosition,
            roundScore,
            segments,
            total
        });
    }

    nextPiece(): Piece | null {
        return this.getPiece(this.roundNo);
    }

    _placePiece(piece: Piece, playPosition: IPosition): { intermediaryCells: Array<Array<Color | null>>, overwrites: number } {
        const intermediaryCells = this.board.getCells();
        let overwrites = 0;

        function place(color: Color | undefined, dx: number, dy: number) {
            if (!color) return;
            const tx = playPosition.tx + dx;
            const ty = playPosition.ty + dy;
            if (isValidPosition(tx, ty)) {
                let originalColor = intermediaryCells[ty]![tx]!;
                if (originalColor) overwrites += 1;
                intermediaryCells[ty]![tx] = color;
            }
        }

        place(piece.center, 0, 0);
        place(piece.up, 0, -1);
        place(piece.down, 0, 1);
        place(piece.left, -1, 0);
        place(piece.right, 1, 0);

        return {
            intermediaryCells,
            overwrites
        };
    }

    _findSegments(newCells: Array<Array<Color | null>>): LineSegment[] {
        const getColorAt = (x: number, y: number) => {
            return newCells[y]![x]!;
        }

        const getSegmentScore = (length: number) => {
            switch (length) {
                case 3:
                    return GAME_CONSTANTS.SCORING.THREE_IN_ROW;

                case 4:
                    return GAME_CONSTANTS.SCORING.FOUR_IN_ROW;

                case 5:
                    return GAME_CONSTANTS.SCORING.FIVE_IN_ROW;
                default:
                    return 0;
            }
        }

        const findLineSegments = () => {
            const segments: LineSegment[] = [];

            // Check horizontal lines
            for (let ty = 0; ty < GAME_CONSTANTS.BOARD_SIZE; ty++) {
                let currentColor: Color | null = null;
                let startTx = 0;
                let length = 0;

                for (let tx = 0; tx <= GAME_CONSTANTS.BOARD_SIZE; tx++) {
                    const cellColor = tx < GAME_CONSTANTS.BOARD_SIZE ? getColorAt(tx, ty) : null;

                    if (cellColor === currentColor && cellColor !== null) {
                        length++;
                    } else {
                        // End of current segment
                        if (currentColor !== null && length >= GAME_CONSTANTS.MIN_SEGMENT_LENGTH) {
                            segments.push({
                                start: { tx: startTx, ty },
                                color: currentColor,
                                length,
                                direction: 'horizontal',
                                segmentScore: getSegmentScore(length),
                            });
                        }
                        // Start new segment
                        currentColor = cellColor;
                        startTx = tx;
                        length = 1;
                    }
                }
            }

            // Check vertical lines
            for (let tx = 0; tx < GAME_CONSTANTS.BOARD_SIZE; tx++) {
                let currentColor: Color | null = null;
                let startTy = 0;
                let length = 0;

                for (let ty = 0; ty <= GAME_CONSTANTS.BOARD_SIZE; ty++) {
                    const cellColor = ty < GAME_CONSTANTS.BOARD_SIZE ? getColorAt(tx, ty) : null;

                    if (cellColor === currentColor && cellColor !== null) {
                        length++;
                    } else {
                        // End of current segment
                        if (currentColor !== null && length >= GAME_CONSTANTS.MIN_SEGMENT_LENGTH) {
                            segments.push({
                                start: { tx, ty: startTy },
                                color: currentColor,
                                length,
                                direction: 'vertical',
                                segmentScore: getSegmentScore(length)
                            });
                        }
                        // Start new segment
                        currentColor = cellColor;
                        startTy = ty;
                        length = 1;
                    }
                }
            }
            return segments;


        }

        const segments = findLineSegments();
        return segments;
    }

    _calcScore(previousRound: Round | null = null,
        overwrites: number,
        segments: LineSegment[]): { baseScore: number, roundScore: number, total: number } {

        const baseScore = segments.reduce((a, s) => a + s.segmentScore, 0);
        const linesFormed = segments.length;
        const previousRoundTotal = previousRound ? previousRound.total : 0;

        // Apply multiplier and penalty - ENSURE SCORE NEVER GOES BELOW 0
        let roundScore = baseScore * linesFormed - overwrites;
        let total = previousRoundTotal + roundScore;


        if (total < 0) {
            roundScore = -previousRoundTotal
            total = 0;
        }
        return { baseScore, roundScore, total };
    }

    _clearCompletedSegments(intermediaryCells: Array<Array<Color | null>>,
        segments: LineSegment[]): Array<Array<Color | null>> {
        let newCells: Array<Array<Color | null>> = intermediaryCells.map((row) => [...row]);
        for (const segment of segments) {
            if (segment.direction === 'horizontal') {
                // Clear horizontal line
                for (let i = 0; i < segment.length; i++) {
                    let tx = segment.start.tx + i;
                    const row = newCells[segment.start.ty];
                    if (row) {
                        row[tx] = null;
                    }
                }
            } else {
                // Clear vertical line
                for (let i = 0; i < segment.length; i++) {
                    let ty = segment.start.ty + i;
                    const row = newCells[ty];
                    if (row) {
                        row[segment.start.tx] = null;
                    }
                }
            }
        }
        return newCells;
    }

}

export type ReadonlyCells = ReadonlyArray<ReadonlyArray<Color | null>>;

export class Board {
    private readonly cells: ReadonlyCells;

    constructor(cells?: ReadonlyCells) {
        if (cells) {
            // Deep copy to ensure immutability
            this.cells = cells.map((row) => [...row]);
        } else {
            // Create empty board
            this.cells = Array(GAME_CONSTANTS.BOARD_SIZE)
                .fill(null)
                .map(() => Array(GAME_CONSTANTS.BOARD_SIZE).fill(null));
        }
    }

    getCells() {
        return this.cells.map((row) => [...row])
    }

    getColorAt(x: number, y: number) {
        return this.cells[y]![x]!;
    }

}

// Game Constants
export const GAME_CONSTANTS = {
    BOARD_SIZE: 5,
    TOTAL_ROUNDS: 40,
    COLORS: ['RED', 'BLUE', 'GREEN', 'MAGENTA'] as const,
    MIN_SEGMENT_LENGTH: 3,
    SCORING: {
        THREE_IN_ROW: 10,
        FOUR_IN_ROW: 20,
        FIVE_IN_ROW: 30,
        OVERWRITE_PENALTY: -1,
    },
} as const;

export type GameColor = (typeof GAME_CONSTANTS.COLORS)[number];

export function isValidPosition(x: number, y: number): boolean {
    return (x >= 0 && x < GAME_CONSTANTS.BOARD_SIZE
        && y >= 0 && y < GAME_CONSTANTS.BOARD_SIZE);
}


export function getRandomColor(rng: Rng128): Color {
    const colors = GAME_CONSTANTS.COLORS;
    const randomIndex = rng.nextInt(colors.length);
    return colors[randomIndex] as Color;
}

