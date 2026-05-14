import { Color } from "@shared/slego";
import { createMemo } from "solid-js";
import { addStyle, addKeyframes } from "../Styles";
import { TILE_SIZE } from "../consts";

interface TileComponentProps {
  class?: string | undefined;
  color?: Color | null | undefined;
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  tutorialTarget?: boolean | undefined;
  borderLeft?: boolean | undefined;
  borderRight?: boolean | undefined;
  borderTop?: boolean | undefined;
  borderBottom?: boolean | undefined;
  onClick?: () => void;
  onPointerDown?: ((e: PointerEvent) => void) | undefined;
  onPointerMove?: ((e: PointerEvent) => void) | undefined;
  onPointerUp?: ((e: PointerEvent) => void) | undefined;
  onDblClick?: ((e: MouseEvent) => void) | undefined;
  notAllowed?: boolean;
}

addStyle(".tile", {
  position: "absolute",
  width: `${TILE_SIZE}px`,
  height: `${TILE_SIZE}px`,
  border: "4px solid rgb(var(--text-color) / 0.2)",
  borderRadius: "8px",
  cursor: "pointer",
  boxSizing: "border-box",
  backgroundColor: "rgb(var(--text-color) / 0.05)",
  translate: "-50% -50%",
  touchAction: "none"
});

addStyle(".tile.empty", {
  position: "absolute",
  width: `${TILE_SIZE - 8}px`,
  height: `${TILE_SIZE - 8}px`,
  border: "2px dotted rgb(var(--text-color) / 0.1)",
  borderRadius: "8px",
  cursor: "pointer",
  boxSizing: "border-box",
  backgroundColor: "rgb(var(--text-color) / 0.05)",
});



addStyle(".tile.excited", {
  "animation": "jiggle-and-fade 2s ease-in-out forwards, jiggleRotate 0.2s ease-in-out infinite",
});

addStyle(".tile.back", {
  "animation": "back-to-black 2s ease-in-out forwards",
});

addKeyframes("jiggle-and-fade", {
  "0%": { transform: "scale(1)" },
  "100%": { transform: "scale(1.1)" },
});

addKeyframes("jiggleRotate", {
  "0%": { transform: "rotate(-2deg)" },
  "50%": { transform: "rotate(2deg)" },
  "100%": { transform: "rotate(-2deg)" },
});

addKeyframes("back-to-black", {
  "0%": {},
  "100%": { transform: "scale(1)", backgroundColor: "rgba(255, 255, 255, 0.05)" },
});

addKeyframes("previewPulse", {
  "0%": { opacity: 0.6 },
  "50%": { opacity: 0.9 },
  "100%": { opacity: 0.6 }
});

addStyle(".tile.not-allowed", {
  cursor: "not-allowed",
});

addStyle(".tile.red", {
  backgroundColor: "#ff4444"
});

addStyle(".tile.blue", {
  backgroundColor: "#4444ff"
});

addStyle(".tile.green", {
  backgroundColor: "#44ff44"
});

addStyle(".tile.magenta", {
  backgroundColor: "#ff44ff"
});

addStyle("div.noBorderTop", {
  borderTop: "none",
  borderTopLeftRadius: "0",
  borderTopRightRadius: "0",
});

addStyle("div.noBorderRight", {
  borderRight: "none",
  borderTopRightRadius: "0",
  borderBottomRightRadius: "0",
});


addStyle("div.noBorderBottom", {
  borderBottom: "none",
  borderBottomLeftRadius: "0",
  borderBottomRightRadius: "0",
});

addStyle("div.noBorderLeft", {
  borderLeft: "none",
  borderTopLeftRadius: "0",
  borderBottomLeftRadius: "0",
})




export function TileComponent(props: TileComponentProps) {

  const classes = createMemo(() => [
    "tile",
    props.class,
    props.color?.toLowerCase() ?? "empty",
    props.position && `${props.position}-tile`,
    props.tutorialTarget && "tutorialTarget",
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
      onDblClick={props.onDblClick}
    />
  );
}