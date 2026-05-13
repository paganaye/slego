import { Show } from 'solid-js';
import { RoundScore } from '../Types';

interface ScorePreviewProps {
  previewScore: RoundScore | null;
  position: { x: number; y: number };
}

export function ScorePreview(props: ScorePreviewProps) {
  if (!props.previewScore) return null;

  const getScoreColorClass = (score: number) => {
    if (score <= 0) return 'score-negative';
    if (score < 20) return 'score-low';
    if (score < 50) return 'score-medium';
    return 'score-high';
  };

  return (
    <Show when={props.previewScore.lines.length}>
      <div
        class={`score-preview ${getScoreColorClass(props.previewScore.roundScore)}`}
        style={{
          left: `${props.position.x + 20}px`,
          top: `${props.position.y - 10}px`,
        }}
      >
        <div>
          <div>🎯 {props.previewScore.lines.length} line{props.previewScore.lines.length > 1 ? 's' : ''}</div>
          <div>⭐ +{props.previewScore.roundScore} pts</div>
        </div>
      </div>
    </Show>
  );
}
