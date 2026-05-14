import type { AppSettings } from './SettingsData'
import { DRAW_PILE_CENTER } from './Mat3D'
import type { BoardGrid3D } from './BoardGrid3D'
import type { PieceGrid3D } from './PieceGrid3D'
import type { Mat3D } from './Mat3D'
import type { ScoreHud3D } from './ScoreHud3D'
import { TOKEN_SIZE } from './Token'
import { TOTAL_ROUNDS } from './Game'

type LayoutTargets = {
    boardGrid3d: BoardGrid3D
    pieceGrid3d: PieceGrid3D
    stack3d: Mat3D
    scoreHud: ScoreHud3D
}

export type ScreenOrientation = 'landscape' | 'portrait'

export type SceneLayoutState = {
    orientation: ScreenOrientation
    boardOrigin: { x: number; y: number; z: number }
    crossCenter: { x: number; y: number; z: number }
    matOrigin: { x: number; y: number; z: number }
    scoreOrigin: { x: number; y: number; z: number }
    cameraZ: number
}

const CELL_DIST = 1
const BOARD_SIZE = 5 * CELL_DIST
const CROSS_SIZE = 3 * CELL_DIST
export const BOARD_CROSS_GAP = 0.75
export const BOARD_MAT_GAP = 4
const GAME_SIZE = BOARD_SIZE + CROSS_SIZE + BOARD_CROSS_GAP

const LANDSCAPE_CAMERA_Z = 10
const PORTRAIT_CAMERA_Z = 12

export const BOARD_Z_PER_ROUND = -TOKEN_SIZE.z
export const BOARD_Z_MAX = TOTAL_ROUNDS * BOARD_Z_PER_ROUND

export class Layout {
    state!: SceneLayoutState


    compute(width: number, height: number, settings: AppSettings): SceneLayoutState {
        const orientation: ScreenOrientation = width > height ? 'landscape' : 'portrait'

        this.state = orientation === 'landscape'
            ? this._computeLandscape(settings)
            : this._computePortrait(settings)

        return this.state
    }

    private _computeLandscape(settings: AppSettings): SceneLayoutState {
        const sign = settings.crossLandscapeSide === 'left' ? -1 : 1
        const boardCenterX = sign * (-GAME_SIZE / 2 + BOARD_SIZE / 2);
        const crossCenterX = sign * (GAME_SIZE / 2 - CROSS_SIZE / 2);

        return {
            orientation: 'landscape',
            boardOrigin: { x: boardCenterX, y: 0, z: 0 },
            crossCenter: { x: crossCenterX, y: 0, z: 0 },
            matOrigin: { x: boardCenterX, y: -(BOARD_SIZE / 2) - BOARD_MAT_GAP, z: DRAW_PILE_CENTER.z },
            scoreOrigin: { x: boardCenterX - 2.8, y: 3.25, z: 0.9 },
            cameraZ: LANDSCAPE_CAMERA_Z,
        }
    }
    private _computePortrait(settings: AppSettings): SceneLayoutState {
        const sign = settings.crossPortraitSide === 'top' ? 1 : -1
        const boardCenterY = sign * (-GAME_SIZE / 2 + BOARD_SIZE / 2);
        const crossCenterY = sign * (GAME_SIZE / 2 - CROSS_SIZE / 2);
        const lowestPieceY = Math.min(
            boardCenterY - BOARD_SIZE / 2,
            crossCenterY - CROSS_SIZE / 2
        )
        return {
            orientation: 'portrait',
            boardOrigin: { x: 0, y: boardCenterY, z: 0 },
            crossCenter: { x: 0, y: crossCenterY, z: 0 },
            matOrigin: { x: 0, y: lowestPieceY - BOARD_MAT_GAP, z: DRAW_PILE_CENTER.z },
            scoreOrigin: { x: -2.8, y: boardCenterY + 3.25, z: 0.9 },
            cameraZ: PORTRAIT_CAMERA_Z,
        }
    }

    applyScene(layoutState: SceneLayoutState, targets: LayoutTargets, immediate: boolean, boardZ = 0) {
        targets.boardGrid3d.setDestinationPosition({
            x: layoutState.boardOrigin.x,
            y: layoutState.boardOrigin.y,
            z: boardZ,
        })
        targets.pieceGrid3d.setRestPosition({ x: layoutState.crossCenter.x, y: layoutState.crossCenter.y, z: boardZ })
        targets.pieceGrid3d.setDestinationPosition({
            x: layoutState.crossCenter.x,
            y: layoutState.crossCenter.y,
            z: boardZ,
        })
        targets.stack3d.setDestinationPosition(layoutState.matOrigin)
        targets.scoreHud.setDestinationPosition({ ...layoutState.scoreOrigin, z: layoutState.scoreOrigin.z + boardZ })

        if (!immediate) return
        targets.boardGrid3d.snapTo({ ...layoutState.boardOrigin, z: boardZ })
        targets.pieceGrid3d.snapTo({ x: layoutState.crossCenter.x, y: layoutState.crossCenter.y, z: boardZ })
        targets.stack3d.snapTo(layoutState.matOrigin)
        targets.scoreHud.snapTo({ ...layoutState.scoreOrigin, z: layoutState.scoreOrigin.z + boardZ })
    }
}
