import { report, subject } from '../content/siteContent';
import { ActionButton, Barcode, PanelFrame, ServiceStamp } from '../primitives/Primitives';
import styles from './ServiceReport.module.css';

export function ServiceReport({
  sessionTime,
  showGreeting,
  showPunchlineAction,
  showPunchline,
  visiblePunchlines,
  onRevealPunchline,
}: {
  sessionTime: string;
  showGreeting: boolean;
  showPunchlineAction: boolean;
  showPunchline: boolean;
  visiblePunchlines: number;
  onRevealPunchline: () => void;
}) {
  const year = new Date().getFullYear();

  return (
    <div className={styles.wrap}>
      <PanelFrame
        emphasis
        className={styles.reportPanel}
        title={report.order}
        meta={<span className="mono">{report.status}</span>}
      >
        <div className={styles.reportHead}>
          <div>
            <h2 className={styles.reportTitle}>{report.title}</h2>
            <p className={styles.reportMeta}>
              <span className="mono">{year}</span>
              <span aria-hidden="true">·</span>
              <span className="mono">{sessionTime}</span>
              <span aria-hidden="true">·</span>
              <span className="mono">{subject.serial}</span>
            </p>
          </div>
          <ServiceStamp label={report.stamp} />
        </div>

        <dl className={styles.rows}>
          {report.rows.map((r) => (
            <div key={r.label} className={styles.row}>
              <dt className={styles.rowLabel}>{r.label}</dt>
              <dd className={styles.rowDots} aria-hidden="true" />
              <dd
                className={`${styles.rowValue} mono ${
                  r.tone === 'danger' ? styles.rowDanger : styles.rowOk
                }`}
              >
                <svg className={styles.rowIcon} viewBox="0 0 12 12" aria-hidden="true">
                  {r.tone === 'danger' ? (
                    <path d="M6 1v7M6 10v1" />
                  ) : (
                    <path d="M2 6.5 4.8 9.3 10 3.6" />
                  )}
                </svg>
                {r.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className={styles.reportFoot}>
          <Barcode seed={35} />
          <span className={`${styles.reportFootText} mono`}>{subject.orderNumber}</span>
        </div>
      </PanelFrame>

      {showGreeting && (
        <PanelFrame className={styles.greetingPanel} title={report.engineerNoteLabel}>
          <div className={styles.greeting}>
            {report.greeting.map((p, i) => (
              <p key={p} className={i === 0 ? styles.greetingLead : styles.greetingText}>
                {p}
              </p>
            ))}
          </div>

          {showPunchlineAction && !showPunchline && (
            <div className={styles.greetingAction}>
              <ActionButton onClick={onRevealPunchline}>{report.punchlineAction}</ActionButton>
            </div>
          )}
        </PanelFrame>
      )}

      {showPunchline && (
        <div className={styles.punchline}>
          {report.punchline.slice(0, visiblePunchlines).map((line, i) => (
            <p
              key={line}
              className={`${styles.punchlineLine} ${
                i === report.punchline.length - 1 ? styles.punchlineFinal : ''
              }`}
            >
              {line}
            </p>
          ))}

        </div>
      )}
    </div>
  );
}
