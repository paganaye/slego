// // Tutorial System Types and Interfaces

import { Color } from "@shared/slego";

// import { Board } from './slego';


// Individual instruction step in a tutorial level
export interface ITutorialStep {
    text: string;
    requiredAction?: "any" | "pass" | "pass" | IPlayPosition;
}

interface IPlayPosition {
    type: "play",
    text?: string;
    tx: number;
    ty: number;
    allowDragDrop?: boolean,
    allowClick?: boolean
}

// Complete configuration for a tutorial level
export interface ITutorialLevel {
    id: number;
    name: string;
    description: string;
    objective: string;

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
