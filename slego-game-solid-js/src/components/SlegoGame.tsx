import { createSignal, onMount } from 'solid-js';
import { SlegoBoard, CellPlacement } from './SlegoBoard';
import { SlegoPieceComponent } from './SlegoPiece';
import { ScoreDisplay } from './ScoreDisplay';
import { ScoringPopup } from './ScoringPopup';
import { SimpleScorePopup } from './SimpleScorePopup';
import { ScorePreview } from './ScorePreview';
import { generateSlegoGame } from '../SlegoPiece';
import { RoundScore, SlegoTile } from '../Types';
import { GameScale } from '../GameScale';
import { Board } from '../Board';

export function SlegoGame() {
  const [board, setBoard] = createSignal(new Board());
  const [currentRound, setCurrentRound] = createSignal(0);
  const [currentPiece, setCurrentPiece] = createSignal<SlegoTile[] | null>(null);
  const [scores, setScores] = createSignal<number[]>([]);
  const [totalScore, setTotalScore] = createSignal(0);
  const [pieces] = createSignal(generateSlegoGame());
  const [simplePopup, setSimplePopup] = createSignal<{ show: boolean, text: string, color: string }>({ show: false, text: '', color: '' });
  const [linesToClear, setLinesToClear] = createSignal<RoundScore | null>(null);
  const [isDragging, setIsDragging] = createSignal(false);
  const [piecePosition, setPiecePosition] = createSignal({ x: 0, y: 0 });
  const [animatingLines, setAnimatingLines] = createSignal<number[]>([]);
  const [scoringAnimation, setScoringAnimation] = createSignal<{
    show: boolean;
    roundScore: RoundScore | null;
    currentStep: number;
    animatedTotal: number;
  }>({ show: false, roundScore: null, currentStep: 0, animatedTotal: 0 });
  const [previewScore, setPreviewScore] = createSignal<RoundScore | null>(null);
  const dragOffset = { x: 75, y: 75 };

  let stageRef: HTMLDivElement;
  let currentScore: RoundScore | null = null
  let slegoBoard: HTMLDivElement;

  function worldToCell(x: number, y: number): CellPlacement | null {
    const rect = slegoBoard!.getBoundingClientRect();
    const boardW = GameScale.BOARD_SIZE_PX * GameScale.scale;
    const boardH = GameScale.BOARD_SIZE_PX * GameScale.scale;
    const left = rect.left + (rect.width - boardW) / 2;
    const top = rect.top + (rect.height - boardH) / 2;

    const relX = x - left;
    const relY = y - top;
    const TileSizePx = GameScale.TILE_SIZE_PX * GameScale.scale;

    const tileX = Math.round((relX - TileSizePx / 2) / TileSizePx);
    const tileY = Math.round((relY - TileSizePx / 2) / TileSizePx);

    if (tileX < 0 || tileX >= 5 || tileY < 0 || tileY >= 5) return null;
    return { tileX: tileX, tileY: tileY, left, top };
  };

  function nextRound() {
    if (currentRound() >= 40) {
      endGame();
      return;
    }

    const newRound = currentRound() + 1;
    setCurrentRound(newRound);
    const newPiece = pieces()[newRound - 1];
    setCurrentPiece(newPiece);
  }

  function passRound() {
    if (!currentPiece()) return;

    // Score 0 for passed round
    const newScores = [...scores()];
    newScores[currentRound() - 1] = 0;
    setScores(newScores);

    showRoundResult(0, true);
    setCurrentPiece(null);

    setTimeout(() => nextRound(), 1000);
  }


  function handlePiecePlacement(col: number, row: number) {
    if (!currentPiece()) return false;

    // Place the piece
    const { overwriteCount, newBoard } = board().placeSlegoPiece(currentPiece()!, col, row);
    setBoard(newBoard);

    // Calculate score
    const roundScore = newBoard.calculateRoundScore(currentScore, overwriteCount);

    setCurrentPiece(null);
    setPreviewScore(null);

    // Start the scoring animation sequence
    startScoringAnimation(roundScore);

    currentScore = roundScore;
    return true;
  }

  let stageRect!: DOMRect;

  function handlePiecePointerDown(e: PointerEvent) {
    if (!currentPiece() || !stageRef!) return;

    setIsDragging(true);
    stageRect = stageRef.getBoundingClientRect();
    handlePiecePointerMove(e);
    document.addEventListener('pointermove', handlePiecePointerMove);
    document.addEventListener('pointerup', handlePiecePointerUp);
  };

  function handlePiecePointerMove(e: PointerEvent) {
    if (!isDragging() || !stageRect) return;
    if (e.buttons == 0) {
      handlePiecePointerUp(e);
    } else {
      e.preventDefault();
      // Scale mouse coordinates to match the scaled game
      const scaledX = (e.clientX - stageRect.left) / GameScale.scale;
      const scaledY = (e.clientY - stageRect.top) / GameScale.scale;
      setPiecePosition({ x: scaledX - dragOffset.x, y: scaledY - dragOffset.y });

      // Update preview score using scaled coordinates
      const cell = worldToCell(e.clientX, e.clientY);
      if (cell && currentPiece()) {
        const result = board().previewPiecePlacement(currentPiece()!,
          cell.tileX, cell.tileY);
        if (result && result.newBoard) {
          const { overwriteCount, newBoard } = result;
          const previewRoundScore = newBoard.calculateRoundScore(currentScore, overwriteCount);
          setPreviewScore(previewRoundScore);
        } else {
          setPreviewScore(null);
        }
      } else {
        setPreviewScore(null);
      }
    }
  };

  function handlePiecePointerUp(e: PointerEvent) {
    if (!isDragging()) return;

    setIsDragging(false);
    setPreviewScore(null);
    document.removeEventListener('pointermove', handlePiecePointerMove);
    document.removeEventListener('pointerup', handlePiecePointerUp);

    const cell = worldToCell(e.clientX, e.clientY);
    if (cell) {
      handlePiecePlacement(cell.tileX, cell.tileY);
    }
  };

  function startScoringAnimation(roundScore: RoundScore) {
    // Step 1: Animate lines one by one
    if (roundScore.lines.length > 0) {
      animateLinesSequentially(roundScore.lines, () => {
        // Step 2: Show detailed scoring popup
        setScoringAnimation({
          show: true,
          roundScore,
          currentStep: 0,
          animatedTotal: roundScore.gameTotal
        });

        // Step 3: Animate through scoring steps
        animateScoringSteps(roundScore, () => {
          // Step 4: Clear lines and continue
          finishScoringAnimation(roundScore);
        });
      });
    } else {
      // No lines, just show simple score
      showSimpleScore(roundScore);
    }
  }

  function finishScoringAnimation(roundScore: RoundScore) {
    const finalBoard = board().clearLines(roundScore.lines);
    setBoard(finalBoard);
    setLinesToClear(null);
    setAnimatingLines([]);
    setScoringAnimation({ show: false, roundScore: null, currentStep: 0, animatedTotal: 0 });

    // Update final scores
    const newScores = [...scores()];
    newScores[currentRound() - 1] = roundScore.gameTotal;
    setScores(newScores);
    setTotalScore(roundScore.gameTotal);

    setTimeout(() => nextRound(), 500);
  }

  function animateLinesSequentially(lines: any[], onComplete: () => void) {
    let currentLineIndex = 0;

    function animateNextLine() {
      if (currentLineIndex >= lines.length) {
        setAnimatingLines([]);
        onComplete();
        return;
      }

      setAnimatingLines([currentLineIndex]);
      setTimeout(() => {
        currentLineIndex++;
        animateNextLine();
      }, 400);
    }

    setLinesToClear({ lines } as RoundScore);
    animateNextLine();
  }

  function animateScoringSteps(_roundScore: RoundScore, onComplete: () => void) {
    let step = 0;
    const maxSteps = 4; // base, multiplier, penalty, total

    function nextStep() {
      setScoringAnimation(prev => ({ ...prev, currentStep: step }));



      step++;

      if (step >= maxSteps) {
        // Wait a bit more after the last step, then complete
        setTimeout(onComplete, 1200);
        return;
      }

      setTimeout(nextStep, 600);
    }

    nextStep();
  }



  function showSimpleScore(roundScore: RoundScore) {
    // Show popup for any theoretical score except 0 (to show what the player "tried" to do)
    if (roundScore.theoreticalRoundScore !== 0) {
      const text = roundScore.theoreticalRoundScore >= 0 ? `+${roundScore.theoreticalRoundScore}` : `${roundScore.theoreticalRoundScore}`;
      const color = roundScore.theoreticalRoundScore >= 0 ? '#4a4' : '#a44';

      setSimplePopup({ show: true, text, color });
      setTimeout(() => {
        setSimplePopup({ show: false, text: '', color: '' });
      }, 1500);
    }

    // Update scores immediately for simple case
    const newScores = [...scores()];
    newScores[currentRound() - 1] = roundScore.gameTotal;
    setScores(newScores);
    setTotalScore(roundScore.gameTotal);

    setTimeout(() => nextRound(), roundScore.theoreticalRoundScore !== 0 ? 1500 : 500);
  }

  function showRoundResult(score: number, passed: boolean) {
    const text = passed ? 'PASSED' : (score >= 0 ? `+${score}` : `${score}`);
    const color = passed ? '#666' : (score >= 0 ? '#4a4' : '#a44');

    setSimplePopup({ show: true, text, color });
    setTimeout(() => {
      setSimplePopup({ show: false, text: '', color: '' });
    }, 1500);
  };

  function endGame() {
    const finalMessage = `
      Game Over!
      Final Score: ${totalScore()}
      
      ${totalScore() < 300 ? 'Keep practicing!' :
        totalScore() < 700 ? 'Good game!' : 'Excellent score!'}
    `;
    alert(finalMessage);
  };

  // Keyboard controls
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === ' ') {
      e.preventDefault();
      passRound();
    }
  };

  onMount(() => {
    // Initialize game scaling

    window.addEventListener('keydown', handleKeyDown);
    nextRound();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div class="stage theme-background theme-shadow" ref={stageRef!} style={`scale: ${GameScale.scale}`}>
      <section class="zone tray" aria-label="Pieces not played">
        <ScoreDisplay
          totalScore={totalScore()}
          currentRound={currentRound()}
          lastScore={(() => {
            const scoresArray = scores();
            console.log('LastScore calculation:', { scoresArray, totalScore: totalScore() });
            if (scoresArray.length === 0) return 0;
            if (scoresArray.length === 1) {
              console.log('First round, lastScore:', scoresArray[0]);
              return scoresArray[0];
            }
            const lastScore = scoresArray[scoresArray.length - 1] - scoresArray[scoresArray.length - 2];
            console.log('LastScore calculated:', lastScore, '=', scoresArray[scoresArray.length - 1], '-', scoresArray[scoresArray.length - 2]);
            return lastScore;
          })()}
        />
        <div class="controls">
          <button onClick={passRound}>Pass Round</button>
        </div>
      </section>

      <section class="zone current" aria-label="Piece to play">
        {currentPiece() && (
          <SlegoPieceComponent
            tiles={currentPiece()!}
            isDragging={isDragging()}
            position={piecePosition()}
            onPointerDown={handlePiecePointerDown}
          />
        )}
      </section>

      <section class="zone board" aria-label="Board">
        <SlegoBoard
          forwardRef={el => {
            slegoBoard = el;
          }}
          board={board}
          linesToClear={linesToClear()}
          animatingLines={animatingLines()}
        />
      </section>

      <section class="zone overlay" aria-label="Overlay">
        {/* Simple score popup for passed rounds or no lines */}
        <SimpleScorePopup
          show={simplePopup().show}
          text={simplePopup().text}
          color={simplePopup().color}
        />

        {/* Detailed scoring popup */}
        {scoringAnimation().show && scoringAnimation().roundScore && (
          <ScoringPopup
            roundScore={scoringAnimation().roundScore}
            currentStep={scoringAnimation().currentStep}
            animatedTotal={scoringAnimation().animatedTotal}
          />
        )}

        {/* Score preview during drag */}
        {isDragging() && previewScore() && (
          <ScorePreview
            previewScore={previewScore()}
            position={piecePosition()}
          />
        )}
      </section>
    </div>
  );
};
