import type { IPiece, PieceSlot, IPieceToken } from './Game'
import type { Token } from './Token'

export class MatPiece {
    constructor(
        readonly pieceIndex: number,
        readonly piece: IPiece,
        readonly col: number,
        readonly row: number,
        readonly tokensBySlot: Partial<Record<PieceSlot, Token>>,
    ) { }
}

export function pieceSlotFromTile(tile: IPieceToken): PieceSlot {
    if (tile.dx === 0 && tile.dy === 0) return 'center'
    if (tile.dx === 0 && tile.dy === -1) return 'up'
    if (tile.dx === 0 && tile.dy === 1) return 'down'
    if (tile.dx === -1 && tile.dy === 0) return 'left'
    if (tile.dx === 1 && tile.dy === 0) return 'right'
    return 'center'
}
