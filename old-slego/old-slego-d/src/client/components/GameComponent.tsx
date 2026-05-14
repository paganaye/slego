import { Accessor, createMemo, Match, onMount, onCleanup, Show, Switch } from "solid-js";
import { Board, Piece, IPosition, Round, Game } from "@shared/slego";
import { Signal } from "../Signal";
import { BoardComponent, BoardTile } from "../components/BoardComponent";
import { Button } from "./Button";
import { PieceComponent } from "./PieceComponent";
import { addStyle } from "../Styles";
import { SlegoApp, useSlegoApp } from "./SlegoApp";
import { ResultPanel } from "./ResultPanel";
import { playSound } from "../sound";
import { TILE_SIZE } from "../consts";
import { delay } from "../utils";

export interface GameComponentProps {
  app: SlegoApp
  game: Game;
  onGameEnd?: (score: number, rounds: number) => void;
  onLaunchNextTutorial?: () => void;
  onPlayAgain?: () => void;
}

addStyle(".GameComponent", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
});

addStyle("@media (min-width: 1200px) { .GameComponent .game-left-column }", { transform: "scale(1.2)" });

addStyle(".GameComponent .game-content-column", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

addStyle(".GameComponent .game-content", {
  display: "flex",
  gap: "30px",
  padding: "20px",
  justifyContent: "center",
  position: "relative"
});

addStyle(".GameComponent .board-container", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  position: "relative"
});

addStyle(".GameComponent .game-sidebar", {
  display: "flex",
  flexDirection: "column",
  maxWidth: "300px",
  gap: "15px"
});

addStyle(".GameComponent .current-piece", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px"
});

addStyle(".GameComponent .current-piece h3", {
  margin: "0",
  fontSize: "1.1rem",
  textAlign: "center"
});

addStyle(".GameComponent .game-info", {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "15px",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "8px"
});

addStyle(".GameComponent .game-info div", {
  fontSize: "1.1rem",
  fontWeight: "bold"
});

addStyle(".GameComponent .row", {
  display: "flex",
  gap: "15px",
  padding: "15px 20px",
  borderTop: "1px solid rgb(var(--color), 0.1)"
});

addStyle(".GameComponent .row .btn", {
  flex: "1",
  minHeight: "50px"
});


addStyle(".GameComponent .floating-piece", {
  position: 'absolute',
  width: TILE_SIZE * 3 + "px",
  height: TILE_SIZE * 3 + "px",

  transition: "opacity 0.2s ease-in-out",
  pointerEvents: "none"
});

addStyle(".GameComponent .floating-piece .tile", {
  pointerEvents: "auto"
});

addStyle(".GameComponent .piece-preview", {
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  minHeight: "80px",
  padding: "12px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: TILE_SIZE * 3 + "px",
  height: TILE_SIZE * 3 + "px"
});

addStyle(".current-task", {
  'padding': '10px'
});

