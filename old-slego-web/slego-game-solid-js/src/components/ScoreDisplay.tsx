import { AnimatedNumber } from './AnimatedNumber'; // Import the new component

interface ScoreDisplayProps {
  totalScore: number;
  currentRound: number;
  lastScore: number;
}

export function ScoreDisplay(props: ScoreDisplayProps) {
  return (
    <div class="score-display">
      <div class="score-value-container">
        SCORE: <AnimatedNumber targetValue={props.totalScore} />
      </div>

      <div class="round-container">
        Round: <span class="round-value">{props.currentRound}</span>/40
      </div>

      <div class="last-score-container">
        Last: {props.lastScore !== 0 ? (
          <span class={`last-score-value ${props.lastScore > 0 ? 'success' : 'error'}`}>
            <AnimatedNumber targetValue={props.lastScore} />
          </span>
        ) : (
          <span class="last-score-value">-</span>
        )}
      </div>
    </div>
  );
};
