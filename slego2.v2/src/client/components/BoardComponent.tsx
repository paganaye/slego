import { For } from "solid-js";
import { TileComponent, TILE_SIZE } from "./TileComponent";
import { addStyle } from "../Styles";
import { Color, IPosition } from "@shared/slego";
import { Signal } from "../Signal";

const boardSize = TILE_SIZE * 5; // 5 tiles + padding

export class BoardTile {
  color: Signal<Color | null>;
  readonly class = new Signal("");
  constructor(readonly tx: number, readonly ty: number, initialColor: Color | null = null) {
    this.color = new Signal<Color | null>(initialColor);
  }
}


interface BoardComponentProps {
  tiles: BoardTile[][];
  selectedPosition?: IPosition | null;
  previewPositions?: IPosition[];
  notAllowed: boolean;
  onCellPointerDown?: (e: PointerEvent, pos: IPosition) => void;
  onDrop?: (tx: number, ty: number) => void;
}

addStyle(".board-container", {
  position: "relative",
  width: `${boardSize}px`,
  height: `${boardSize}px`,
  "background-color": "rgba(255, 255, 255, 0.1)",
  padding: "8px",
  "border-radius": "8px"
});

addStyle(".board-tile", {
  position: "absolute"
});


export function BoardComponent(props: BoardComponentProps) {


  function onPointerDown(e: PointerEvent, pos: IPosition) {
    props.onCellPointerDown?.(e, pos);
  };

  const getTilePosition = (tx: number, ty: number) => ({
    top: `${ty * TILE_SIZE}px`,
    left: `${tx * TILE_SIZE}px`
  });



  return (
    <div class="board-container">
      <For each={props.tiles}>
        {(row) => {
          return <For each={row}>
            {(tile) => {
              const cellColor = () => tile.color.get();
              const isSelected = () => props.selectedPosition?.tx === tile.tx && props.selectedPosition?.ty === tile.ty;
              const isPreview = () => props.previewPositions?.some(pos => pos.tx === tile.tx && pos.ty === tile.ty) || false;
              const position = getTilePosition(tile.tx, tile.ty);

              return (
                <div
                  class="board-tile"
                  style={position}
                >
                  <TileComponent
                    class={tile.class.get()}
                    color={cellColor()}
                    selected={isSelected()}
                    preview={isPreview()}
                    notAllowed={props.notAllowed}
                    onPointerDown={(e) => onPointerDown(e, { tx: tile.tx, ty: tile.ty })}
                  />
                </div>
              );
            }}
          </For>
        }}
      </For>
    </div>
  );
}