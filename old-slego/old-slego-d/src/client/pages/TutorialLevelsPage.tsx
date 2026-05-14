import { For } from "solid-js";
import { useSlegoApp } from "../components/SlegoApp";
import { addStyle } from "../Styles";
import { TopBar } from "../components/TopBar";
import { TUTORIAL_LEVELS } from "../tutorial-levels";
import { LevelButton } from "../components/LevelButton";
import { Game } from "@shared/slego";

addStyle(".LevelsPage", {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    minHeight: "100vh",
    padding: "20px",
    boxSizing: "border-box"
});

addStyle(".LevelsPage .level-progress", {
    textAlign: "center",
    marginBottom: "30px",
    color: "#d1d5db"
});

addStyle(".LevelsPage .progress-info", {
    fontSize: "1rem",
    marginBottom: "12px"
});

addStyle(".LevelsPage .progress-bar", {
    width: "300px",
    height: "6px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "3px",
    margin: "0 auto",
    overflow: "hidden"
});

addStyle(".LevelsPage .progress-fill", {
    background: "linear-gradient(90deg, var(--red), var(--blue))",
    borderRadius: "3px",
    transition: "width 0.3s ease",
    width: "0%" // Will be updated dynamically
});

addStyle(".LevelsPage .levels", {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px"
});

export function TutorialLevelsPage() {
    const app = useSlegoApp();

    return (
        <div class="LevelsPage">
            <TopBar
                title="Select Tutorial Level"
                onBack={() => app.navigateTo('menu')}
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
                        return (<LevelButton
                            class={`${i === 1 ? '' : 'locked'}`}
                            onclick={() => {
                                let newGame = Game.fromTutorial(level);
                                app.currentGame.set(newGame);
                                app.navigateTo('game');
                            }}>
                            <div class="level-number">{i}</div>
                            <div class="level-name">
                                {level.name}
                            </div>
                        </LevelButton>);
                    }}
                </For>
            </div>
        </div>
    );
}