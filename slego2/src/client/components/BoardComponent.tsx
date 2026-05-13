import { createMemo, For } from "solid-js";
import { TileComponent } from "./TileComponent";
import { addStyle } from "../Styles";
import { Color, IPosition } from "@shared/slego";
import { Signal } from "../Signal";
import { TILE_SIZE } from "../consts";
import { useSlegoApp } from "./SlegoApp";

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
  notAllowed: boolean;
  onBoardPointerDown?: (e: PointerEvent, pos: IPosition) => void;
  onDrop?: (tx: number, ty: number) => void;
  onBoardPointerDblClick?: ((e: MouseEvent, pos: IPosition) => void) | undefined;
}

addStyle(".board-container", {
  position: "relative",
  width: `${boardSize}px`,
  height: `${boardSize}px`,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  padding: "8px",
  borderRadius: "8px"
});

addStyle(".board-tile", {
  position: "absolute"
});


export function BoardComponent(props: BoardComponentProps) {

  const app = useSlegoApp();

  function onPointerDown(e: PointerEvent, pos: IPosition) {
    props.onBoardPointerDown?.(e, pos);
  };

  const getTilePosition = (tx: number, ty: number) => ({
    top: `${(ty + 0.5) * TILE_SIZE}px`,
    left: `${(tx + 0.5) * TILE_SIZE}px`
  });

  const isTutorialTarget = createMemo(() => {
    return ((app.tutorialTarget.get() == 'tile') && app.tutorialTile.get()) || null;
  })

  return (
    <div class="board-container"
      classList={{ tutorialTarget: app.tutorialTarget.get() === "board-container" }}>
      <For each={props.tiles}>
        {(row) => {
          return <For each={row}>
            {(tile) => {
              const cellColor = () => tile.color.get();
              const tutorialTarget = () => isTutorialTarget()?.tx === tile.tx && isTutorialTarget()?.ty === tile.ty;
              const position = getTilePosition(tile.tx, tile.ty);

              return (
                <div
                  class="board-tile"
                  style={position}
                >
                  <TileComponent
                    class={tile.class.get()}
                    color={cellColor()}
                    tutorialTarget={tutorialTarget()}
                    notAllowed={props.notAllowed}
                    onPointerDown={(e) => onPointerDown(e, tile)}
                    onDblClick={(e) => props.onBoardPointerDblClick?.(e, tile)}
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