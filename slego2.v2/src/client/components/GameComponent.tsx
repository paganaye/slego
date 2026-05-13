import { Accessor, createMemo, JSX, Match, onMount, Show, Switch } from "solid-js";
import { Board, Piece, IPosition, Round, Game } from "@shared/slego";
import { Signal } from "../Signal";
import { BoardComponent, BoardTile } from "../components/BoardComponent";
import { Button } from "../components/Button";
import { PieceComponent } from "../components/PieceComponent";
import { addStyle } from "../Styles";
import { ITutorialLevel } from "../tutorial";
import { SlegoApp } from "./SlegoApp";
import { ResultPanel } from "./ResultPanel";
import { playSound } from "../sound";

export interface GameComponentProps {
  tutorial?: ITutorialLevel | undefined;
  level?: number;
  onGameEnd?: (score: number, rounds: number) => void;
}


export const TILE_SIZE = 50;

addStyle(".GameComponent", {
  display: "flex",
  "flex-direction": "column",
  width: "100%",
  height: "100%",
  "pointer-events": "auto"
});

addStyle(".GameComponent .game-content", {
  flex: "1",
  display: "flex",
  gap: "30px",
  "align-items": "flex-start",
  "justify-content": "center",
  padding: "20px"
});

addStyle(".GameComponent .game-board-container", {
  display: "flex",
  "flex-direction": "column",
  "align-items": "center",
  gap: "20px",
  position: "relative"
});

addStyle(".GameComponent .game-sidebar", {
  display: "flex",
  "flex-direction": "column",
  width: "100%",
  "max-width": "300px",
  gap: "15px"
});

addStyle(".GameComponent .current-piece", {
  display: "flex",
  "flex-direction": "column",
  "align-items": "center",
  gap: "10px"
});

addStyle(".GameComponent .current-piece h3", {
  margin: "0",
  "font-size": "1.1rem",
  "text-align": "center"
});

addStyle(".GameComponent .game-info", {
  display: "flex",
  "flex-direction": "column",
  gap: "10px",
  padding: "15px",
  background: "rgba(255, 255, 255, 0.1)",
  "border-radius": "8px"
});

addStyle(".GameComponent .game-info div", {
  "font-size": "1.1rem",
  "font-weight": "bold"
});

addStyle(".GameComponent .game-actions", {
  display: "flex",
  gap: "15px",
  padding: "15px 20px",
  "background": "rgba(0, 0, 0, 0.9)",
  "border-top": "1px solid rgba(255, 255, 255, 0.1)"
});

addStyle(".GameComponent .game-actions .action-btn", {
  flex: "1",
  "min-height": "50px"
});


addStyle(".GameComponent .dragged-piece", {
  position: 'absolute',
  transition: "opacity 0.2s ease-in-out"
});

addStyle(".GameComponent .piece-preview", {
  "background-color": "rgba(255, 255, 255, 0.1)",
  "border-radius": "8px",
  "min-height": "80px",
  padding: "12px",
  display: "flex",
  "justify-content": "center",
  "align-items": "center",
  "width": TILE_SIZE * 3 + "px",
  "height": TILE_SIZE * 3 + "px"
});

addStyle(".current-task", {
  'padding': '10px'
});

addStyle("div.board-text", {
  position: 'absolute',
  'background-color': 'transparent',
  'font-size': '3em',
  'font-weight': 'bold',
  'color': 'white',
  'text-align': 'center',
  'top': '50%',
  'left': '50%',
  'transform': 'translate(-50%, -50%)',
  'z-index': '10',
  'pointer-events': 'none',
  'opacity': '0',
  'transition': 'opacity 0.5s ease-out, transform 0.5s ease-out'
});

addStyle("div.board-text.board-text-visible", {
  'opacity': '1',
  'transform': 'translate(-50%, -50%) scale(1.2)'
});

