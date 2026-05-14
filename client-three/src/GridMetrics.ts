import { TOKEN_SIZE } from './Token'

export const INNER_WALL_THICKNESS = 0.05
export const OUTER_WALL_THICKNESS = 0.2

export const GRID_MARGIN = {
    x: 0.02,
    y: 0.02
}

export const GRID_CELL_DIST = {
    x: TOKEN_SIZE.x + GRID_MARGIN.x + INNER_WALL_THICKNESS,
    y: TOKEN_SIZE.y + GRID_MARGIN.y + INNER_WALL_THICKNESS,
}

export const GRID_OFFSET_Y = GRID_MARGIN.y / 2
