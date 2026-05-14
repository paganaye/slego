// Game Constants - Fixed logical units with global scale

export class GameScale {
  // Fixed logical sizes (in logical pixels)
  static readonly TILE_SIZE_PX = 50;
  static readonly BOARD_SIZE_PX = 5 * GameScale.TILE_SIZE_PX;    // 5x5 tiles = 250px
  static readonly PIECE_SIZE_PX = 3 * GameScale.TILE_SIZE_PX;   // Max 3x3 tiles = 150px

  static readonly scale = 1;
}
