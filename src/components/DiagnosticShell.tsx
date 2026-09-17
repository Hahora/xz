import { useState } from 'react';
import type { ReactNode } from 'react';
import { assets, features, shell } from '../content/siteContent';
import type { DiagnosticStage } from '../state/types';
import { STAGE_ORDER, stageIndex } from '../state/types';
import { TechnicalLabel } from '../primitives/Primitives';
import styles from './DiagnosticShell.module.css';

export function SystemHeader({ online, stage }: { online: boolean; stage: DiagnosticStage }) {
  const [logoOk, setLogoOk] = useState(features.showElectroliteLogo);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        {logoOk ? (
          <img
            src={assets.electroliteLogo}
            alt=""
            className={styles.brandLogo}
            onError={() => setLogoOk(false)}
          />
        ) : (
          <span className={styles.brandMark} aria-hidden="true">
            {shell.brandMark}
          </span>
        )}
        <span className={styles.brandText}>
          <span className={styles.brandName}>{shell.brandName}</span>
          <span className={styles.brandSub}>{shell.brandSub}</span>
        </span>
      </div>

      <div className={styles.headerRight}>
        <TechnicalLabel>{shell.stageNames[stage]}</TechnicalLabel>
        <span className={`${styles.systemStatus} ${online ? styles.systemOnline : ''}`}>
          <span className={styles.systemDot} aria-hidden="true" />
          {online ? shell.systemOnline : shell.systemOffline}
        </span>
      </div>
    </header>
  );
}

export function StageRail({ stage }: { stage: DiagnosticStage }) {
  const current = stageIndex(stage);
  // Boot и authorization показываем как один сегмент — рельс отражает акты, а не все состояния.
  const visible = STAGE_ORDER.filter((s) => s !== 'authorization');

  return (
    <div className={styles.rail} aria-hidden="true">
      {visible.map((s) => {
        const idx = stageIndex(s);
        const done = current > idx;
        const active = stage === s || (stage === 'authorization' && s === 'booting');
        return (
          <span
            key={s}
            className={[styles.railSeg, done ? styles.railDone : '', active ? styles.railActive : '']
              .filter(Boolean)
              .join(' ')}
          />
        );
      })}
    </div>
  );
}

export function DiagnosticShell({ children }: { children: ReactNode }) {
  return <div className={styles.shell}>{children}</div>;
}
