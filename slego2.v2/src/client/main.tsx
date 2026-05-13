// SLEGO Game - Hybrid Entry Point (Solid.js + Vanilla coexistence)
import { render } from "solid-js/web";
import { SlegoApp } from "./components/SlegoApp";

console.log("Slego Game Starting...");

const app = new SlegoApp();
render(() => app.render(), document.body);
