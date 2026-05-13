import { useSlegoApp } from "../components/SlegoApp";
import { addStyle } from "../Styles";
import { TopBar } from "../components/TopBar";
import { Game } from "@shared/slego";
import { TutorialComponent } from "../components/TutorialComponent";

addStyle(".TutorialPage", {
  display: "flex",
  "flex-direction": "column",
  width: "100%",
  height: "100vh",
  "pointer-events": "auto"
});

addStyle(".TutorialPage .tutorial-header", {
  background: "rgba(0, 0, 0, 0.9)",
  padding: "15px 20px",
  "border-bottom": "1px solid rgba(255, 255, 255, 0.1)"
});

export function TutorialPage() {
  const app = useSlegoApp();
  let tutorial = app.currentTutorial.get();
  let game = Game.random(tutorial?.rounds, tutorial?.seed);
  const tutorialComponent = new TutorialComponent(app, game, tutorial!)

  return (
    <div class=" ">
      <div class="tutorial-header">
        <TopBar
          title="Tutorial"
          onBack={() => {
            app.currentScreen.set('menu');
          }}
        />
      </div>
      {tutorialComponent.render()}
    </div>
  );
}
