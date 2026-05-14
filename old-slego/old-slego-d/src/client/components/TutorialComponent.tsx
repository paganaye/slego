import { IPosition } from "@shared/slego";
import { ITutorialStep } from "../../shared/tutorial";
import { GameComponent, GameComponentProps } from "./GameComponent";
import { Signal } from "../Signal";
import { Accessor, createMemo, JSX, onMount, Show } from "solid-js";
import { Button } from "./Button";
import { addKeyframes, addStyle } from "../Styles";


addStyle(".tutorialTarget", {
  position: "relative",
});

addStyle(".tutorialTarget::before", {
  content: "''",
  position: "absolute",
  inset: `-4px`,
  border: `4px solid var(--yellow)`,
  borderRadius: "8px",
  pointerEvents: "none",
  boxSizing: "border-box",
  animation: "tutorial-pulse 300ms ease-in-out infinite alternate",
});

addKeyframes("tutorial-pulse", {
  "0%": { inset: `-6px` },
  "100%": { inset: `-8px` },
});

addStyle(".tutorial-bar", {
  backgroundColor: 'var(--bg-tutorial)',
  padding: '1em',
  margin: '1em'
});

addStyle(".tutorial-bar h2", {
  fontSize: '1.1em'
});
export const TILE_SIZE = 40;

export class TutorialComponent extends GameComponent {

  readonly currentStepNo = new Signal<number>(-1);
  readonly currentStep: Accessor<ITutorialStep>;
  readonly tutorialMessage = new Signal("");

  constructor(props: GameComponentProps) {
    super(props);

    this.currentStep = createMemo(() => {
      let stepNo = this.currentStepNo.get();
      let tutorial = this.props.game.tutorial!;

      let result = tutorial.steps[stepNo];
      if (!result) result = { action: 'message', instruction: '...' }
      return result;
    });

    onMount(() => {
      this.incStepNo();
    });
  }

  override boardClickAllowed() {
    return super.boardClickAllowed() && this.currentStep().action != 'message';
  }

  override passAllowed() {
    return super.passAllowed() && this.currentStep().action != 'message';
  }

  override pieceDragAllowed() {
    return super.pieceDragAllowed() && this.currentStep().action != 'message';
  }

  onStepChanged() {
    this.tutorialMessage.set("")
    this.app.tutorialTarget.set(null);

    let currentStep = this.currentStep();
    this.app.tutorialTarget.set(currentStep.target ?? null);
    this.app.tutorialTile.set(currentStep.tile ?? null);
  }

  override highlightedPosition(): IPosition | null {
    let currentStep = this.currentStep();
    if (currentStep.action == 'click-board' && currentStep.tile) {
      return currentStep.tile;
    }
    return null;
  }

  override setSelectedPosition(position: IPosition | null) {
    let currentStep = this.currentStep();
    if ((currentStep.action == 'click-board'
      || currentStep.action == 'drop-piece'
    ) && currentStep.tile) {
      if (position == null
        || (position?.tx == currentStep.tile.tx && position?.ty == currentStep.tile.ty)) {
        super.setSelectedPosition(position);
        this.tutorialMessage.set("Lovely")
        if (currentStep.action == "click-board") {
          this.incStepNo();
        }
        return true;
      } else {
        this.tutorialMessage.set("Click the yellow title to continue.")
      }
    }
    return false;
  }

  override async playPiece(): Promise<boolean> {
    switch (this.currentStep().action) {
      case "play-btn":
        if (await super.playPiece()) this.incStepNo()
        return true;
      default:
        return false;
    }
  }

  override async _onOutOfBoardPointerDown(_e: PointerEvent) {
    switch (this.currentStep().action) {
      // case "place-piece":
      //   if (await super._onOutOfBoardPointerDown(e)) {
      //     this.incStepNo();
      //     return true;
      //   }
      default:
        return false;
    }
  }



  override async passRound() {
    switch (this.currentStep().action) {
      case "pass-btn":
        return await super.passRound();
      default:
        return false;
    }
  }


  incStepNo(): boolean {
    this.currentStepNo.set(this.currentStepNo.get() + 1);
    this.onStepChanged();
    return true;
  }

  nextTutorial() {
    this.props.onLaunchNextTutorial?.()
  }

  override highlightPiece() {
    return true;
  }

  override onStartDraggingPiece(): boolean {
    if (this.currentStep().action === 'start-drag') {
      this.incStepNo();
      return true;
    } else return false;
  }

  override renderTopBar(): JSX.Element {
    let currentStep = this.currentStep();
    return <>
      <h3>{this.props.game.tutorial?.description}</h3>
      <div class="tutorial-bar">
        <div class="column">
          <p>{currentStep.instruction}</p>
          <p>{this.tutorialMessage.get()}</p>

        </div>
        <Show when={currentStep.action == 'message' && this.currentStepNo.get() < this.props.game.tutorial!.steps.length - 1}>
          <Button
            tutorialId="next-btn"
            class="red"
            onclick={() => { this.incStepNo() }}>Next</Button >
        </Show>
        <Show when={currentStep.action == 'message' && this.currentStepNo.get() == this.props.game.tutorial!.steps.length - 1}>
          <Button
            tutorialId="next-btn"
            class="red"
            onclick={() => { this.nextTutorial() }}>Next tutorial</Button >
        </Show>
      </div>
    </>
  }

  override renderBottomBar() {
    let currentStep = this.currentStep();
    return <>
      <Show when={currentStep.showBottomBar != false}>
        <div class="row">
          {this.renderPlayButton()}
          {this.renderPassButton()}
        </div>
      </Show>
    </>
  }
}
