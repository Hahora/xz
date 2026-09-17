import { useEffect, useState } from 'react';
import { boot, shell } from '../content/siteContent';
import { useSequence } from '../lib/useSequence';
import { ActionButton } from '../primitives/Primitives';
import styles from './BootSequence.module.css';

const LINE_DELAY = 340;
const SKIP_AVAILABLE_AFTER = 1500;

export function BootSequence({
  authorized,
  onBootComplete,
  onStart,
  reducedMotion,
}: {
  /** true — загрузка завершена, показываем блок авторизации. */
  authorized: boolean;
  onBootComplete: () => void;
  onStart: () => void;
  reducedMotion: boolean;
}) {
  const [visible, setVisible] = useState(0);
  const [canSkip, setCanSkip] = useState(reducedMotion);
  const { run, clear } = useSequence(reducedMotion);

  useEffect(() => {
    const steps = boot.lines.map((_, i) => ({
      delay: i === 0 ? 260 : LINE_DELAY,
      run: () => setVisible(i + 1),
    }));
    run(steps, onBootComplete);

    const skipTimer = window.setTimeout(() => setCanSkip(true), SKIP_AVAILABLE_AFTER);
    return () => {
      clear();
      window.clearTimeout(skipTimer);
    };
    // Запускается один раз на монтирование акта.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    clear();
    setVisible(boot.lines.length);
    onBootComplete();
  };

  const lines = boot.lines.slice(0, visible);

  return (
    <div className={styles.boot}>
      <div className={styles.terminal}>
        <pre className={styles.lines}>
          {lines.map((line, i) => (
            <span
              key={i}
              className={`${styles.line} ${line === '' ? styles.spacer : ''} ${
                line.endsWith('OK') || line.endsWith('ONLINE') ? styles.lineOk : ''
              } ${line.startsWith('NON-STANDARD') ? styles.lineAlert : ''}`}
            >
              {line || ' '}
            </span>
          ))}
          {!authorized && <span className={styles.cursor} aria-hidden="true" />}
        </pre>

        {authorized && (
          <div className={styles.auth}>
            <ActionButton onClick={onStart} autoFocus>
              {boot.primaryAction}
            </ActionButton>
            <div className={styles.microcopy}>
              {boot.microcopy.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        )}

        {!authorized && canSkip && (
          <button type="button" className={styles.skip} onClick={skip}>
            {boot.skipAction}
          </button>
        )}
      </div>

      <span className={styles.cornerNote} aria-hidden="true">
        {shell.brandName} / REMOTE NODE 07
      </span>
    </div>
  );
}
