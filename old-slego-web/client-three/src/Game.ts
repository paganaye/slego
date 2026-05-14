// ─── Constants ────────────────────────────────────────────────────────────────

export const BOARD_SIZE = 5;
export const TOTAL_ROUNDS = 40;
export const MIN_SEGMENT_LENGTH = 3;

export const SEGMENT_SCORE: Record<number, number> = {
    3: 10,
    4: 20,
    5: 30,
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type TokenSymbol = 'SQUARE' | 'CROSS' | 'TRIANGLE' | 'CIRCLE';

export const TokenSymbols: TokenSymbol[] = ['SQUARE', 'CROSS', 'TRIANGLE', 'CIRCLE'];

export interface Position {
    tx: number;
    ty: number;
}

/** One tile of a piece, with its offset from the center and its color */
export interface Tile {
    dx: number;
    dy: number;
    color: TokenSymbol;
}

/**
 * A cross-shaped piece:
 * - center is always present
 * - each arm is optional
 */
export interface Piece {
    center: TokenSymbol;
    up?: TokenSymbol;
    down?: TokenSymbol;
    left?: TokenSymbol;
    right?: TokenSymbol;
}

/** Returns the piece as a flat list of tiles (for placement logic) */
export function pieceTiles(piece: Piece): Tile[] {
    const tiles: Tile[] = [{ dx: 0, dy: 0, color: piece.center }];
    if (piece.up) tiles.push({ dx: 0, dy: -1, color: piece.up });
    if (piece.down) tiles.push({ dx: 0, dy: 1, color: piece.down });
    if (piece.left) tiles.push({ dx: -1, dy: 0, color: piece.left });
    if (piece.right) tiles.push({ dx: 1, dy: 0, color: piece.right });
    return tiles;
}

export interface LineSegment {
    direction: 'horizontal' | 'vertical';
    start: Position;
    length: number;
    color: TokenSymbol;
    segmentScore: number;
}

// ─── RNG (seed-based, deterministic) ─────────────────────────────────────────

export class Rng128 {
    private a: number;
    private b: number;
    private c: number;
    private d: number;

    constructor(seed: string) {
        [this.a, this.b, this.c, this.d] = Rng128.cyrb128(seed);
    }

    private static cyrb128(str: string): [number, number, number, number] {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;
        for (let i = 0; i < str.length; i++) {
            const k = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ k, 597399067);
            h2 = Math.imul(h2 ^ k, 2869860233);
            h3 = Math.imul(h3 ^ k, 951274213);
            h4 = Math.imul(h4 ^ k, 2716044179);
        }
        h1 ^= (h2 >>> 18) ^ (h3 << 12) ^ (h4 >>> 3);
        h2 ^= (h3 >>> 22) ^ (h4 << 5) ^ (h1 >>> 9);
        h3 ^= (h4 >>> 17) ^ (h1 << 13) ^ (h2 >>> 7);
        h4 ^= (h1 >>> 19) ^ (h2 << 11) ^ (h3 >>> 5);
        return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
    }

    nextFloat(): number {
        this.a >>>= 0; this.b >>>= 0; this.c >>>= 0; this.d >>>= 0;
        const t = (this.a + this.b) | 0;
        this.a = this.b ^ (this.b >>> 9);
        this.b = (this.c + (this.c << 3)) | 0;
        this.c = (this.c << 21) | (this.c >>> 11);
        this.d = (this.d + 1) | 0;
        const r = (t + this.d) | 0;
        this.c = (this.c + r) | 0;
        return (r >>> 0) / 4294967296;
    }

    nextInt(maxExclusive: number): number {
        return Math.floor(this.nextFloat() * maxExclusive);
    }
}

function randomColor(rng: Rng128): TokenSymbol {
    return TokenSymbols[rng.nextInt(TokenSymbols.length)]!;
}

export function generatePieces(count: number, seed: string): Piece[] {
    const rng = new Rng128(seed);
    const pieces: Piece[] = [];
    for (let i = 0; i < count; i++) {
        const piece: Piece = { center: randomColor(rng) };
        if (rng.nextFloat() < 0.5) piece.up = randomColor(rng);
        if (rng.nextFloat() < 0.5) piece.down = randomColor(rng);
        if (rng.nextFloat() < 0.5) piece.left = randomColor(rng);
        if (rng.nextFloat() < 0.5) piece.right = randomColor(rng);
        pieces.push(piece);
    }
    return pieces;
}

// ─── Board ────────────────────────────────────────────────────────────────────

export type Cell = TokenSymbol | null;
export type Grid = ReadonlyArray<ReadonlyArray<Cell>>;

export class Board {
    private readonly grid: Grid;

    constructor(grid?: Grid) {
        if (grid) {
            this.grid = grid.map(row => [...row]);
        } else {
            this.grid = Array.from({ length: BOARD_SIZE }, () =>
                Array(BOARD_SIZE).fill(null)
            );
        }
    }

    getCell(tx: number, ty: number): Cell {
        return this.grid[ty]?.[tx] ?? null;
    }

    getGrid(): Grid {
        return this.grid;
    }

