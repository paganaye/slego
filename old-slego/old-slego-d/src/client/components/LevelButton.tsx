import { JSX } from "solid-js";
import { addStyle } from "../Styles";

addStyle(".level-btn", {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "150px",
    minHeight: "90px",
    position: "relative",
    color: "var(--text-color)"
});

addStyle(".level-btn.completed", {
    background: "rgba(255, 69, 0, 0.2)",
    borderColor: "var(--red)"
});

addStyle(".level-btn.locked", {
    background: "rgba(100, 100, 100, 0.1)",
    borderColor: "rgba(150, 150, 150, 0.2)",
    cursor: "not-allowed",
    opacity: "0.5"
});

addStyle(".level-btn.locked::after", {
    content: "'🔒'",
    position: "absolute",
    top: "8px",
    right: "8px",
    fontSize: "1rem"
});

addStyle(".level-btn .level-number", {
    fontSize: "1.4rem",
    fontWeight: "700"
});

addStyle(".level-btn .level-name", {
    fontSize: "0.8rem",
    color: "#333",
    textAlign: "center"
});

interface LevelButtonProps {
    onclick: () => void;
    class?: string;
    children: JSX.Element;
    red?: boolean;
}

export function LevelButton(props: LevelButtonProps) {
    return (
        <button
            class={`level-btn btn ${props.class ?? ''}`}
            onclick={props.onclick}
            classList={{
                red: props.red
            }}
        >
            {props.children}
        </button>
    );
}
