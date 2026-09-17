import { useCallback, useEffect, useRef } from 'react';

/**
 * Управляемая очередь отложенных шагов.
 *
 * Вместо цепочки setTimeout внутри компонентов сценарий описывается как
 * список шагов; хук гарантирует, что при размонтировании или перезапуске
 * ни один «хвост» не выполнится и не оживит уже сброшенное состояние.
 *
 * При reduced motion все задержки схлопываются в 0 — шаги выполняются
 * синхронно в рамках одного микротаска, без искусственного ожидания.
 */
export interface SequenceStep {
  /** Задержка ПЕРЕД выполнением шага, мс. */
  delay: number;
  run: () => void;
}

export function useSequence(reducedMotion: boolean) {
  const timers = useRef<number[]>([]);
  const cancelled = useRef(false);

  const clear = useCallback(() => {
    cancelled.current = true;
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const run = useCallback(
    (steps: SequenceStep[], onDone?: () => void) => {
      clear();
      cancelled.current = false;

      if (reducedMotion) {
        // Никаких искусственных задержек: весь текст выдаётся сразу.
        steps.forEach((step) => step.run());
        onDone?.();
        return;
      }

      let elapsed = 0;
      steps.forEach((step) => {
        elapsed += step.delay;
        const id = window.setTimeout(() => {
          if (cancelled.current) return;
          step.run();
        }, elapsed);
        timers.current.push(id);
      });

      if (onDone) {
        const id = window.setTimeout(() => {
          if (cancelled.current) return;
          onDone();
        }, elapsed);
        timers.current.push(id);
      }
    },
    [clear, reducedMotion],
  );

  useEffect(() => clear, [clear]);

  return { run, clear };
}
