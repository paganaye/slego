import { addStyle } from "../Styles";
import { BackButton } from "./BackButton";

interface TopBarProps {
    title: string;
    onBack?: () => void;
    showLogo?: boolean;
}

addStyle(".TopBar", {
    display: "flex",
    "align-items": "center",
    gap: "20px",
    "margin-bottom": "5px",
    width: "100%",
    "max-width": "600px",
    "pointer-events": "auto"
});

addStyle(".TopBar h2", {
    margin: "0",
    "font-size": "1.8rem",
    "font-weight": "600",
    color: "#ffffff",
    flex: "1"
});

addStyle(".TopBar .logo", {
    height: "40px",
    width: "auto",
    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))"
});

export function TopBar(props: TopBarProps) {

    return (
        <div class="TopBar">
            {props.onBack && (
                <BackButton onClick={props.onBack} />
            )}

            {props.showLogo && (
                <img src="slego2-logo.svg" alt="SLEGO 2" class="logo" />
            )}

            <h2>{props.title}</h2>
        </div>
    );
}
