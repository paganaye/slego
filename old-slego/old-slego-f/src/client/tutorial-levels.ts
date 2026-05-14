// Tutorial Level Definitions and Configuration
import { BoardBuilder, ITutorialLevel } from './tutorial';

const LEVEL_1: ITutorialLevel = {
    id: 1,
    name: 'Basic Controls',
    description: 'Learn to place pieces using click and drag methods',
    objective: 'Place 2 pieces: first by clicking, then by drag & drop',
    seed: 'tutorial-level-1',
    steps: [
        {
            text: 'Welcome to SLEGO! First, click on the center cell (2,2) of the board to select it.',
            requiredAction: { type: "play", tx: 2, ty: 2, allowDragDrop: false },
        },
        {
            text: 'Perfect! Now click the "Place Piece" button to place your first piece.',
        },
        {
            text: 'Great! Now try drag & drop: drag the next piece directly from the preview to position (1,1).',
            requiredAction: { type: "play", tx: 1, ty: 1, allowClick: false },
        },
        {
            text: 'Excellent! You learned both placement methods.',
        },
    ],
};

const LEVEL_2: ITutorialLevel = {
    id: 2,
    name: 'Scoring Basics',
    description: 'Learn about scoring and overwriting',
    objective: 'Place 3 pieces to learn scoring mechanics',
    initialBoard: new BoardBuilder().setColor(2, 2, 'RED').build(),
    seed: 'tutorial-level-2',
    steps: [
        {
            text: 'Place your first piece at position (1,2) next to the red tile.',
            requiredAction: { type: "play", tx: 1, ty: 2 },
        },
        {
            text: 'Good! You scored 10 points. Now place the next piece at (3,2) to score more.',
            requiredAction: { type: "play", tx: 3, ty: 2 },
        },
        {
            text: 'Now place your last piece directly on the red tile (2,2). This will overwrite it (-1 penalty per tile).',
            requiredAction: { type: "play", tx: 2, ty: 2 },
        },
        {
            text: 'Notice the overwrite penalty! Sometimes it\'s worth it, but plan carefully.',
        },
    ]
};

const LEVEL_3: ITutorialLevel = {
    id: 3,
    name: 'Long Lines',
    description: 'Create longer lines for bigger scores',
    objective: 'Form a line of 4+ tiles to score 20+ points',
    initialBoard: new BoardBuilder()
        .setColor(1, 2, 'BLUE')
        .setColor(2, 2, 'BLUE')
        .build(),
    seed: 'tutorial-level-3',
    steps: [
        {
            text: 'Two blue tiles are aligned. Place your piece at (0,2) to start a longer line.',
            requiredAction: { type: "play", tx: 0, ty: 2 },
        },
        {
            text: 'Perfect! Now extend the line to (3,2) to create a 4-tile line worth 20 points!',
            requiredAction: { type: "play", tx: 3, ty: 2 },
        },
        {
            text: 'Excellent! Longer lines give much higher scores: 3=10pts, 4=20pts, 5=50pts!',
        },
    ]
};

const LEVEL_4: ITutorialLevel = {
    id: 4,
    name: 'Multiple Lines',
    description: 'Create multiple lines for bonus multipliers',
    objective: 'Form multiple lines in one placement for multiplied scores',
    initialBoard: new BoardBuilder()
        .setColor(1, 1, 'GREEN')
        .setColor(2, 1, 'GREEN')
        .setColor(1, 2, 'GREEN')
        .setColor(1, 3, 'GREEN')
        .build(),
    seed: 'tutorial-level-4',
    steps: [
        //     {
        //       text: 'Look at the green L-shape! Place your piece at (1,0) to complete a vertical line.',
        //       requiredAction: { type: "play", tx: 1,0 },
        //     },
        //     {
        //       text: 'Good! Now place at (0,1) to complete both horizontal AND vertical lines simultaneously!',
        //       requiredAction: { type: "play", tx: 0,1 },
        //     },
        //     {
        //       text: 'Amazing! Multiple lines multiply your score: 2 lines × base score = double points!',
        //     },
    ]
};

// Tutorial Level 5: Final Test
// Apply all learned skills to achieve a target score
const LEVEL_5: ITutorialLevel = {
    id: 5,
    name: 'Final Test',
    description: 'Apply everything you learned',
    objective: 'Score at least 40 points using all your skills',
    initialBoard: new BoardBuilder()
        .setColor(0, 2, 'RED')
        .setColor(4, 2, 'RED')
        .setColor(2, 0, 'BLUE')
        .setColor(2, 4, 'BLUE')
        .build(),
    //   ]),
    seed: 'tutorial-level-5',
    steps: [
        {
            text: 'Final test! Use everything you learned: long lines, multiple lines, strategic placement.',
        },
        {
            text: 'Look for opportunities to connect the existing tiles or create new patterns.',
        },
        {
            text: 'Remember: longer lines and multiple lines give the highest scores!',
        },
    ],
    minScore: 40
};


export const TUTORIAL_LEVELS: ITutorialLevel[] = [
    LEVEL_1,
    LEVEL_2,
    LEVEL_3,
    LEVEL_4,
    LEVEL_5,
];

