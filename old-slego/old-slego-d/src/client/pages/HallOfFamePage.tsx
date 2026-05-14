import { createResource, For, Show } from "solid-js";
import { ScoreEntry } from "../../shared/api";
import { useSlegoApp } from "../components/SlegoApp";
import { addStyle } from "../Styles";
import { TopBar } from "../components/TopBar";

addStyle(".HallOfFamePage", {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    minHeight: "100vh",
    padding: "20px",
    boxSizing: "border-box"
});

addStyle(".HallOfFamePage .scores-list", {
    width: '100%',
    maxWidth: '500px',
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    padding: "20px"
});

addStyle(".HallOfFamePage .score-entry", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
});

addStyle(".HallOfFamePage .score-entry:last-child", {
    borderBottom: "none"
});

addStyle(".HallOfFamePage .list-title", {
    marginTop: "0",
    textAlign: "center",
    color: "var(--red-color)"
});

addStyle(".HallOfFamePage .status-text", {
    textAlign: "center"
});

addStyle(".HallOfFamePage .status-text.error", {
    color: "red"
});

addStyle(".HallOfFamePage .status-text.empty", {
    color: "#d1d5db",
    marginTop: "20px"
});

export function HallOfFamePage() {
    const app = useSlegoApp();

    const fetchScores = async () => {
        const today = new Date(); // Client's local date
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const seed = `${year}-${month}-${day}`;

        const response = await fetch(`/api/hall-of-fame?seed=${seed}`);
        if (!response.ok) {
            throw new Error('Failed to fetch scores');
        }
        return response.json() as Promise<ScoreEntry[]>;
    };

    const [scores] = createResource(fetchScores);

    const colors = ['red', 'blue', 'green', 'magenta'] as const;

    function color(index: number) {
        return colors[index % colors.length];
    }


    return (
        <div class="HallOfFamePage">
            <TopBar
                title="Hall of Fame"
                onBack={() => app.navigateTo('menu')}
            />

            <div class="scores-list">
                <h3 class="list-title">Top 10 Today</h3>
                <Show when={!scores.loading && !scores.error} fallback={<p class="status-text">Loading scores...</p>}>
                    <Show when={scores() && scores()!.length > 0} fallback={
                        <p class="status-text empty">
                            No scores yet. Be the first to play!
                        </p>
                    }>
                        <For each={scores()}>
                            {(entry, index) => (
                                <div class={"score-entry color-" + color(index())}>
                                    <span><b>#{index() + 1}</b> {entry.username}</span>
                                    <span>{entry.score} pts</span>
                                </div>
                            )}
                        </For>
                    </Show>
                </Show>
                <Show when={scores.error}>
                    <p class="status-text error">Could not load Hall of Fame.</p>
                </Show>
            </div>
        </div>
    );
}