import { Piece } from './Piece.js';

/**
 * Cross piece (a plus shape): 5 tiles, one center and 4 arms.
 * Centered on its center so it snaps naturally to cell centers.
 */
export class CrossPiece extends Piece {
    constructor(opts: any = {}) {
        const shape = [
            { dx: 0, dy: 0 },
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 },
        ];
        const palette = ['circle-tile', 'tile1', 'tile2', 'tile3', 'tile4'];
        const id = opts.tileId || palette[Math.floor(Math.random() * palette.length)];
        super(shape, id, opts);
    }
}
