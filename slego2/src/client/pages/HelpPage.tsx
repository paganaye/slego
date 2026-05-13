import { useSlegoApp } from "../components/SlegoApp";
import { addStyle } from "../Styles";
import { TopBar } from "../components/TopBar";


addStyle(".HelpPage", {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    minHeight: "100vh",
    padding: "20px",
    boxSizing: "border-box",
    maxHeight: "100vh"
});

addStyle(".HelpPage .help-section", {
    marginBottom: "30px",
    padding: "20px",
    background: "rgba(128, 128, 128, 0.15)",
    borderRadius: "8px"
});

addStyle(".HelpPage .help-section h3", {
    color: "var(btn-red)",
    marginBottom: "15px",
    fontSize: "1.2rem"
});

addStyle(".HelpPage .help-section p", {
    lineHeight: "1.6",
    marginBottom: "10px",
    color: "rgb(var(--text-color) / 0.5)"
});

addStyle(".HelpPage .help-section ul", {
    paddingLeft: "20px",
    color: "rgb(var(--text-color) / 0.5)"
});

addStyle(".HelpPage .help-section li", {
    marginBottom: "8px",
    lineHeight: "1.5"
});

addStyle(".HelpPage .scoring-table", {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "6px",
    padding: "15px",
    "margin": "15px 0"
});

addStyle(".HelpPage .score-row", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

addStyle(".HelpPage .score-row:last-child", {
    borderBottom: "none"
});

addStyle(".HelpPage .score-row.penalty", {
    color: "#ff6b6b"
});



export function HelpPage() {
    const app = useSlegoApp();

    return (
        <div class="HelpPage">
            <TopBar
                title="How to Play SLEGO"
                onBack={() => app.navigateTo('menu')}
            />

            <div class="page-content">
                <div class="help-section">
                    <h3>🎯 Objective</h3>
                    <p>
                        Place pieces on a 5×5 board to form lines of 3+ consecutive colors.
                        Score points and clear lines over 40 rounds!
                    </p>
                </div>

                <div class="help-section">
                    <h3>🎮 How to Play</h3>
                    <p><strong>Method 1: Click & Place</strong></p>
                    <p>1. Click on the board to select a position</p>
                    <p>2. Click "Play Piece" to confirm</p>

                    <p style="margin-top: 15px;"><strong>Method 2: Drag & Drop</strong></p>
                    <p>1. Drag the current piece from the preview</p>
                    <p>2. Drop it directly on the board</p>
                </div>

                <div class="help-section">
                    <h3>🧩 Pieces</h3>
                    <p>
                        Each piece has a <strong>center</strong> and up to 4 <strong>arms</strong>
                        (up, down, left, right). All parts can be different colors:
                        Red, Blue, Green, or Magenta.
                    </p>
                </div>

                <div class="help-section">
                    <h3>📏 Scoring</h3>
                    <div class="scoring-table">
                        <div class="score-row">
                            <span>3 in a row:</span>
                            <span>+10 points</span>
                        </div>
                        <div class="score-row">
                            <span>4 in a row:</span>
                            <span>+20 points</span>
                        </div>
                        <div class="score-row">
                            <span>5 in a row:</span>
                            <span>+50 points</span>
                        </div>
                        <div class="score-row penalty">
                            <span>Overwrite existing:</span>
                            <span>-1 point each</span>
                        </div>
                    </div>
                    <p><strong>Bonus:</strong> Score × Number of lines formed</p>
                </div>

                <div class="help-section">
                    <h3>✨ Strategy Tips</h3>
                    <ul>
                        <li>Plan ahead - you have 40 pieces total</li>
                        <li>Try to form multiple lines at once for bonus multipliers</li>
                        <li>Avoid overwriting existing pieces when possible</li>
                        <li>Completed lines disappear, making space for new pieces</li>
                        <li>Use "Pass" if you can't make a good move</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
