import type { Piece, Position, Tile } from './Game'

export interface BoardCellData {
    type: 'board'
    pos: Position
}

export interface PieceTileData {
    type: 'pieceTile'
    tile: Tile
}

export interface StackData {
    type: 'stack'
    pieceIndex: number
    piece: Piece
}

export type MeshUserData = BoardCellData | PieceTileData | StackData
