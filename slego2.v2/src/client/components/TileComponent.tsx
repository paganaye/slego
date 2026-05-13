import { Color } from "@shared/slego";
import { createMemo } from "solid-js";
import { addStyle, addKeyframes } from "../Styles";

export const TILE_SIZE = 50;

interface TileComponentProps {
  class?: string | undefined;
  color?: Color | null | undefined;
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  highlighted?: boolean | undefined;
  selected?: boolean | undefined;
  preview?: boolean | undefined;
  borderLeft?: boolean | undefined;
  borderRight?: boolean | undefined;
  borderTop?: boolean | undefined;
  borderBottom?: boolean | undefined;
  onClick?: () => void;
  onPointerDown?: ((e: PointerEvent) => void) | undefined;
  onPointerMove?: ((e: PointerEvent) => void) | undefined;
  onPointerUp?: ((e: PointerEvent) => void) | undefined;
  notAllowed?: boolean;
}

addStyle(".tile", {
  position: "absolute",
  width: `${TILE_SIZE / 1.1}px`,
  height: `${TILE_SIZE / 1.1}px`,
  border: "1px solid rgba(255, 255, 255, 0.2)",
  "border-radius": "6px",
  cursor: "pointer",
  "box-sizing": "border-box",
  "background-color": "rgba(255, 255, 255, 0.05)"
});


addStyle(".tile.excited", {
  "animation": "jiggle-and-fade 2s ease-in-out forwards, jiggle-rotate 0.2s ease-in-out infinite",
});

addStyle(".tile.back", {
  "animation": "back-to-black 2s ease-in-out forwards",
});

addKeyframes("jiggle-and-fade", {
  "0%": { transform: "scale(1)" },
  "100%": { transform: "scale(1.1)" },
});

addKeyframes("jiggle-rotate", {
  "0%": { transform: "rotate(-2deg)" },
  "50%": { transform: "rotate(2deg)" },
  "100%": { transform: "rotate(-2deg)" },
});

addKeyframes("back-to-black", {
  "0%": {},
  "100%": { transform: "scale(1)", "background-color": "rgba(255, 255, 255, 0.05)" },
});

addStyle(".tile.not-allowed", {
  cursor: "not-allowed",
});



addStyle(".tile.red", {
  "background-color": "#ff4444"
});

addStyle(".tile.blue", {
  "background-color": "#4444ff"
});

addStyle(".tile.green", {
  "background-color": "#44ff44"
});

addStyle(".tile.magenta", {
  "background-color": "#ff44ff"
});

addStyle(".tile.highlighted", {
  border: "4px solid #ffd700",
  //"box-shadow": "0 0 10px rgba(255, 215, 0, 0.5)"
});

addStyle(".tile.selected", {
  border: "4px solid #ffd700",
  //"box-shadow": "0 0 15px rgba(255, 215, 0, 0.8)"
});

// addStyle(".tile:hover", {
//   transform: "scale(1.05)",
//   //"box-shadow": "0 0 10px rgba(255, 255, 255, 0.3)"
// });

addStyle(".tile.preview", {
  border: "4px dashed #ffd700 !important",
  animation: "previewPulse 1s ease-in-out infinite"
});

addStyle(".tile.noBorderLeft", {
  "border-left": "none !important",
  "border-top-left-radius": "0",
  "border-bottom-left-radius": "0"
});

addStyle(".tile.noBorderRight", {
  "border-right": "none !important",
  "border-top-right-radius": "0",
  "border-bottom-right-radius": "0"
});

addStyle(".tile.noBorderTop", {
  "border-top": "none !important",
  "border-top-left-radius": "0",
  "border-top-right-radius": "0",
});

addStyle(".tile.noBorderBottom", {
  "border-bottom": "none !important",
  "border-bottom-left-radius": "0",
  "border-bottom-right-radius": "0",
});


// Position classes for piece layout
addStyle(".tile.center-tile", {
  top: `${TILE_SIZE}px`,
  left: `${TILE_SIZE}px`
});

addStyle(".tile.top-tile", {
  top: "0px",
  left: `${TILE_SIZE}px`
});

addStyle(".tile.bottom-tile", {
  top: `${TILE_SIZE * 2}px`,
  left: `${TILE_SIZE}px`
});

addStyle(".tile.left-tile", {
  top: `${TILE_SIZE}px`,
  left: "0px"
});

addStyle(".tile.right-tile", {
  top: `${TILE_SIZE}px`,
  left: `${TILE_SIZE * 2}px`
});



export function TileComponent(props: TileComponentProps) {

  const classes = createMemo(() => [
    "tile",
    props.class,
    props.color?.toLowerCase(),
    props.position && `${props.position}-tile`,
    props.highlighted && "highlighted",
    props.selected && "selected",
    props.preview && "preview",
    props.borderTop == false && "noBorderTop",
    props.borderLeft == false && "noBorderLeft",
    props.borderRight == false && "noBorderRight",
    props.borderBottom == false && "noBorderBottom",
    props.notAllowed && "not-allowed"
  ].filter(Boolean).join(" "));

  return (
    <div
      class={classes()}
      onClick={props.onClick}
      onPointerDown={props.onPointerDown}
      onPointerMove={props.onPointerMove}
      onPointerUp={props.onPointerUp}
    />
  );
}