import { For } from "solid-js";
import { useSlegoApp } from "../components/SlegoApp";
import { addStyle } from "../Styles";
import { TopBar } from "../components/TopBar";
import { TUTORIAL_LEVELS } from "../tutorial-levels";

addStyle(".LevelsPage", {
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    gap: "20px",
    "pointer-events": "auto",
    "min-height": "100vh",
    padding: "20px",
    "box-sizing": "border-box"
});

addStyle(".LevelsPage .level-progress", {
    "text-align": "center",
    "margin-bottom": "30px",
    color: "#d1d5db"
});

addStyle(".LevelsPage .progress-info", {
    "font-size": "1rem",
    "margin-bottom": "12px"
});

addStyle(".LevelsPage .progress-bar", {
    width: "300px",
    height: "6px",
    background: "rgba(255, 255, 255, 0.2)",
    "border-radius": "3px",
    margin: "0 auto",
    overflow: "hidden"
});

addStyle(".LevelsPage .progress-fill", {
    height: "100%",
    background: "linear-gradient(90deg, #ff4500, #ffd700)",
    "border-radius": "3px",
    transition: "width 0.3s ease",
    width: "0%" // Will be updated dynamically
});

addStyle(".LevelsPage .levels", {
    display: "flex",
    "flex-wrap": "wrap",
    gap: "16px"
});

addStyle(".tutorial-level-btn", {
    background: "rgba(255, 255, 255, 0.08)",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    "border-radius": "12px",
    padding: "20px 12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    width: "150px",
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    gap: "8px",
    "min-height": "90px",
    position: "relative",
    color: "#ffffff"
});

addStyle(".tutorial-level-btn:hover:not(.locked)", {
    background: "rgba(255, 255, 255, 0.15)",
    "border-color": "rgba(255, 255, 255, 0.4)",
    transform: "translateY(-2px)"
});

addStyle(".tutorial-level-btn.completed", {
    background: "rgba(255, 69, 0, 0.2)",
    "border-color": "#ff4500"
});

addStyle(".tutorial-level-btn.locked", {
    background: "rgba(100, 100, 100, 0.1)",
    "border-color": "rgba(150, 150, 150, 0.2)",
    cursor: "not-allowed",
    opacity: "0.5"
});

addStyle(".tutorial-level-btn.locked::after", {
    content: "'🔒'",
    position: "absolute",
    top: "8px",
    right: "8px",
    "font-size": "1rem"
});

addStyle(".tutorial-level-btn .level-number", {
    "font-size": "1.4rem",
    "font-weight": "700"
});

addStyle(".tutorial-level-btn .level-name", {
    "font-size": "0.8rem",
    color: "#d1d5db",
    "text-align": "center"
});

export function TutorialLevelsPage() {
    const app = useSlegoApp();


    return (
        <div class="LevelsPage">
            <TopBar
                title="Select Tutorial Level"
                onBack={() => app.currentScreen.set('menu')}
            />

            <div class="level-progress">
                <div class="progress-info">
                    <span>0</span> of <span>10</span> levels completed
                </div>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>

            <div class="levels">
                {/* Generate level buttons */}
                <For each={TUTORIAL_LEVELS}>
                    {(level, getI) => {
                        let i = getI() + 1;
                        return (<button
                            class={`tutorial-level-btn ${i === 1 ? '' : 'locked'}`}
                            onclick={() => {
                                // Start tutorial level
                                console.log("hi " + i)
                                app.currentTutorial.set(level);
                                app.currentScreen.set('tutorial');
                            }}>
                            <div class="level-number">{i}</div>
                            <div class="level-name">
                                {level.name}
                            </div>
                        </button>);
                    }}
                </For>
            </div>
        </div>
    );
}
