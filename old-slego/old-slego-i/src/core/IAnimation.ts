
export interface IAnimation {
  action: (n: number) => void;
  start: number;
  duration: number;
  resolve: Function;
}

export const DURATIONS = {
  LAYOUT_CHANGE: 0.35,
  ACTIVE_SCREEN_VISIBLE: 0.5,
  CROSS_VISIBLE: 0.5,
  CROSS_HIDDEN: 0.5,
  OVERLAY_VISIBLE: 0.5,
  OVERLAY_HIDDEN: 0.5,
  MADE_A_LINE: 1.0,
  ROUND_POINTS_VISIBLE: 0.5,
  ROUND_POINTS_HIDDEN: 0.5,
  ROUND_POINTS: 1.0,
  NO_POINTS: 0.5,
  MOVE_CROSS_WITH_KEYBOARD: 0.5,
  DRAG_CROSS_WITH_MOUSE: 0.3
}
