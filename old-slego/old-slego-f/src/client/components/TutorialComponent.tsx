import { Game } from "@shared/slego";
import { ITutorialLevel, ITutorialStep } from "../tutorial";
import { GameComponent } from "./GameComponent";
import { SlegoApp } from "components/SlegoApp";
import { Signal } from "../Signal";
import { Accessor, createMemo } from "solid-js";

export interface GameComponentProps {
  tutorial?: ITutorialLevel | undefined;
  level?: number;
  onGameEnd?: (score: number, rounds: number) => void;
}


export const TILE_SIZE = 50;

export class TutorialComponent extends GameComponent {
  readonly currentStepNo = new Signal<number>(0);
  currentStep: Accessor<ITutorialStep>;

  constructor(app: SlegoApp, game: Game, readonly tutorial: ITutorialLevel) {
    super(app, game);
    this.introduction.set("We're in the tutorial");
    this.currentStep = createMemo(() => {
      return this.tutorial.steps[this.currentStepNo.get()]!;
    });
    // this.pieceDragAllowed.set(false);
    // this.boardClickAllowed.set(false);
    // this.passAllowed.set(false);
    // this.playAllowed.set(false);
    // this.pieceDragAllowed.set(false);
    // this.boardClickAllowed.set(false);
  }


}
