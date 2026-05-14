import { For } from 'solid-js';
import { SlegoTile } from '../Types';
import { colorToSymbol } from '../SlegoPiece';
import { GameScale } from '../GameScale';

interface SlegoPieceProps {
  tiles: SlegoTile[];
  position?: { x: number, y: number };
  isDragging?: boolean;
  onPointerDown?: (e: PointerEvent) => void;
}

export function SlegoPieceComponent(props: SlegoPieceProps) {


  return (
    <div
      class={`piece ${props.isDragging ? 'dragging' : ''}`}
      style={{
        left: props.isDragging ? `${props.position?.x}px` : '',
        top: props.isDragging ? `${props.position?.y}px` : '',
      }}
      onPointerDown={props.onPointerDown}
    >
      <For each={props.tiles}>
        {(tile) => (
          <svg
            class="tile"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            style={{
              left: `${(tile.dx + 1) * GameScale.TILE_SIZE_PX}px`,
              top: `${(tile.dy + 1) * GameScale.TILE_SIZE_PX}px`
            }}
          >
            <use href={`#${colorToSymbol[tile.color]}`} />
          </svg>
        )}
      </For>
    </div>
  );
};
