import { Piece } from './Piece.js';
import { SlegoColor, SlegoTile } from './Types.js';
import { GameScale } from './GameScale.js';


/**
 * SLEGO piece: center tile + optional arms (up, down, left, right)
 * Each tile can be one of 4 colors independently
 */
export class SlegoPiece extends Piece {
  slegoTiles: SlegoTile[];

  constructor(slegoTiles: SlegoTile[], opts = {}) {
    // Convert to shape offsets for base Piece class
    const shapeOffsets = slegoTiles.map(t => ({ dx: t.dx, dy: t.dy }));

    // Use first tile's color as base (we'll override rendering)
    const colorToSymbol = {
      red: 'tile-red',
      blue: 'tile-blue',
      green: 'tile-green',
      magenta: 'tile-magenta'
    };

    super(shapeOffsets, colorToSymbol[slegoTiles[0].color], opts);
    this.slegoTiles = slegoTiles;

    // Override tile rendering to use individual colors
    this._renderColoredTiles();
  }

  _renderColoredTiles() {
    // Clear existing tiles and rebuild with colors
    this.root.innerHTML = '';

    const colorToSymbol = {
      red: 'tile-red',
      blue: 'tile-blue',
      green: 'tile-green',
      magenta: 'tile-magenta'
    };

    this.slegoTiles.forEach((slegoTile) => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('tile');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.style.width = `${GameScale.TILE_SIZE_PX}px`;
      svg.style.height = `${GameScale.TILE_SIZE_PX}px`;
      svg.style.position = 'absolute';

      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', `#${colorToSymbol[slegoTile.color]}`);
      svg.appendChild(use);

      // Position relative to piece center
      const x = slegoTile.dx * GameScale.TILE_SIZE_PX;
      const y = slegoTile.dy * GameScale.TILE_SIZE_PX;
      svg.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;

      this.root.appendChild(svg);
    });
  }

}

/**
 * Generate a random SLEGO piece according to the rules:
 * - Always has center tile (0,0)
 * - Each arm (up, down, left, right) is independently present or absent
 * - Each tile gets a random color
 */
export function generateSlegoPiece(): SlegoTile[] {
  const colors: SlegoColor[] = ['red', 'blue', 'green', 'magenta'];
  const tiles: SlegoTile[] = [];

  // Always include center
  tiles.push({
    dx: 0,
    dy: 0,
    color: colors[Math.floor(Math.random() * colors.length)]
  });

  // Possible arms: up, down, left, right
  const arms = [
    { dx: 0, dy: -1 }, // up
    { dx: 0, dy: 1 },  // down  
    { dx: -1, dy: 0 }, // left
    { dx: 1, dy: 0 }   // right
  ];

  // Each arm has 50% chance to be included
  arms.forEach(arm => {
    if (Math.random() < 0.5) {
      tiles.push({
        dx: arm.dx,
        dy: arm.dy,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  });

  return tiles;
}

/**
 * Generate the 40 pieces for a SLEGO game
 */
export function generateSlegoGame(): SlegoTile[][] {
  const pieces: SlegoTile[][] = [];
  for (let i = 0; i < 40; i++) {
    pieces.push(generateSlegoPiece());
  }
  return pieces;
}

export const colorToSymbol: Record<string, string> = {
  red: 'tile-red',
  blue: 'tile-blue',
  green: 'tile-green',
  magenta: 'tile-magenta'
} as const;


