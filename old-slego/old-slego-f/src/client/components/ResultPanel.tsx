import { addStyle } from "../Styles";
import { GameComponent } from "./GameComponent";

interface ResultPanelProps {
    game: GameComponent;
    score: number;
    rounds: number;
    onPlayAgain: () => void;
    onBackToMenu: () => void;
}

// Add component-specific styles
addStyle(".ResultPanel", {
    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.95))",
    border: "2px solid #22c55e",
    "border-radius": "12px",
    padding: "20px",
    "text-align": "center",
    "box-shadow": "0 8px 32px rgba(0, 0, 0, 0.6)",
    animation: "slideInFromTop 0.3s ease-out",
    "pointer-events": "auto",
    "backdrop-filter": "blur(10px)"
});

addStyle(".ResultPanel h2", {
    color: "#22c55e",
    "font-size": "1.4rem",
    "margin-bottom": "15px"
});

addStyle(".ResultPanel .result-details", {
    "margin-bottom": "20px"
});

addStyle(".ResultPanel .result-details p", {
    "font-size": "1.1rem",
    margin: "8px 0",
    color: "#e5e5e5"
});

addStyle(".ResultPanel .score-highlight", {
    color: "#ffd700",
    "font-weight": "bold",
    "font-size": "1.2rem"
});

addStyle(".ResultPanel .result-buttons", {
    display: "flex",
    gap: "15px",
    "justify-content": "center",
    "flex-wrap": "wrap"
});

addStyle(".ResultPanel .result-buttons button", {
    "min-width": "120px"
});

export function ResultPanel(props: ResultPanelProps) {


    return (
        <div class="ResultPanel">
            <h2>🎉 Game Complete!</h2>
            <div class="result-details">
                <p>Final Score: <span class="score-highlight">{props.game.currentRound.get().total}</span> points</p>
                <p>Rounds Played: {props.rounds}/{props.game.rounds}</p>
            </div>
            <div class="result-buttons">
                <button
                    class="menu-btn"
                    onclick={props.onPlayAgain}
                >
                    Play Again
                </button>
                <button
                    class="menu-btn secondary"
                    onclick={props.onBackToMenu}
                >
                    Back to Menu
                </button>
            </div>
        </div>
    );
}
