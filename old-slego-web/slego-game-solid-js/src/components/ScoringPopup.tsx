import { RoundScore } from '../Types';
import { AnimatedNumber } from './AnimatedNumber';

interface ScoringPopupProps {
  roundScore: RoundScore | null;
  currentStep: number;
  animatedTotal: number;
}

export function ScoringPopup(props: ScoringPopupProps) {
  // Safety check - don't render if roundScore is null
  if (!props.roundScore) return null;
  const getStepClass = (step: number) => {
    return props.currentStep >= step ? 'step-active' : 'step-inactive';
  };

  const getScoreColorClass = (score: number) => {
    if (score <= 0) return 'score-negative';
    if (score < 20) return 'score-low';
    if (score < 50) return 'score-medium';
    return 'score-high';
  };

  return (
    <div
      class={`scoring-popup ${getScoreColorClass(props.roundScore.roundScore)}`}
    >
      <div class="popup-title">
        🎯 SCORE
      </div>

      <div class="score-steps">
        {/* Lines completed */}
        <div class={`score-line ${getStepClass(0)}`}>
          <span>🎯 Lines completed: {props.roundScore.lines.length}</span>
        </div>

        {/* Base points */}
        <div class={`score-line ${getStepClass(1)}`}>
          <span>⭐ Base points: {props.roundScore.basePoints}</span>
        </div>

        {/* Multiplier */}
        {props.roundScore.lineCount > 1 && (
          <div class={`score-line ${getStepClass(2)}`}>
            <span>✨ Multiplier: x{props.roundScore.lineCount}</span>
          </div>
        )}

        {/* Overwrite cost */}
        {props.roundScore?.overwritePenalty > 0 && (
          <div class={`score-line ${getStepClass(2)}`}>
            <span class="overwrite-penalty">🔄 Overwrite: -{props.roundScore?.overwritePenalty}</span>
          </div>
        )}

        {/* Round total */}
        <div class={`score-line total-line ${getStepClass(3)}`}>
          <div class={`round-score ${getScoreColorClass(props.roundScore.roundScore)}`}>
            🏆 Round score: +{props.roundScore.roundScore}
          </div>
        </div>

        {/* Animated total */}
        <div class={`total-score ${getStepClass(3)}`}>
          <div class="total-score-value">
            📊 Total: <AnimatedNumber targetValue={props.animatedTotal} />
          </div>
        </div>
      </div>

      {/* Simple sparkle effect */}
      {props.currentStep >= 3 && (
        <div class="sparkle-effect">
          ✨
        </div>
      )}
    </div>
  );
}
