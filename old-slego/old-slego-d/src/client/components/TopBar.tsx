import { JSX } from "solid-js/jsx-runtime";
import { addStyle } from "../Styles";
import { BackButton } from "./BackButton";

interface TopBarProps {
    title: JSX.Element;
    onBack?: () => void;
    showLogo?: boolean;
}

addStyle(".TopBar", {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "5px",
    margin:'8px'
});

addStyle(".TopBar h2", {
    margin: "0",
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "var(--text-color)",
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
