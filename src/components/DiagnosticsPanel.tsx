import {
  advisory,
  componentsAction,
  metrics,
  primaryCheckResult,
  serviceComponents,
} from '../content/siteContent';
import type { Metric, ServiceComponent } from '../content/siteContent';
import type { ChipTone } from '../primitives/Primitives';
import type { RowState } from '../state/types';
import { ActionButton, PanelFrame, StatusChip, TechnicalLabel } from '../primitives/Primitives';
import styles from './DiagnosticsPanel.module.css';

function metricTone(m: Metric): ChipTone {
  if (m.status === 'WARNING') return 'warning';
  if (m.status === 'ARMED') return 'active';
  return 'ok';
}

function componentTone(c: ServiceComponent): ChipTone {
  if (c.status === 'CLASSIFIED') return 'classified';
  if (c.status === 'READY') return 'active';
  return 'ok';
}

function ProgressGauge({
  percent,
  tone,
  filled,
}: {
  percent: number;
  tone: ChipTone;
  filled: boolean;
}) {
  return (
    <div className={styles.gauge} aria-hidden="true">
      <span
        className={`${styles.gaugeFill} ${styles[`gauge_${tone}`]}`}
        style={{ width: filled ? `${percent}%` : '0%' }}
      />
    </div>
  );
}

function MetricRow({ metric, state }: { metric: Metric; state: RowState }) {
  const tone = metricTone(metric);
  const done = state === 'done';

  const statusLabel =
    state === 'queued' ? 'QUEUED' : state === 'checking' ? 'CHECKING' : metric.status;

  return (
    <li className={`${styles.row} ${done ? styles.rowDone : ''}`}>
      <div className={styles.rowMain}>
        <div className={styles.rowLabels}>
          <span className={styles.rowLabelRu}>{metric.labelRu}</span>
          <span className={styles.rowLabelEn}>{metric.labelEn}</span>
        </div>
        <div className={styles.rowRight}>
          <span className={`${styles.rowValue} mono ${done ? '' : styles.rowValueHidden}`}>
            {done ? metric.value : '—'}
          </span>
          <StatusChip label={statusLabel} tone={done ? tone : 'neutral'} pulse={state === 'checking'} />
        </div>
      </div>

      <ProgressGauge percent={metric.percent} tone={tone} filled={done} />

      {done && <p className={styles.rowNote}>{metric.note}</p>}
    </li>
  );
}

function ComponentRow({ item, state }: { item: ServiceComponent; state: RowState }) {
  const done = state === 'done';
  const statusLabel = state === 'queued' ? 'QUEUED' : state === 'checking' ? 'CHECKING' : item.status;

  return (
    <li className={`${styles.checkRow} ${done ? styles.rowDone : ''}`}>
      <div className={styles.checkMain}>
        <div className={styles.rowLabels}>
          {item.labelRu && <span className={styles.rowLabelRu}>{item.labelRu}</span>}
          <span className={item.labelRu ? styles.rowLabelEn : styles.rowLabelRu}>{item.labelEn}</span>
        </div>
        <StatusChip
          label={statusLabel}
          tone={done ? componentTone(item) : 'neutral'}
          pulse={state === 'checking'}
        />
      </div>
      {done && <p className={styles.rowNote}>{item.note}</p>}
    </li>
  );
}

export function DiagnosticsPanel({
  metricStates,
  componentStates,
  showAdvisory,
  showComponentsAction,
  showComponents,
  componentsDone,
  onCheckComponents,
}: {
  metricStates: RowState[];
  componentStates: RowState[];
  showAdvisory: boolean;
  showComponentsAction: boolean;
  showComponents: boolean;
  componentsDone: boolean;
  onCheckComponents: () => void;
}) {
  const metricsDone = metricStates.every((s) => s === 'done');

  return (
    <div className={styles.panels}>
      <PanelFrame
        title="PHASE A / AGGREGATED METRICS"
        meta={
          <span className="mono">
            {metricStates.filter((s) => s === 'done').length}/{metrics.length}
          </span>
        }
      >
        <ul className={styles.list}>
          {metrics.map((m, i) => (
            <MetricRow key={m.id} metric={m} state={metricStates[i]} />
          ))}
        </ul>

        {showAdvisory && (
          <div className={styles.advisory}>
            <TechnicalLabel>ADVISORY</TechnicalLabel>
            <p className={`${styles.advisoryLabel} mono`}>{advisory.label}</p>
            <p className={styles.rowNote}>{advisory.note}</p>
          </div>
        )}
      </PanelFrame>

      {showComponentsAction && !showComponents && metricsDone && (
        <div className={styles.action}>
          <ActionButton onClick={onCheckComponents}>{componentsAction}</ActionButton>
        </div>
      )}

      {showComponents && (
        <PanelFrame
          title="PHASE B / PRIMARY COMPONENTS"
          meta={
            <span className="mono">
              {componentStates.filter((s) => s === 'done').length}/{serviceComponents.length}
            </span>
          }
        >
          <ul className={styles.checkList}>
            {serviceComponents.map((c, i) => (
              <ComponentRow key={c.id} item={c} state={componentStates[i]} />
            ))}
          </ul>

          {componentsDone && (
            <div className={styles.passed}>
              <p className={styles.passedHead}>{primaryCheckResult.headline}</p>
              <p className={styles.passedSub}>{primaryCheckResult.sub}</p>
            </div>
          )}
        </PanelFrame>
      )}
    </div>
  );
}