export class GameComponent {
  readonly selectedPosition = new Signal<IPosition | null>(null, (a, b) => (a != null && b != null && a.tx === b.tx && a.ty === b.ty) || a === b);
  readonly currentRound: Signal<Round>
  readonly score: Accessor<number>;
  readonly currentPiece: Signal<Piece | null>;
  readonly roundNo: Accessor<number>;
  readonly introduction = new Signal<JSX.Element>("");
  readonly message = new Signal<string>("");
  readonly draggingPiecePosPx = new Signal<{ ftx: number, fty: number } | null | undefined>(undefined);
  readonly gameFinished: Accessor<boolean>;
  readonly rounds: number;
  gameContentElement: HTMLDivElement | undefined;
  boardContainerRef: HTMLDivElement | undefined;
  piecePreviewRef: HTMLDivElement | undefined;
  tiles: BoardTile[][];

  protected pieceDragAllowed = new Signal(true);
  protected boardClickAllowed = new Signal(true);
  protected passAllowed = new Signal(true);
  protected playAllowed = new Signal(true);
  protected animating = new Signal(false);
  protected boardText = new Signal('');

  constructor(readonly app: SlegoApp, readonly game: Game) {
    this.rounds = game.pieces.length;
    let initialRoundResult: Round = Round.roundZero(this.game);
    this.currentRound = new Signal(initialRoundResult)

    this.score = createMemo(() => this.currentRound.get().total);
    this.roundNo = createMemo(() => this.currentRound.get().roundNo);
    this.currentPiece = new Signal(this.game.pieces[this.roundNo()] ?? null);
    this.gameFinished = createMemo(() => {
      const finished = this.roundNo() >= this.rounds;
      if (finished) {
        playSound('gameFinished');
      }
      return finished;
    });
    let currentBoiard = this.currentRound.get().board;
    this.tiles = Array(5).fill(null).map((_, y) => Array(5).fill(null).map((_, x) => new BoardTile(x, y, currentBoiard.getColorAt(x, y))));

    onMount(() => {
      this.draggingPiecePosPx.set(null);
      playSound('newRound');
    });
  }

