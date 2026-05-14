import { addStyle } from "../Styles";

interface BackButtonProps {
    onClick: () => void;
    label?: string;
}

addStyle(".BackButton", {
    background: "rgba(255, 255, 255, 0.1)",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    "border-radius": "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "pointer-events": "auto",
    color: "#ffffff"
});

addStyle(".BackButton:hover", {
    background: "rgba(255, 255, 255, 0.2)",
    "border-color": "rgba(255, 255, 255, 0.5)",
    transform: "translateX(-2px)"
});

addStyle(".BackButton svg", {
    width: "16px",
    height: "16px"
});


export function BackButton(props: BackButtonProps) {

    return (
        <button
            class="BackButton"
            onclick={props.onClick}
            title={props.label || "Back"}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
        </button>
    );
}
