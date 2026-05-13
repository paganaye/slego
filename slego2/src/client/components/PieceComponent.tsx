import { TileComponent } from "./TileComponent";
import { addStyle } from "../Styles";
import { Piece } from "@shared/slego";
import { TILE_SIZE } from "../consts";
import { For } from "solid-js";
import { useSlegoApp } from "./SlegoApp";

interface PieceComponentProps {
  piece: Piece;
  highlighted?: boolean;
  selected?: boolean;
  draggable?: boolean;
  onPointerDown?: ((e: PointerEvent) => void) | undefined;
  onPointerMove?: ((e: PointerEvent) => void) | undefined;
  onPointerUp?: ((e: PointerEvent) => void) | undefined;
  onPointerDblClick?: ((e: MouseEvent) => void) | undefined;
  notAllowed?: boolean;
}

addStyle(".piece-container", {
  position: "relative",
});

addStyle(".piece-container > div.tile.draggable", {
  cursor: "grab"
});

addStyle(".piece-container.draggable:active", {
  cursor: "grabbing",
  transform: "scale(0.95)"
});

addStyle(".piece-container.selected", {
  transform: "scale(0.8)",
  opacity: "0.6",
  transition: "all 0.3s ease"
});

addStyle(".piece-container .tile", {

});

addStyle(".tile.top-tile", {
  left: `${TILE_SIZE * 1.5}px`,
  top: `${TILE_SIZE * 0.5}px`
});

addStyle(".tile.left-tile", {
  left: `${TILE_SIZE * 0.5}px`,
  top: `${TILE_SIZE * 1.5}px`
});

addStyle(".tile.center-tile", {
  left: `${TILE_SIZE * 1.5}px`,
  top: `${TILE_SIZE * 1.5}px`,
});

addStyle(".tile.right-tile", {
  left: `${TILE_SIZE * 2.5}px`,
  top: `${TILE_SIZE * 1.5}px`,
});

addStyle(".tile.bottom-tile", {
  left: `${TILE_SIZE * 1.5}px`,
  top: `${TILE_SIZE * 2.5}px`
});

addStyle(".piece-handle", {
  position: "absolute",
  left: `${TILE_SIZE * 1.5}px`,
  top: `${TILE_SIZE * 1.5}px`,
  borderRadius: "50%",
  width: `${TILE_SIZE * 1.75}px`,
  height: `${TILE_SIZE * 1.75}px`,
  border: "4px solid var(--yellow)",
  translate: "-50% -50%"
});

addStyle(".piece-handle.tutorialTarget", {
  border: "none",
});

addStyle(".piece-handle.tutorialTarget:before", {
  borderRadius: "50%"
});

addStyle(".piece-tile-background", {
  outline: "4px solid var(--yellow) !important"
});


export function PieceComponent(props: PieceComponentProps) {

  function getTiles() {
    const tiles = [];
    const hasArms = {
      up: !!props.piece?.up,
      down: !!props.piece?.down,
      left: !!props.piece?.left,
      right: !!props.piece?.right
    };

    // Arms - hide borders that connect to center
    if (hasArms.up) {
      tiles.push({
        color: props.piece.up,
        position: 'top' as const,
        borderTop: true,
        borderLeft: true,
        borderRight: true,
        borderBottom: true
      });
    }
    if (hasArms.down) {
      tiles.push({
        color: props.piece.down,
        position: 'bottom' as const,
        borderBottom: true,
        borderLeft: true,
        borderRight: true,
        borderTop: true
      });
    }
    if (hasArms.left) {
      tiles.push({
        color: props.piece.left,
        position: 'left' as const,
        borderLeft: true,
        borderTop: true,
        borderBottom: true,
        borderRight: true
      });
    }
    if (hasArms.right) {
      tiles.push({
        color: props.piece.right,
        position: 'right' as const,
        borderRight: true,
        borderTop: true,
        borderBottom: true,
        borderLeft: true
      });
    }
    // Center tile (always present) - hide borders where arms connect
    tiles.push({
      color: props.piece?.center,
      position: 'center' as const,
      borderTop: true,
      borderBottom: true,
      borderLeft: true,
      borderRight: true
    });
    return tiles;
  };

  const classes = [
    "piece-container",
    props.draggable && "draggable",
    props.selected && "selected"
  ].filter(Boolean).join(" ");

  const app = useSlegoApp();

  return (<div
    class={classes}>
    <div class="piece-handle"
      classList={{ tutorialTarget: app.tutorialTarget.get() === "floating-piece" }}></div>
    <For each={getTiles()}>
      {tile =>
        <TileComponent
          class="piece-tile-background"
          position={tile.position}
          borderTop={tile.borderTop}
          borderBottom={tile.borderBottom}
          borderLeft={tile.borderLeft}
          borderRight={tile.borderRight}
        />
      }
    </For>
    <For each={getTiles()}>
      {tile =>
        <TileComponent
          color={tile.color}
          position={tile.position}
          borderTop={tile.borderTop}
          borderBottom={tile.borderBottom}
          borderLeft={tile.borderLeft}
          borderRight={tile.borderRight}
          notAllowed={props.notAllowed ?? false}
          onPointerDown={props.onPointerDown}
          onPointerMove={props.onPointerMove}
          onPointerUp={props.onPointerUp}
          onDblClick={(e) => props.onPointerDblClick?.(e)}
        />
      }
    </For>
  </div >);
}
