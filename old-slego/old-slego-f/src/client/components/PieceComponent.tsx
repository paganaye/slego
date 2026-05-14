import { TileComponent } from "./TileComponent";
import { addStyle } from "../Styles";
import { Piece } from "@shared/slego";

interface PieceComponentProps {
  piece: Piece;
  highlighted?: boolean;
  selected?: boolean;
  draggable?: boolean;
  onPointerDown?: ((e: PointerEvent) => void) | undefined;
  onPointerMove?: ((e: PointerEvent) => void) | undefined;
  onPointerUp?: ((e: PointerEvent) => void) | undefined;
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

addStyle(".piece-container.highlighted", {
  border: "3px solid #ffd700",
  "border-radius": "8px",
  padding: "4px",
  // "box-shadow": "0 0 20px rgba(255, 215, 0, 0.8)"
});

addStyle(".piece-container.selected", {
  transform: "scale(0.8)",
  opacity: "0.6",
  transition: "all 0.3s ease"
});

addStyle(".tile.center-tile", {
  "top": "50px",
  "left": "50px",
  "border-radius": "50%",
  "width": "74px",
  "height": "74px",
  "translate": "-14px -14px"
});

export function PieceComponent(props: PieceComponentProps) {

  function getTileData() {
    const tiles = [];
    const hasArms = {
      up: !!props.piece?.up,
      down: !!props.piece?.down,
      left: !!props.piece?.left,
      right: !!props.piece?.right
    };

    // Center tile (always present) - hide borders where arms connect
    tiles.push({
      color: props.piece?.center,
      position: 'center' as const,
      borderTop: true,
      borderBottom: true,
      borderLeft: true,
      borderRight: true
    });

    // Arms - hide borders that connect to center
    if (hasArms.up) {
      tiles.push({
        color: props.piece.up,
        position: 'top' as const,
        borderTop: true,
        borderLeft: true,
        borderRight: true,
        borderBottom: false // Hide bottom border (connects to center)
      });
    }
    if (hasArms.down) {
      tiles.push({
        color: props.piece.down,
        position: 'bottom' as const,
        borderBottom: true,
        borderLeft: true,
        borderRight: true,
        borderTop: false // Hide top border (connects to center)
      });
    }
    if (hasArms.left) {
      tiles.push({
        color: props.piece.left,
        position: 'left' as const,
        borderLeft: true,
        borderTop: true,
        borderBottom: true,
        borderRight: false // Hide right border (connects to center)
      });
    }
    if (hasArms.right) {
      tiles.push({
        color: props.piece.right,
        position: 'right' as const,
        borderRight: true,
        borderTop: true,
        borderBottom: true,
        borderLeft: false // Hide left border (connects to center)
      });
    }

    return tiles;
  };

  const classes = [
    "piece-container",
    props.draggable && "draggable",
    props.highlighted && "highlighted",
    props.selected && "selected"
  ].filter(Boolean).join(" ");

  return (<div
    class={classes}>
    {getTileData().map((tile) => (
      <TileComponent
        color={tile.color}
        position={tile.position}
        highlighted={props.highlighted}
        borderTop={tile.borderTop}
        borderBottom={tile.borderBottom}
        borderLeft={tile.borderLeft}
        borderRight={tile.borderRight}
        selected={true}
        notAllowed={props.notAllowed ?? false}
        onPointerDown={props.onPointerDown}
        onPointerMove={props.onPointerMove}
        onPointerUp={props.onPointerUp}
      />
    ))}
  </div>);
}
