import { createSignal, createEffect, onCleanup, on } from 'solid-js';

interface AnimatedNumberProps {
  targetValue: number;
}

export function AnimatedNumber(props: AnimatedNumberProps) {
  const [animatedValue, setAnimatedValue] = createSignal(props.targetValue);
  const [isAnimating, setIsAnimating] = createSignal(false);
  let animationTimeout: ReturnType<typeof setTimeout> | undefined;

  createEffect(on(() => props.targetValue, (target, prevTarget) => {
    console.log('AnimatedNumber effect - target changed:', { targetValue: target, prevTarget, currentAnimated: animatedValue() });

    // Clear any existing animation
    if (animationTimeout) {
      clearTimeout(animationTimeout);
    }

    // Only start animation when targetValue actually changes and is different from current animated value
    if (target !== animatedValue()) {
      console.log('Starting animation from', animatedValue(), 'to', target);
      incrementValue();
    }
  }));

  function incrementValue() {
    let currentValue = animatedValue();
    let diff = props.targetValue - currentValue;
    let absDiff = Math.abs(diff);
    console.log('incrementValue:', { currentValue, targetValue: props.targetValue, diff, absDiff });

    if (absDiff < 1) {
      console.log('Animation finished');
      setIsAnimating(false);
      setAnimatedValue(props.targetValue); // Ensure exact final value
      animationTimeout = undefined;
    } else {
      setIsAnimating(true);
      let inc = diff > 0 ? 1 : -1;
      if (absDiff > 1000) {
        inc *= 100
      } else if (absDiff > 100) {
        inc *= 10;
      }
      let newValue = currentValue + inc;
      console.log('Animating to:', newValue);
      setAnimatedValue(newValue);
      animationTimeout = setTimeout(() => incrementValue(), 32);
    }
  }


  onCleanup(() => {
    if (animationTimeout) {
      clearTimeout(animationTimeout);
    }
  });

  return (
    <span class={`score-value ${isAnimating() ? 'animating' : ''}`}>
      {animatedValue().toLocaleString()}
    </span>
  );
}
