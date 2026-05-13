# SLEGO Three

Modern Three.js prototype for SLEGO.

This project is a 3D Skeuomorphism reinterpretation of the original Second Life SLEGO game.

## Goal

Build a modern visual version of SLEGO with:

- the same game DNA (5x5 board, color/symbol language, cross piece)
- premium 3D tokens inspired by mahjong pieces (milky white body + readable front motif)
- smooth animation and polished lighting

## Current Status

Implemented:

- Solid + Vite app with a Three.js scene
- game-first screen layout with a secondary menu panel
- 4 token set inspired by SLEGO symbols
- token dimensions 1 x 1 x 0.2
- rounded token geometry with milky white material
- motif added in relief on one face only
- polished reflections and studio lighting

Main files:

- src/App.tsx: scene setup, token generation, engraving logic, animation loop
- src/App.css: scene container and overlay menu UI

## Tech Stack

- solid-js
- three
- typescript
- vite

## Run Locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:5173

## Build

```bash
pnpm build
pnpm preview
```

## Visual Direction (based on original game)

The original game reference includes:

- strong retro color coding: yellow/green/blue/red
- geometric symbols: triangle/cross/square/circle
- board-centric composition with an active cross piece

This Three.js version keeps these visual anchors while moving to a modern 3D look.

## UX Direction

- The default startup screen is the game screen.
- The menu is a secondary screen, opened from a button on top of the game.

## Game Rules (Reference)

These rules are adapted from the original SLEGO game and are the target gameplay for this Three.js version.

### Objective

- Play a game with the round count selected at game start, and finish with the highest possible score.

### Board

- The board is a 5x5 grid.
- Each round, you place one cross-shaped piece (center + up/down/left/right arms).

### Symbols and Colors

- The game uses 4 symbol families with fixed color identity:
- triangle (yellow)
- square (green)
- cross (blue)
- circle (red)

### Placement Rules

- You can place the cross piece anywhere on the 5x5 board.
- Parts of the piece that fall outside the board are ignored.
- Covering an already occupied cell is allowed but applies a penalty.

### Scoring

- A horizontal or vertical line of 3 or more matching symbols scores points.
- Base values from the original rules:
- 3 in a line: 10 points
- 4 in a line: 20 points
- 5 in a line: 30 points
- Round score multiplier: sum of line values multiplied by number of lines formed during that play.

### Penalty

- Overwriting an existing tile costs 1 point per overwritten cell.

### Strategy Notes

- Build setups for multi-line clears instead of single-line clears.
- Plan around the next cross piece shape and symbol distribution.
- Board control in the center often gives more placement flexibility.

## Game Modes Vision

### Custom Game

- The player chooses the number of rounds before starting.
- This mode is ideal for practice, short sessions, and experimentation.

### Permanent Annual Marathon

- One official game per calendar day, each with a unique seed.
- Daily sequence runs from January 1 to December 31, including February 29.
- Players can replay previously missed days to keep their yearly progression complete.
- The classic 40-round format is used for the annual marathon daily games.

### Hall of Fame

- Daily Hall of Fame: ranking for a specific day seed.
- Year Hall of Fame: cumulative ranking across the current year marathon.
- All-Time Hall of Fame: best historical players across all years.

## Next Milestones

1. Recreate a full 5x5 3D board with slot feedback.
2. Add draggable 3D cross-piece placement preview.
3. Add game setup flow (round count, seed source, mode selection).
4. Add scoring and round UI overlay inspired by original layout.
5. Add annual marathon system (day index, replay missed days, leaderboards).
6. Add line-clear feedback VFX and sound hooks.
7. Optimize geometry/material reuse and bundle splitting.

## Notes

- Build currently succeeds.
- Vite warns about chunk size (>500 kB), expected at this stage with Three.js.


## Sound effects
https://t-studio-tst.itch.io/free-sound-mahjong-sound-pack

scene
  ├─ tokens (THREE.Group)
  │   └─ all tokens
  ├─ axesHelper
  ├─ pieceGrid3d
  ├─ board (Mat3D, visual elements)
  ├─ mat (Mat3D, visual elements)
  ├─ lights
  └─ scoreHud  