  _applyBoard(board: Board) {
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        let boardTile = this._getBoardTile(x, y);
        boardTile.color.set(board.getColorAt(x, y));
        boardTile.class.set('');
      }
    }
  }

  _getBoardTile(x: number, y: number): BoardTile {
    let boardTile = this.tiles[y]![x]!;
    return boardTile;
  }

  _onPiecePointerDown(e: PointerEvent) {
    if (!this.pieceDragAllowed.get() || this.animating.get()) {
      e.preventDefault()
      e.stopPropagation
      return;
    }
    const piece = this.currentPiece.get();
    if (!piece) return;
    this.draggingPiecePosPx.set({ ftx: e.clientX, fty: e.clientY });

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this._onPiecePointerMove(e);
  }

  _onPiecePointerMove(e: PointerEvent) {
    if (this.draggingPiecePosPx.get()) {
      e.preventDefault();
      if (!e.buttons) return this._onPiecePointerUp(e);
      let tx = 0;
      let ty = 0;

      if (this.boardContainerRef) {
        const boardRect = this.boardContainerRef.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        // Check if mouse is over the board
        if (
          mouseX >= boardRect.left &&
          mouseX <= boardRect.right &&
          mouseY >= boardRect.top &&
          mouseY <= boardRect.bottom
        ) {
          let ftx = (mouseX - boardRect.left) / TILE_SIZE;
          let fty = (mouseY - boardRect.top) / TILE_SIZE;
          tx = Math.floor(ftx);
          ty = Math.floor(fty);
          let fracX = ftx - tx;
          let fracY = fty - ty;
          if (fracX >= 0.2 && fracX <= 0.8 && fracY >= 0.2 && fracY <= 0.8) {
            this.selectedPosition.set({ tx, ty });
            return
          }
        }
      }
      this.selectedPosition.set(null);
      this.draggingPiecePosPx.set({
        ftx: e.clientX - TILE_SIZE * 1.5,
        fty: e.clientY - TILE_SIZE * 1.5
      });
    }
  }

  _onPiecePointerUp(e: PointerEvent) {
    if (this.draggingPiecePosPx.get()) {
      e.preventDefault();
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      this.draggingPiecePosPx.set(null);
    }
  }

  _onGamePointerDown(e: PointerEvent) {
    if (e.target != this.gameContentElement) return;
    let pos = this.selectedPosition.get();
    if (pos) {
      this.placePiece();
    }
  }

  _draggedPiecePos = createMemo(() => {
    let selectedPos = this.selectedPosition.get();
    if (selectedPos) {
      const rect = this.boardContainerRef!.getBoundingClientRect();
      return {
        left: `${(selectedPos.tx - 1) * TILE_SIZE + rect.left}px`,
        top: `${(selectedPos.ty - 1) * TILE_SIZE + rect.top}px`,
      }
    } else {
      let pos = this.draggingPiecePosPx.get();
      if (pos) {
        return {
          left: `${pos.ftx}px`,
          top: `${pos.fty}px`,
          opacity: "0.75"
        }
      } else {
        if (!this.piecePreviewRef) return;
        const rect = this.piecePreviewRef!.getBoundingClientRect();
        return { left: `${rect.left + 0 * TILE_SIZE}px`, top: `${rect.top + 0 * TILE_SIZE}px` };
      }
    }
  })

  render() {

    return (
      <div class="GameComponent">
        {this.renderIntroduction()}
        {this.renderGameContent()}
        {this.renderBottomBar()}
        {this.renderFloatingPiece()}
      </div >
    );
  }

  renderFloatingPiece() {
    return <div class="dragged-piece" style={this._draggedPiecePos()}>
      <PieceComponent piece={this.currentPiece.get()!}
        notAllowed={!this.pieceDragAllowed.get()}

        onPointerDown={(e) => this._onPiecePointerDown(e)}
        onPointerMove={(e) => this._onPiecePointerMove(e)}
        onPointerUp={(e) => this._onPiecePointerUp(e)}
      />
    </div>
  }

  renderIntroduction() {
    return <Show when={this.introduction.get()}>
      <div class="current-task">{this.introduction.get()}</div>
    </Show>

  }

  renderGameContent() {

    return <div class="game-content" onPointerDown={(e) => this._onGamePointerDown(e)} ref={this.gameContentElement!}>
      <div class="game-board-container" ref={this.boardContainerRef}>
        <BoardComponent
          tiles={this.tiles}
          notAllowed={!this.boardClickAllowed.get()}
          x-selectedPosition={this.selectedPosition.get()}
          onCellPointerDown={(e, pos) => this.onBoardPointerDown(e, pos)}
        />
        <div class="board-text" classList={{ "board-text-visible": !!this.boardText.get() }}>
          {this.boardText.get()}
        </div>
        <Show when={this.message.get()}>
          <div class="game-message">{this.message.get()}</div>
        </Show>
      </div>
      <div class="game-sidebar">
        {this.renderSideBar()}
      </div>
    </div>
  }

  renderSideBar() {
    {/* Piece preview */ }
    return <Switch>
      <Match when={!this.gameFinished()}>
        <div class="current-piece">
          <h3>Piece {this.roundNo() + 1}/{this.rounds}</h3>
          <div class="piece-preview" ref={this.piecePreviewRef} onclick={() => this.selectedPosition.set(null)} />
        </div>
        <div class="game-info">
          <div>Score: {this.score()}</div>
        </div>
      </Match>
      <Match when={this.gameFinished()}>
        <div class="game-info">
          <div>Game complete</div>
          <div>Final score: {this.score()}</div>
        </div>
      </Match>
    </Switch>

  }

  renderBottomBar() {
    return <Show when={!this.gameFinished()} fallback={<ResultPanel onBackToMenu={() => this.app.currentScreen.set('menu')} onPlayAgain={() => { }} game={this} score={this.score()} rounds={this.rounds} />}>
      <div class="game-actions">
        <Button class="primary" disabled={this.selectedPosition.get() == null || this.playAllowed.get() == false}
          onclick={() => this.placePiece()}>
          {this.selectedPosition.get() == null ? `Select piece ${this.roundNo() + 1} position` : `Place Piece ${this.roundNo() + 1}`}
        </Button>
        <Button onclick={() => this.passRound()}
          disabled={this.selectedPosition.get() !== null || this.passAllowed.get() == false}>
          Pass
        </Button>
      </div>
    </Show>
  }

  async placePiece() {
    if (this.playAllowed.get() && !this.animating.get()) {
      this.animating.set(true);
      let currentRound = this.currentRound.get();
      let currentPiece = this.currentPiece.get()!;
      let selectedPos = this.selectedPosition.get()!;
      this.selectedPosition.set(null);
      let newRound = currentRound.withPiecePlaced(currentPiece, selectedPos);
      playSound('piecePlaced');

      this._applyBoard(newRound.intermediaryBoard);

      // Display message: Piece placed, checking for lines
      this.message.set("Piece placed. Checking for lines...");
      this.currentPiece.set(null);

      if (newRound.segments.length > 0) {
        for (let i = 0; i < newRound.segments.length; i++) {
          let segment = newRound.segments[i]!;
          switch (segment.length) {
            case 3:
              playSound('newLine3');
              break;
            case 4:
              playSound('newLine4');
              break;
            case 5:
              playSound('newLine5');
              break;
          }
          {
            let { tx, ty } = segment.start;
            for (let j = 0; j < segment.length; j++) {
              this._getBoardTile(tx, ty).class.set('excited')
              if (segment.direction == 'horizontal') tx += 1;
              else ty += 1;
              await this.delay(50);
            }
            await this.delay(200);
          }
        }
        await this.delay(500);
        for (let i = 0; i < newRound.segments.length; i++) {
          let segment = newRound.segments[i]!;
          let { tx, ty } = segment.start;
          for (let j = 0; j < segment.length; j++) {
            let boardTile = this._getBoardTile(tx, ty);
            boardTile.class.set('back')
            boardTile.color.set(null);
            playSound('tileOverwritten');
            if (segment.direction == 'horizontal') tx += 1;
            else ty += 1;
            await this.delay(50);
          }
          await this.delay(200);
        }
        this.message.set("All lines cleared!");
        let scoreText = `+${newRound.baseScore}`;
        if (newRound.segments.length > 1) {
          scoreText += `\nx${newRound.segments.length}`;
        }

        this.boardText.set(scoreText);

        // Play scoreCling multiple times with delay
        const clingCount = Math.floor(newRound.baseScore / 10);
        for (let i = 0; i < clingCount; i++) {
          playSound('scoreCling');
          await this.delay(150); // Small delay between each cling sound
        }
        await this.delay(1000); // Display score for 1 second
        this.boardText.set('');
      } else {
        this.message.set("No lines cleared.");
      }

      this.currentRound.set(newRound); // Set the final round
      this.currentPiece.set(newRound.piece);
      this.message.set("Piece placed successfully!");
      this.animating.set(false);
    }
  }

  passRound() {
    if (this.passAllowed.get() && !this.animating.get()) {
      playSound('piecePassed');
      let currentRound = this.currentRound.get();
      let newRound = currentRound.pass();
      this.currentRound.set(newRound);
      this.selectedPosition.set(null);
      this.currentPiece.set(newRound.piece);
      this._applyBoard(newRound.board);
    }
  }

  onBoardPointerDown(e: PointerEvent, position: IPosition) {
    if (!this.boardClickAllowed.get() || this.animating.get()) {
      e.preventDefault()
      e.stopPropagation
      return;
    }
    const piece = this.currentPiece.get();
    if (!piece) return;
    this.draggingPiecePosPx.set({ ftx: e.clientX, fty: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this.selectedPosition.set(position);
  }

  private async delay(ms: number = 3000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
