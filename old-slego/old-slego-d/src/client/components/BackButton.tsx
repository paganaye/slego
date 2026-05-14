import { addStyle } from "../Styles";
import { Button } from "./Button";

interface BackButtonProps {
    onClick: () => void;
    label?: string;
}

// addStyle(".BackButton", {
//     background: "rgb(var(--text-color) / 0.1)",
//     border: "2px solid rgba(255, 255, 255, 0.3)",
//     borderRadius: "50%",
//     width: "40px",
//     height: "40px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//     transition: "all 0.3s ease",
//     color: "var(--text-color)"
// });

addStyle(".BackButton:hover", {
    //     background: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.5)",
    //borderWidth: '2px !important',
    backgroundColor: '#eee !important'
    //     transform: "translateX(-2px)"
});

addStyle(".BackButton svg", {
    width: "16px",
    height: "16px"
});


export function BackButton(props: BackButtonProps) {

    return (
        <Button
            class="BackButton round flat"
            onclick={props.onClick}
            tutorialId="back-btn">
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
        </Button>
    );
}
