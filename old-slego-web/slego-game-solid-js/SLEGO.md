# SLEGO — Official Rules

Classic 40 rounds solo game.

## Overview

Solo board puzzle. You play 40 rounds, placing “plus-subset” pieces on a 5×5 grid to maximize score.
Colors: RED, BLUE, GREEN, MAGENTA.
Scoring is per round; final score = sum over 40 rounds. Passing a round scores 0.

## Board and Coordinates

Grid size: 5 columns × 5 rows.
Any part of a piece that would land off-board is ignored (neither placed nor scored).

⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜

## Pieces

Classic draw: 40 pieces are predetermined at random and hidden until revealed; repetitions can occur.

Each piece contain one to 5 tiles, centered on a tile, with any subset of the four orthogonal arms (up, down, left, right).
Smallest: center only (1 tile). Largest: full plus (5 tiles).

Some example pieces

⬜️⬜️⬜️ ⬜️🟥⬜️ ⬜️🟪⬜️ ⬜️🟪⬜️ ⬜️⬜️⬜️ ⬜️🟦⬜️
⬜️🟦⬜️ ⬜️🟩🟪 🟥🟦🟦 🟪🟩🟥 🟥🟩⬜️ 🟪🟪🟥
⬜️⬜️⬜️ ⬜️⬜️⬜️ ⬜️🟩⬜️ ⬜️🟦⬜️ ⬜️🟪⬜️ ⬜️🟥⬜️

### Coloring

Center tile: choose exactly one of the four colors.
Each arm tile: independently choose EMPTY (omit that arm) or one of the four colors.

### Placement Rules

Each round, reveal the current piece shape, the user can place the piece anywhere on the board.

### Overwriting

You may place onto already occupied cells.
Penalty is −1 per such cell; a round can score negative.

### Passing

You may pass instead of placing; the round score is 0.

## Scoring

Lines: horizontal and vertical only.
A qualifying line is a contiguous segment of same-colored tiles of length 3, 4, or 5 that exists after this round’s placement.
3-in-a-row: +10
4-in-a-row: +20
5-in-a-row: +30
Count every distinct qualifying segment in every row and column.

### Round multiplier

After summing base points from all qualifying line this round, multiply that subtotal by the number of lines formed this round.

### Overwriting Penalty

Each placement onto an already occupied cell replace the color and incurs a −1 point penalty for this round.

### Round Score

Round score = (sum of line points this round × number of lines this round) − overwrite penalty.

### Game Score

Game score = sum of all 40 round scores.

## Edge Cases and Notes

Off-board arms are ignored (no tile placed, no effect).
If a piece overlaps multiple occupied cells, apply −1 for each such overlap.
A line that already existed and is still present after the round counts this round only if you treat scoring as “state after placement” (consistent with examples and totals). This matches the intended “score while you play” behavior.

Maximum-pattern Illustration (theoretical best-in-one-round)

Board pattern (x = BLUE, − = not BLUE):

⬜🟦⬜🟦⬜
🟦🟦⬜🟦🟦
⬜⬜⬜⬜⬜
🟦🟦⬜🟦🟦
⬜🟦⬜🟦⬜

Piece to place
⬜️🟦⬜️
🟦🟦🟦
⬜️🟦⬜️

Lines: 2 vertical of length 5 and one of length 1, 2 horizontal of length 5 and one of length 1.
Base: 30 + 30 + 10 + 30 + 30 + 10 = 140
Multiplier: ×6 (for 6 lines)
Round total: 140 × 6 = 840

Note: This has not occurred in observed play.

# Game statistics (40 rounds)

Typical players: ~300 points total.
Strong players: 700–800 points consistently.
