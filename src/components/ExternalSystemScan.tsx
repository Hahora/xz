import { diagnosis, externalScan } from '../content/siteContent';
import type { RowState } from '../state/types';
import { ActionButton, PanelFrame, StatusChip, TechnicalLabel } from '../primitives/Primitives';
import styles from './ExternalSystemScan.module.css';

function HostCheckRow({
  label,
  result,
  state,
  revealFault,
}: {
  label: string;
  result: 'OK' | 'ONLINE' | 'FAULT';
  state: RowState;
  /** До обнаружения ошибки проблемные строки держатся в CHECKING. */
  revealFault: boolean;
}) {
  const isFault = result === 'FAULT';
  const done = state === 'done';

  let display: string;
  let tone: 'ok' | 'neutral' | 'danger' = 'neutral';

  if (!done) {
    display = state === 'checking' ? 'CHECKING' : 'QUEUED';
  } else if (isFault && !revealFault) {
    display = 'CHECKING';
  } else if (isFault) {
    display = 'FAULT';
    tone = 'danger';
  } else {
    display = result;
    tone = 'ok';
  }

  const pulse = state === 'checking' || (done && isFault && !revealFault);

  return (
    <li className={`${styles.checkRow} ${done ? styles.checkRowDone : ''}`}>
      <span className={styles.checkLabel}>{label}</span>
      <span className={styles.checkDots} aria-hidden="true" />
      <StatusChip label={display} tone={tone} pulse={pulse} />
    </li>
  );
}

export function ExternalSystemScan({
  checkStates,
  revealFault,
  errorActive,
}: {
  checkStates: RowState[];
  revealFault: boolean;
  errorActive: boolean;
}) {
  return (
    <PanelFrame
      title="EXTERNAL SYSTEM / COMPATIBILITY"
      danger={errorActive}
      meta={<span className="mono">HOST: ELECTROLITE.RU</span>}
    >
      <dl className={styles.detect}>
        {externalScan.detection.map((d) =>
          d.value ? (
            <div key={d.label} className={styles.detectRow}>
              <dt className={styles.detectLabel}>{d.label}</dt>
              <dd className={`${styles.detectValue} mono`}>{d.value}</dd>
            </div>
          ) : (
            <p key={d.label} className={styles.detectHead}>
              {d.label}
            </p>
          ),
        )}
      </dl>

      <p className={styles.running}>{externalScan.running}</p>

      <ul className={styles.checkList}>
        {externalScan.checks.map((c, i) => (
          <HostCheckRow
            key={c.id}
            label={c.label}
            result={c.result}
            state={checkStates[i]}
            revealFault={revealFault}
          />
        ))}
      </ul>
    </PanelFrame>
  );
}

export function CriticalErrorPanel({
  visibleFindings,
  showRecommendation,
  showAction,
  onBuildReport,
}: {
  visibleFindings: number;
  showRecommendation: boolean;
  showAction: boolean;
  onBuildReport: () => void;
}) {
  return (
    <div className={styles.errorWrap}>
      <div className={styles.errorHead} role="alert">
        <span className={styles.errorBar} aria-hidden="true" />
        <div>
          <p className={styles.errorHeadline}>{externalScan.errorHeadline}</p>
          <p className={styles.errorSub}>{externalScan.errorSub}</p>
        </div>
      </div>

      <PanelFrame danger title="DIAGNOSIS">
        <dl className={styles.diagFields}>
          {diagnosis.fields.map((f) => (
            <div key={f.label} className={styles.diagRow}>
              <dt className={styles.diagLabel}>{f.label}</dt>
              <dd className={`${styles.diagValue} mono ${f.danger ? styles.diagDanger : styles.diagOk}`}>
                {f.value}
              </dd>
            </div>
          ))}
        </dl>

        <ol className={styles.findings}>
          {diagnosis.findings.slice(0, visibleFindings).map((f, i) => (
            <li key={f} className={styles.finding}>
              <span className={`${styles.findingNum} mono`}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.findingText}>{f}</span>
            </li>
          ))}
        </ol>

        {showRecommendation && (
          <div className={styles.recommendation}>
            <TechnicalLabel tone="bright">{diagnosis.recommendationTitle}</TechnicalLabel>
            {diagnosis.recommendation.map((r) => (
              <p key={r} className={styles.recommendationText}>
                {r}
              </p>
            ))}
          </div>
        )}
      </PanelFrame>

      {showAction && (
        <div className={styles.action}>
          <ActionButton onClick={onBuildReport}>{diagnosis.action}</ActionButton>
        </div>
      )}
    </div>
  );
}
