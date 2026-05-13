import { render } from "solid-js/web";
import { SlegoApp } from "./components/SlegoApp";


console.log("Slego Game Starting...");

function applyTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add('theme-dark');
  } else {
    document.documentElement.classList.remove('theme-dark');
  }
}

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

applyTheme(darkModeMediaQuery.matches);

darkModeMediaQuery.addEventListener('change', (e) => applyTheme(e.matches));


const app = new SlegoApp();
render(() => app.render(), document.body);