    /** Place a piece at position, return new board + overwrite count */
    placePiece(piece: Piece, pos: Position): { board: Board; overwrites: number } {
        const mutable = this.grid.map(row => [...row]);
        let overwrites = 0;

        for (const tile of pieceTiles(piece)) {
            const tx = pos.tx + tile.dx;
            const ty = pos.ty + tile.dy;
            if (tx < 0 || tx >= BOARD_SIZE || ty < 0 || ty >= BOARD_SIZE) continue;
            if (mutable[ty]![tx] !== null) overwrites++;
            mutable[ty]![tx] = tile.color;
        }

        return { board: new Board(mutable), overwrites };
    }

    findSegments(): LineSegment[] {
        const segments: LineSegment[] = [];

        // Horizontal
        for (let ty = 0; ty < BOARD_SIZE; ty++) {
            let color: TokenSymbol | null = null;
            let startTx = 0;
            let length = 0;

            for (let tx = 0; tx <= BOARD_SIZE; tx++) {
                const cell = tx < BOARD_SIZE ? this.grid[ty]![tx]! : null;
                if (cell !== null && cell === color) {
                    length++;
                } else {
                    if (color !== null && length >= MIN_SEGMENT_LENGTH) {
                        segments.push({
                            direction: 'horizontal',
                            start: { tx: startTx, ty },
                            length,
                            color,
                            segmentScore: SEGMENT_SCORE[length] ?? 0,
                        });
                    }
                    color = cell;
                    startTx = tx;
                    length = 1;
                }
            }
        }

        // Vertical
        for (let tx = 0; tx < BOARD_SIZE; tx++) {
            let color: TokenSymbol | null = null;
            let startTy = 0;
            let length = 0;

            for (let ty = 0; ty <= BOARD_SIZE; ty++) {
                const cell = ty < BOARD_SIZE ? this.grid[ty]![tx]! : null;
                if (cell !== null && cell === color) {
                    length++;
                } else {
                    if (color !== null && length >= MIN_SEGMENT_LENGTH) {
                        segments.push({
                            direction: 'vertical',
                            start: { tx, ty: startTy },
                            length,
                            color,
                            segmentScore: SEGMENT_SCORE[length] ?? 0,
                        });
                    }
                    color = cell;
                    startTy = ty;
                    length = 1;
                }
            }
        }

        return segments;
    }

    clearSegments(segments: LineSegment[]): Board {
        const mutable = this.grid.map(row => [...row]);
        for (const seg of segments) {
            for (let i = 0; i < seg.length; i++) {
                if (seg.direction === 'horizontal') {
                    mutable[seg.start.ty]![seg.start.tx + i] = null;
                } else {
                    mutable[seg.start.ty + i]![seg.start.tx] = null;
                }
            }
        }
        return new Board(mutable);
    }
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export interface RoundResult {
    overwrites: number;
    segments: LineSegment[];
    baseScore: number;
    roundScore: number;
    total: number;
    boardAfterPlace: Board;
    boardAfterClear: Board;
}

export function calcRoundResult(
    previousTotal: number,
    boardBefore: Board,
    piece: Piece,
    pos: Position
): RoundResult {
    const { board: boardAfterPlace, overwrites } = boardBefore.placePiece(piece, pos);
    const segments = boardAfterPlace.findSegments();
    const boardAfterClear = boardAfterPlace.clearSegments(segments);

    const baseScore = segments.reduce((sum, s) => sum + s.segmentScore, 0);
    const linesFormed = segments.length;
    const theoreticalRoundScore = baseScore * linesFormed - overwrites;
    const roundScore = Math.max(theoreticalRoundScore, -previousTotal);
    const total = previousTotal + roundScore;

    return { overwrites, segments, baseScore, roundScore, total, boardAfterPlace, boardAfterClear };
}

// ─── Game ─────────────────────────────────────────────────────────────────────

export class Game {
    readonly pieces: readonly Piece[];
    readonly seed: string;

    constructor(seed: string, rounds: number = TOTAL_ROUNDS) {
        this.seed = seed;
        this.pieces = generatePieces(rounds, seed);
    }

    get totalRounds(): number {
        return this.pieces.length;
    }

    getPiece(roundIndex: number): Piece | null {
        return this.pieces[roundIndex] ?? null;
    }
}

// ─── GameState ────────────────────────────────────────────────────────────────

/** Immutable snapshot of the game at a given round */
export interface GameState {
    readonly game: Game;
    readonly roundIndex: number;
    readonly board: Board;
    readonly total: number;
    readonly history: readonly RoundResult[];
}

export function initialGameState(game: Game): GameState {
    return {
        game,
        roundIndex: 0,
        board: new Board(),
        total: 0,
        history: [],
    };
}

export function playRound(state: GameState, pos: Position): GameState {
    const piece = state.game.getPiece(state.roundIndex);
    if (!piece) return state; // no more pieces

    const result = calcRoundResult(state.total, state.board, piece, pos);

    return {
        game: state.game,
        roundIndex: state.roundIndex + 1,
        board: result.boardAfterClear,
        total: result.total,
        history: [...state.history, result],
    };
}

export function passRound(state: GameState): GameState {
    const piece = state.game.getPiece(state.roundIndex);
    if (!piece) return state;

    return {
        game: state.game,
        roundIndex: state.roundIndex + 1,
        board: state.board,
        total: state.total,
        history: state.history,
    };
}

export function isGameOver(state: GameState): boolean {
    return state.roundIndex >= state.game.totalRounds;
}

export function currentPiece(state: GameState): Piece | null {
    return state.game.getPiece(state.roundIndex);
}
