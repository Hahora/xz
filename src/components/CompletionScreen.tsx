import { completion } from '../content/siteContent';
import { ActionButton, Barcode, TechnicalLabel } from '../primitives/Primitives';
import styles from './CompletionScreen.module.css';

export function CompletionScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <section className={styles.screen} aria-labelledby="completion-title">
      <div className={styles.head}>
        <TechnicalLabel tone="bright">{completion.headline}</TechnicalLabel>
        <span className={styles.rule} aria-hidden="true" />
      </div>

      <div className={styles.hero}>
        <p className={styles.bigNumber} aria-hidden="true">
          {completion.bigNumber}
        </p>
        <h2 id="completion-title" className={styles.series}>
          {completion.series}
        </h2>
      </div>

      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt className={styles.rowLabel}>{completion.nextLabel}</dt>
          <dd className={`${styles.rowValue} mono`}>{completion.nextValue}</dd>
        </div>
        {completion.rows.map((r) => (
          <div key={r.label} className={styles.row}>
            <dt className={styles.rowLabel}>{r.label}</dt>
            <dd className={`${styles.rowValue} mono`}>{r.value}</dd>
          </div>
        ))}
      </dl>

      <p className={styles.greeting}>{completion.greeting}</p>

      <footer className={styles.footer}>
        <div className={styles.footerRight}>
          <Barcode seed={1991} bars={28} />
          <ActionButton variant="ghost" onClick={onRestart}>
            {completion.restart}
          </ActionButton>
        </div>
      </footer>
    </section>
  );
}
