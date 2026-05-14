import type { IPiece, IPosition, IPieceToken } from './Game'

export interface BoardCellData {
    type: 'board'
    pos: IPosition
}

export interface PieceTileData {
    type: 'pieceTile'
    tile: IPieceToken
}

export interface StackData {
    type: 'stack'
    pieceIndex: number
    piece: IPiece
}

export type MeshUserData = BoardCellData | PieceTileData | StackData