addStyle("div.board-text", {
  position: 'absolute',
  'background-color': 'transparent',
  'font-size': '3em',
  'font-weight': 'bold',
  'color': 'var(--text-color)',
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

export type UIStatus = 'ready' | 'animating' | { status: 'dragging', ftx: number, fty: number };

export class GameComponent {
  readonly selectedPosition = new Signal<IPosition | null>(null, (a, b) => (a != null && b != null && a.tx === b.tx && a.ty === b.ty) || a === b);
  readonly previousRound: Signal<Round>
  readonly score: Accessor<number>;
  readonly nextPiece = new Signal<Piece | null>(null);
  readonly roundNo: Accessor<number>;
  readonly message = new Signal<string>("");
  protected uiStatus = new Signal<UIStatus>('ready');
  readonly rounds: number;
  gameContentElement: HTMLDivElement | undefined;
  boardContainerRef: HTMLDivElement | undefined;
  piecePreviewRef: HTMLDivElement | undefined;
  readonly boardContainerRect = new Signal<DOMRect | null>(null);
  readonly piecePreviewRect = new Signal<DOMRect | null>(null);
  tiles: BoardTile[][];
  rootElement: HTMLDivElement | undefined;
  readonly app: SlegoApp;

  protected boardText = new Signal('');
  _piecePointerDown: boolean = false;

  private readonly pointerMoveHandler: (e: PointerEvent) => void;
  private readonly pointerUpHandler: (e: PointerEvent) => void;

  readonly isFinished = new Signal<boolean>(false);

  protected boardClickAllowed() {
    return this.uiStatus.get() === 'ready';
  }

  protected passAllowed() {
    return this.selectedPosition.get() === null && this.uiStatus.get() === 'ready';
  }

  protected playAllowed() {
    return this.selectedPosition.get() !== null && this.uiStatus.get() === 'ready';
  }

  protected pieceDragAllowed() {
    return this.uiStatus.get() === 'ready';
  }

  protected isPieceVisible() {
    return this.uiStatus.get() === 'ready' || typeof this.uiStatus.get() === 'object';
  }

  protected isBottomBarVisible() {
    return true;
  }

  setSelectedPosition(position: IPosition | null): boolean {
    this.selectedPosition.set(position);
    const currentPiece = this.nextPiece.get();

    if (position !== null && currentPiece !== null) {
      const previousRound = this.previousRound.get();
      const intermediaryRound = previousRound.withPiecePlaced(currentPiece, position);
      const potentialScore = intermediaryRound.roundScore;
      if (potentialScore != 0) {
        this.message.set(potentialScore != 0 ? `${potentialScore > 0 ? '+' : ''} ${potentialScore} points` : '');
      }
    } else {
      this.message.set("");
    }
    return true;
  }

  constructor(readonly props: GameComponentProps) {
    this.app = props.app;
    this.pointerMoveHandler = this._onPiecePointerMove.bind(this);
    this.pointerUpHandler = this._onPiecePointerUp.bind(this);
    this.rounds = props.game.pieces.length;
    let roundZero: Round = Round.roundZero(this.props.game);
    this.previousRound = new Signal(roundZero)

    this.score = createMemo(() => this.previousRound.get().total);
    this.roundNo = createMemo(() => this.previousRound.get().roundNo);
    let currentBoard = this.previousRound.get().board;
    this.tiles = Array(5).fill(null).map((_, y) => Array(5).fill(null).map((_, x) => new BoardTile(x, y, currentBoard.getColorAt(x, y))));
    this.endRound(roundZero);

    onMount(() => {
      playSound('newRound');

      const boundUpdateRects = () => this.updateRects();

      window.addEventListener('resize', boundUpdateRects);

      const resizeObserver = new ResizeObserver(boundUpdateRects);
      if (this.rootElement) {
        resizeObserver.observe(this.rootElement);
      }

      boundUpdateRects();

      onCleanup(() => {
        window.removeEventListener('resize', boundUpdateRects);
        resizeObserver.disconnect();
      });
    });
  }

  updateRects() {
    this.boardContainerRect.set(this.boardContainerRef?.getBoundingClientRect() ?? null);
    this.piecePreviewRect.set(this.piecePreviewRef?.getBoundingClientRect() ?? null);
  }

  endRound(newRound: Round) {
    this.previousRound.set(newRound);
    if (newRound.roundNo >= this.rounds) {
      this.isFinished.set(true);
      this.props.onGameEnd?.(this.score(), this.roundNo());
    } else {
      this.setNextPiece();
    }
  }

  setNextPiece() {
    let nextPiece = this.previousRound.get().nextPiece();
    this.nextPiece.set(nextPiece);
    this.dockPiece()
    this.uiStatus.set('ready');

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
    if (!this.pieceDragAllowed()) {
      e.preventDefault()
      e.stopPropagation
      return;
    }
    const piece = this.nextPiece.get();
    if (!piece) return;
    if (this.onStartDraggingPiece()) {
      this.uiStatus.set({ status: 'dragging', ftx: e.clientX, fty: e.clientY });
      this.captureMouseMove(e);
      this._onPiecePointerMove(e);
    }
  }

  captureMouseMove(e: PointerEvent) {
    let domElt = e.target as HTMLElement;
    domElt.addEventListener('pointermove', this.pointerMoveHandler);
    domElt.addEventListener('pointerup', this.pointerUpHandler);
    try {
      domElt.setPointerCapture(e.pointerId);
    } catch { }
    this._piecePointerDown = true;
  }

  _onPiecePointerMove(e: PointerEvent) {
    if (!this._piecePointerDown || e.buttons == 0) {
      this._onPiecePointerUp(e);
      return;
    }
    e.preventDefault();
    let tx = 0;
    let ty = 0;

    const boardRect = this.boardContainerRect.get();
    if (boardRect) {
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
          if (this.setSelectedPosition({ tx, ty })) return
        }
      }
    }

    this.selectedPosition.set(null);
    this.uiStatus.set({ status: 'dragging', ftx: e.clientX, fty: e.clientY });
  }

  _onPiecePointerUp(e: PointerEvent) {
    if (this._piecePointerDown) {
      this._piecePointerDown = false;
      e.preventDefault();
      const domElt = (e.currentTarget as HTMLElement);
      domElt.removeEventListener('pointermove', this.pointerMoveHandler);
      domElt.removeEventListener('pointerup', this.pointerUpHandler);
      domElt.releasePointerCapture(e.pointerId);
      this.uiStatus.set('ready');
    }
  }

  async _onPointerDblClick(_e: MouseEvent) {
    await this.playPiece();
  }


  async _onOutOfBoardPointerDown(e: PointerEvent): Promise<boolean> {
    if (e.target != this.gameContentElement) return false;
    let pos = this.selectedPosition.get();
    if (pos) {
      return await this.playPiece();
    }
    else return false;
  }

  _floatingPiecePos = createMemo(() => {
    let selectedPos = this.selectedPosition.get();
    if (selectedPos) {
      const rect = this.boardContainerRect.get();
      if (rect) {
        return {
          left: `${(selectedPos.tx - 1) * TILE_SIZE + rect.left}px`,
          top: `${(selectedPos.ty - 1) * TILE_SIZE + rect.top}px`
        };
      }
    } else {
      let pos = this.uiStatus.get();
      if (typeof pos === 'object' && pos.status === 'dragging') {
        return {
          left: `${pos.ftx - 1.5 * TILE_SIZE}px`,
          top: `${pos.fty - 1.5 * TILE_SIZE}px`,
          opacity: "0.75"
        }
      } else {
        const rect = this.piecePreviewRect.get();
        if (rect) {
          return {
            left: `${rect.left + 0 * TILE_SIZE}px`,
            top: `${rect.top + 0 * TILE_SIZE}px`
          };
        }
      }
    }
  });

  highlightPiece() {
    return false;
  }

  highlightedPosition(): IPosition | null {
    return null;
  }


  async playPiece(): Promise<boolean> {
    if (this.playAllowed()) {
      this.uiStatus.set('animating');
      let newRound;
      try {
        let previousRound = this.previousRound.get();
        let currentPiece = this.nextPiece.get()!;
        let selectedPos = this.selectedPosition.get()!;
        this.setSelectedPosition(null);
        newRound = previousRound.withPiecePlaced(currentPiece, selectedPos);
        playSound('piecePlaced');

        this._applyBoard(newRound.intermediaryBoard);

        // Display message: Piece placed, checking for lines
        this.nextPiece.set(null);

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
                await delay(50);
              }
              await delay(200);
            }
          }
          let scoreText = `+${newRound.baseScore}`;
          if (newRound.segments.length > 1) {
            scoreText += `\nx${newRound.segments.length}`;
          }
          this.boardText.set(scoreText);

          await delay(500);
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
              await delay(50);
            }
            await delay(200);
          }


          // Play scoreCling multiple times with delay
          const clingCount = Math.floor(newRound.baseScore / 10);
          for (let i = 0; i < clingCount; i++) {
            playSound('scoreCling');
            await delay(150); // Small delay between each cling sound
          }
          await delay(1000); // Display score for 1 second
          this.boardText.set('');
        }
        this.onPiecePlayed()
      } finally {
        if (newRound) this.endRound(newRound);
      }
      return true;
    }
    return false
  }

  onPiecePlayed() {

  }

  passRound() {
    if (!this.passAllowed()) return;

    playSound('piecePassed');
    let previousRound = this.previousRound.get();
    let newRound = previousRound.pass();
    this.setSelectedPosition(null);
    this._applyBoard(newRound.board);
    this.endRound(newRound);
  }

  onBoardPointerDown(e: PointerEvent, position: IPosition) {
    if (!this.boardClickAllowed()) {
      e.preventDefault()
      e.stopPropagation
      return;
    }
    const piece = this.nextPiece.get();
    if (!piece) return;
    if (this.setSelectedPosition(position)) {
      this._piecePointerDown = true;
      this.uiStatus.set({ status: 'dragging', ftx: e.clientX, fty: e.clientY });
      this.captureMouseMove(e);
    }
  }

  onStartDraggingPiece() {
    // TO KEEP: this is overriden by the tutorial
    return true;
  }

  dockPiece() {
    this.selectedPosition.set(null);
    this.uiStatus.set('ready');
  }

  renderFloatingPiece() {
    return <Show when={this.isPieceVisible()}>
      <div class="floating-piece" style={this._floatingPiecePos()}>
        <PieceComponent piece={this.nextPiece.get()!}
          highlighted={this.highlightPiece()}
          notAllowed={!this.pieceDragAllowed()}
          onPointerDown={(e) => this._onPiecePointerDown(e)}
          onPointerDblClick={(e) => this._onPointerDblClick(e)}
        />
      </div>
    </Show>

  }


  renderGameContent() {
    const app = useSlegoApp();

    return <div class="game-content-column">
      {this.renderTopBar()}
      <div class="game-content" onPointerDown={(e) => this._onOutOfBoardPointerDown(e)} ref={this.gameContentElement!}>
        <div class="game-left-column"
          classList={{ tutorialTarget: app.tutorialTarget.get() === "game-left-column" }}
          ref={this.boardContainerRef}>{this.renderBoard()}
        </div>
        <div class="game-sidebar">
          {this.renderSideBar()}
        </div>
      </div>
      <Show when={this.message.get()}>
        <div class="game-message">{this.message.get()}</div>
      </Show>
    </div>
  }

  renderTopBar() {
    return <></>
  }

  renderBoard() {
    return <>
      <BoardComponent
        tiles={this.tiles}
        notAllowed={!this.boardClickAllowed()}
        onBoardPointerDown={(e, pos) => this.onBoardPointerDown(e, pos)}
      />
      <div class="board-text" classList={{ "board-text-visible": !!this.boardText.get() }}>
        {this.boardText.get()}
      </div>
    </>
  }

  renderSideBar() {
    const app = useSlegoApp();
    {/* Piece preview */ }
    return <>
      <div class="current-piece">
        <h3>Piece {Math.min(this.roundNo() + 1, this.rounds)}/{this.rounds}</h3>
        <div
          classList={{ tutorialTarget: app.tutorialTarget.get() === "piece-preview" }}
          class="piece-preview" ref={this.piecePreviewRef} onclick={() => this.setSelectedPosition(null)} />
      </div>
      <div class="game-info">
        <div>Score: {this.score()}</div>
      </div>
    </>
  }

  renderBottomBar() {
    return <div class="row">
      <Switch>
        <Match when={this.isBottomBarVisible()}>
          {this.renderPlayButton()}
          {this.renderPassButton()}
        </Match>
      </Switch>
    </div>
  }

  renderGameFinished() {
    return <ResultPanel onBackToMenu={() => this.app.navigateTo('menu')}
      onPlayAgain={() => this.props.onPlayAgain?.()}
      game={this}
      score={this.score()}
      rounds={this.rounds} />
  }

  renderPlayButton() {
    return <Button tutorialId="play-btn" class="red"
      disabled={this.playAllowed() == false}
      onclick={() => this.playPiece()}>
      {this.selectedPosition.get() == null || typeof this.uiStatus.get() === 'object' ? `Select piece ${this.roundNo() + 1} position` : `Play Piece ${this.roundNo() + 1}`}
    </Button>
  }

  renderPassButton() {
    return <Button tutorialId="pass-btn" onclick={() => this.passRound()}
      disabled={this.passAllowed() == false}>
      Pass
    </Button>
  }


  render() {
    return (
      <div class="GameComponent" ref={this.rootElement!}>
        <Show when={!this.isFinished.get()} fallback={this.renderGameFinished()}>
          <div class="game-content-column">
            {this.renderTopBar()}
            <div class="game-content" onPointerDown={(e) => this._onOutOfBoardPointerDown(e)} ref={this.gameContentElement!}>
              <div class="game-left-column"
                classList={{ tutorialTarget: this.app.tutorialTarget.get() === "game-left-column" }}
                ref={this.boardContainerRef}>{this.renderBoard()}
              </div>
              <div class="game-sidebar">
                {this.renderSideBar()}
              </div>
            </div>
            <Show when={this.message.get()}>
              <div class="game-message">{this.message.get()}</div>
            </Show>
          </div>
          {this.renderBottomBar()}
          {this.renderFloatingPiece()}
        </Show>
      </div >
    );
  }

}