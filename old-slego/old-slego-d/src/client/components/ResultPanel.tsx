import { createSignal, Switch, Match } from "solid-js";
import { addStyle } from "../Styles";
import { Button } from "./Button";
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
    background: "linear-gradient(135deg, rgb(var(--bg-color)), rgb(var(--blue)/0.3))",
    border: "2px solid #22c55e",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
    animation: "slideInFromTop 0.3s ease-out",
    backdropFilter: "blur(10px)"
});

addStyle(".ResultPanel h2", {
    color: "#22c55e",
    fontSize: "1.4rem",
    marginBottom: "15px"
});

addStyle(".ResultPanel .result-details", {
    marginBottom: "10px"
});

addStyle(".ResultPanel .result-details p", {
    fontSize: "1.1rem",
    margin: "8px 0",
    color: "rgb(var(--text-color) / 0.5)"
});

addStyle(".ResultPanel .score-highlight", {
    color: "#ffd700",
    fontWeight: "bold",
    fontSize: "1.2rem"
});

addStyle(".ResultPanel .result-buttons", {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
    marginTop: '20px',
});

addStyle(".ResultPanel .save-status", {
    minHeight: "24px",
    marginBottom: "10px"
});

addStyle(".ResultPanel .save-status .saved", {
    color: "#22c55e"
});

addStyle(".ResultPanel .save-status .error", {
    color: "red"
});

export function ResultPanel(props: ResultPanelProps) {
    const [saveState, setSaveState] = createSignal<'saving' | 'saved' | 'error'>('saving');
    const [errorMessage, setErrorMessage] = createSignal('');

    // Automatically save the score when the component is created.
    // This runs once when the ResultPanel is rendered.
    (async () => {
        const score = props.game.previousRound.get().total;
        const seed = props.game.previousRound.get().game.seed;

        if (!seed) {
            console.error("No seed found, cannot save score.");
            setErrorMessage("No game seed found.");
            setSaveState('error');
            return;
        }

        try {
            const response = await fetch('/api/save-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score, seed }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save score');
            }

            setSaveState('saved');

        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message);
            setSaveState('error');
        }
    })();

    return (
        <div class="ResultPanel">
            <h2>🎉 Game Complete!</h2>
            <div class="result-details">
                <p>Final Score: <span class="score-highlight">{props.game.previousRound.get().total}</span> points</p>
                <p>Rounds Played: {props.rounds}/{props.game.rounds}</p>
            </div>

            <div class="save-status">
                <Switch>
                    <Match when={saveState() === 'saving'}>
                        <p>Saving score...</p>
                    </Match>
                    <Match when={saveState() === 'saved'}>
                        <p class="saved">Score Saved!</p>
                    </Match>
                    <Match when={saveState() === 'error'}>
                        <p class="error">Error: {errorMessage()}</p>
                    </Match>
                </Switch>
            </div>

            <div class="result-buttons">
                <Button
                    class="red"
                    onclick={props.onPlayAgain}
                >
                    Play Again
                </Button>
                <Button
                    class="blue"
                    onclick={props.onBackToMenu}
                >
                    Back to Menu
                </Button>
            </div>
        </div>
    );
}
