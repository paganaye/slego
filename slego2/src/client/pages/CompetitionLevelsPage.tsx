import { For } from "solid-js";
import { useSlegoApp } from "../components/SlegoApp";
import { TopBar } from "../components/TopBar";
import { LevelButton } from "../components/LevelButton";
import { addStyle } from "../Styles";
import { Game } from "@shared/slego";


addStyle(".CompetitionLevelsPage .levels", {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px"
});

addStyle(".fullwidth", {
    width: '100%'
});


export function stringToSeed(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash); // Use absolute value for the seed
}

export function CompetitionLevelsPage() {
    const app = useSlegoApp()!;

    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return date;
    }).reverse(); // so today is last

    const levels = days.map(date => {
        const dateString = date.toISOString().split('T')[0]!;
        return {
            date: date,
            name: date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
            seed: dateString
        };
    });

    return (
        <div class="CompetitionLevelsPage">
            <TopBar
                title="Competition levels"
                onBack={() => app.navigateTo('menu')}
            />
            <div class="levels page-content">
                <p class="fullwidth" >SLEGO holds a daily worldwide competition.</p>
                <p class="fullwidth" >Visit the hall of fame to see your ranking today.</p>
                {/* Generate level buttons */}
                <For each={levels}>
                    {(level) => {
                        return (<LevelButton
                            onclick={() => {
                                let newGame = Game.random({ rounds: 40, seed: level.seed.toString(), name: level.name })
                                app.currentGame.set(newGame)
                                app.navigateTo('game');
                            }}

                            red={level == levels.at(-1)}>
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