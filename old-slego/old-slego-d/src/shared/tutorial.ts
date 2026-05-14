// // Tutorial System Types and Interfaces

import { Color, IPosition } from "./slego";

// import { Board } from './slego';


export type TutorialTarget = "play-btn" | "pass-btn" | "piece-preview" | "game-left-column" | "board-container"
    | "floating-piece" | "next-btn" | "back-btn" | "tile";

type TutorialAction = "pass-btn" | "play-btn" | "message" | "click-board" | "start-drag" | "drop-piece";

// Individual instruction step in a tutorial level
export interface ITutorialStep {
    action: TutorialAction;
    instruction: string;
    tile?: IPosition;
    showPiece?: boolean,
    target?: TutorialTarget,
    showBoard?: boolean,
    showBottomBar?: boolean;
}

// Complete configuration for a tutorial level
export interface ITutorialLevel {
    id: number;
    name: string;
    description: string;

    // Pre-configured board state
    initialBoard?: Array<Array<Color | null>>;

    // RNG configuration for reproducible piece generation
    seed: string;
    rounds?: number;

    // Tutorial guidance
    steps: ITutorialStep[];
    // Completion criteria
    minScore?: number;
}


export class BoardBuilder {
    private cells: (Color | null)[][];
    constructor() {
        this.cells = Array(5).fill(null).map(() => Array(5).fill(null));
    }
    public setColor(tx: number, ty: number, color: Color): BoardBuilder {
        this.cells[ty]![tx] = color;
        return this;
    }
    public build(): Array<Array<Color | null>> {
        return this.cells;
    }
}
