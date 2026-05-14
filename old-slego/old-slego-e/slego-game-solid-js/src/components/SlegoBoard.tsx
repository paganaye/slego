import { Accessor, For, createMemo } from 'solid-js';
import type { RoundScore } from '../Types';
import { Board } from '../Board';
import { colorToSymbol } from '../SlegoPiece';
import { GameScale } from '../GameScale';

interface SlegoBoardProps {
  board: Accessor<Board>;
  linesToClear?: RoundScore | null;
  animatingLines?: number[];
  forwardRef: (el: HTMLDivElement) => void;
}

export interface CellPlacement {
  tileX: number;
  tileY: number;
  left: number;
  top: number;
}

export function SlegoBoard(props: SlegoBoardProps) {

  const cellColors = createMemo(() => {
    return props.board().getColors();
  })

  return (
    <div ref={props.forwardRef} class="board">
      <For each={cellColors()}>
        {(row, r) => (
          <For each={row}>
            {(cellColor, c) => {
              const isAnimatingLine = () => {
                if (!props.linesToClear || !props.animatingLines) return false;

                return props.animatingLines.some(lineIndex => {
                  const line = props.linesToClear!.lines[lineIndex];
                  if (!line) return false;

                  if (line.type === 'horizontal') {
                    return r() === line.startRow &&
                      c() >= line.startCol &&
                      c() < line.startCol + line.length;
                  } else {
                    return c() === line.startCol &&
                      r() >= line.startRow &&
                      r() < line.startRow + line.length;
                  }
                });
              };

              return (
                <div
                  class="cell"
                  style={{
                    left: `${c() * GameScale.TILE_SIZE_PX}px`,
                    top: `${r() * GameScale.TILE_SIZE_PX}px`
                  }}
                >
                  {cellColor && (
                    <svg
                      class={`tile ${isAnimatingLine() ? 'animating' : ''}`}
                      viewBox="0 0 100 100"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <use href={`#${colorToSymbol[cellColor]}`} />
                    </svg>
                  )}
                </div>
              );
            }}
          </For>
        )}
      </For>
    </div>);
};
