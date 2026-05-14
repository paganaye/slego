import { createSignal } from 'solid-js';
import { sounds, type Sound } from './sounds';
import { Sfx } from './Sfx';

const sfx = new Sfx();

export default function TestPage() {
    const soundNames = Object.keys(sounds) as (keyof typeof sounds)[];
    const [lastPlayed, setLastPlayed] = createSignal<string | null>(null);

    function playSound(name: keyof typeof sounds) {
        sfx.play(sounds[name] as Sound);
        setLastPlayed(name);
    }

    return (
        <div style={{ padding: '2rem', 'font-family': 'sans-serif' }}>
            <h2>Test Page: Sounds</h2>
            <ul style={{ 'list-style': 'none', padding: 0 }}>
                {soundNames.map(name => (
                    <li style={{ margin: '1em 0' }}>
                        <button onClick={() => playSound(name)}>
                            Play
                        </button>
                        <span style={{ 'margin-left': '1em' }}>{name}</span>
                        {lastPlayed() === name && <span style={{ color: 'green', 'margin-left': '1em' }}>(Played)</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}
