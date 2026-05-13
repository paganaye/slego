import { useSlegoApp } from "../components/SlegoApp";
import { addStyle } from "../Styles";
import { TopBar } from "../components/TopBar";


addStyle(".HallOfFamePage", {
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    gap: "20px",
    "pointer-events": "auto",
    "min-height": "100vh",
    padding: "20px",
    "box-sizing": "border-box"
});

addStyle(".HallOfFamePage .game-stats", {
    display: "grid",
    "grid-template-columns": "repeat(2, 1fr)",
    gap: "15px",
    "margin-bottom": "20px",
    padding: "15px",
    background: "rgba(255, 255, 255, 0.1)",
    "border-radius": "8px",
    "min-width": "300px"
});

addStyle(".HallOfFamePage .stat-item", {
    display: "flex",
    "justify-content": "space-between",
    "align-items": "center"
});

addStyle(".HallOfFamePage .stat-label", {
    "font-weight": "bold",
    color: "#d1d5db"
});

addStyle(".HallOfFamePage .scores-list", {
    width: "100%",
    "max-width": "400px",
    background: "rgba(255, 255, 255, 0.05)",
    "border-radius": "8px",
    padding: "20px"
});

addStyle(".HallOfFamePage .score-entry", {
    display: "flex",
    "justify-content": "space-between",
    "align-items": "center",
    padding: "10px 0",
    "border-bottom": "1px solid rgba(255, 255, 255, 0.1)"
});

addStyle(".HallOfFamePage .score-entry:last-child", {
    "border-bottom": "none"
});

export function HallOfFamePage() {
    const app = useSlegoApp();

    return (
        <div class="HallOfFamePage">
            <TopBar
                title="Hall of Fame"
                onBack={() => app.currentScreen.set('menu')}
            />

            <div class="game-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Games:</span>
                    <span>0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Average Score:</span>
                    <span>0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">High Score:</span>
                    <span>0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Players:</span>
                    <span>0</span>
                </div>
            </div>

            <div class="scores-list">
                <h3 style="margin-top: 0; text-align: center; color: #ff4500;">Top Scores</h3>
                <div class="score-entry">
                    <span>#1 Player</span>
                    <span>0 pts</span>
                </div>
                <p style="text-align: center; color: #d1d5db; margin-top: 20px;">
                    No scores yet. Be the first to play!
                </p>
            </div>
        </div>
    );
}
