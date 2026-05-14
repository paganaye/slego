import { createSignal, createEffect, onMount } from 'solid-js';

const THEMES = ['Light', 'Dark', 'Modern', 'Retro'] as const;
type THEME = typeof THEMES[number];

const LOCAL_STORAGE_KEY = 'slego-theme';

export function ThemeSelector() {
  const [currentThemeName, setCurrentThemeName] = createSignal<THEME>('Modern');

  onMount(() => {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEY) as THEME | null;
    if (storedTheme && THEMES.includes(storedTheme)) {
      setCurrentThemeName(storedTheme);
    }
  });

  createEffect(() => {
    const theme = currentThemeName();
    // This is a simple approach. For more complex apps, you might want a more robust system.
    document.documentElement.className = `${theme.toLowerCase()}-theme`;
    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
  });

  return (
    <div class="theme-selector">
      <select
        value={currentThemeName()}
        onChange={(e) => setCurrentThemeName(e.currentTarget.value as THEME)}
      >
        {THEMES.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
