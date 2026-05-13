// Tutorial Level Definitions and Configuration
import { BoardBuilder, ITutorialLevel } from '../shared/tutorial';

const LEVEL_1: ITutorialLevel = {
    id: 1,
    name: 'Basic Controls',
    description: 'Welcome to SLEGO. This tutorial helps you learn the game fast.',
    seed: 'tutorial-level-1-seed015', // seed005
    rounds: 2,
    steps: [
        {
            action: "message",
            instruction: "THE TUTORIAL IS STILL IN DEVELOPMENT AND IS NOT FINISHED. YOU WILL GET STUCK AT SOME POINT"
        },
        {
            action: "message",
            instruction: "This is the SLEGO board. This is a solitaire game with no clock. The aim is to score as many points as possible and beat the world champion."
        },
        {
            action: "message",
            instruction: "This is the 5x5 board. During the the whole game you can play any of the 25 tile or pass.",
            target: "board-container"
        },

        {
            action: "message",
            instruction: "The cross on the right is the piece you need to place on the board.",
            target: "floating-piece"
        },
        {
            action: "click-board",
            instruction: "Let's start playing. Click the center of the board to place the first piece.",
            target: "tile",
            tile: { tx: 2, ty: 2 }
        },
        {
            action: 'play-btn',
            instruction: "Bravo, you placed your first piece. To validate your move. Click the [Play] button.",
            target: "play-btn"
        },
        {
            action: "message",
            instruction: "Great you played your first piece!",
        }
    ],
};

const LEVEL_1_2: ITutorialLevel = {
    id: 1,
    name: 'Drag and Drop',
    description: 'Some player like to play fast',
    seed: 'tutorial-level-1',
    steps: [

        {
            action: "start-drag",
            instruction: "Let's try a faster way to play. Click on the next piece and maintain your finger on it.",
            target: "floating-piece"
        },
        {
            action: "drop-piece",
            instruction: "Good now let's drop the piece on the highlighted tile.",
            target: "tile",
            tile: { tx: 2, ty: 2 },

        },
        {
            action: "message",
            instruction: 'Excellent! You learned how to drag and drop. With this mode you play faster.',
        },
    ],
};

const LEVEL_2: ITutorialLevel = {
    id: 2,
    name: 'Scoring Basics',
    description: 'Learn about scoring and overwriting',
    initialBoard: new BoardBuilder().setColor(2, 2, 'RED').build(),
    seed: 'tutorial-level-2',
    steps: [
        {
            action: 'message',
            instruction: 'Place your first piece at position (1,2) next to the red tile.',
            tile: { tx: 1, ty: 2 },
        },
        {
            action: 'message',
            instruction: 'Good! You scored 10 points. Now place the next piece at (3,2) to score more.',
            tile: { tx: 3, ty: 2 },
        },
        {
            action: 'message',
            instruction: 'Now place your last piece directly on the red tile (2,2). This will overwrite it (-1 penalty per tile).',
            tile: { tx: 2, ty: 2 },
        },
        {
            action: 'message',
            instruction: 'Notice the overwrite penalty! Sometimes it\'s worth it, but plan carefully.',
        },
    ]
};

const LEVEL_3: ITutorialLevel = {
    id: 3,
    name: 'Long Lines',
    description: "",
    initialBoard: new BoardBuilder()
        .setColor(1, 2, 'BLUE')
        .setColor(2, 2, 'BLUE')
        .build(),
    seed: 'tutorial-level-3',
    steps: [
        {
            action: 'message',
            instruction: 'Two blue tiles are aligned. Place your piece at (0,2) to start a longer line.',
            //requiredAction: { type: "play", tx: 0, ty: 2 },
        },
        {
            action: 'message',
            instruction: 'Perfect! Now extend the line to (3,2) to create a 4-tile line worth 20 points!',
            //requiredAction: { type: "play", tx: 3, ty: 2 },
        },
        {
            action: 'message',
            instruction: 'Excellent! Longer lines give much higher scores: 3=10pts, 4=20pts, 5=50pts!',
        },
    ]
};

const LEVEL_4: ITutorialLevel = {
    id: 4,
    name: 'Multiple Lines',
    description: 'Create multiple lines for bonus multipliers',
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
            action: 'message',
            instruction: 'Final test! Use everything you learned: long lines, multiple lines, strategic placement.',
        },
        {
            action: 'message',
            instruction: 'Look for opportunities to connect the existing tiles or create new patterns.',
        },
        {
            action: 'message',
            instruction: 'Remember: longer lines and multiple lines give the highest scores!',
        },
    ],
    minScore: 40
};


export const TUTORIAL_LEVELS: ITutorialLevel[] = [
    LEVEL_1,
    LEVEL_1_2,
    LEVEL_2,
    LEVEL_3,
    LEVEL_4,
    LEVEL_5,
];

