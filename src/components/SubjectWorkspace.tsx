import { useEffect, useState } from 'react';
import { assets, passport, subject } from '../content/siteContent';
import type { AssetState } from '../state/types';
import { useIsMobile } from '../lib/useReducedMotion';
import {
  ActionButton,
  PanelFrame,
  StatusChip,
  TechnicalLabel,
} from '../primitives/Primitives';
import styles from './SubjectWorkspace.module.css';

/** Точки анализа расположены вокруг лица, не перекрывая глаза. */
const ANALYSIS_POINTS = [
  { x: 30, y: 24, label: 'A1' },
  { x: 71, y: 30, label: 'A2' },
  { x: 24, y: 55, label: 'A3' },
  { x: 76, y: 62, label: 'A4' },
  { x: 50, y: 82, label: 'A5' },
];

export function SubjectScanner({
  scanning,
  confirmed,
}: {
  scanning: boolean;
  confirmed: boolean;
}) {
  const [photoState, setPhotoState] = useState<AssetState>('loading');
  const [triedFallback, setTriedFallback] = useState(false);
  const [src, setSrc] = useState(assets.andreyPhoto);
  const isMobile = useIsMobile();

  const objectPosition = isMobile
    ? assets.andreyPhotoPosition.mobile
    : assets.andreyPhotoPosition.desktop;

  const handleError = () => {
    if (!triedFallback && assets.andreyPhotoFallback) {
      setTriedFallback(true);
      setSrc(assets.andreyPhotoFallback);
      return;
    }
    setPhotoState('error');
  };

  const offline = photoState === 'error';

  return (
    <figure className={styles.scanner}>
      <div className={`${styles.frame} ${scanning ? styles.frameScanning : ''}`}>
        {/* Аппаратная рамка: углы — отдельный слой, не часть изображения. */}
        <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
        <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
        <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
        <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />

        <div className={styles.media}>
          {!offline ? (
            <img
              src={src}
              alt={passport.photoAlt}
              className={styles.photo}
              style={{ objectPosition }}
              width={1200}
              height={1500}
              decoding="async"
              fetchPriority="high"
              onLoad={() => setPhotoState('ready')}
              onError={handleError}
            />
          ) : (
            <div className={styles.offline} role="img" aria-label={passport.photoAlt}>
              <svg viewBox="0 0 120 150" className={styles.offlineGlyph} aria-hidden="true">
                <circle cx="60" cy="48" r="22" />
                <path d="M18 138c0-25 19-42 42-42s42 17 42 42" />
              </svg>
              <div className={styles.offlineText}>
                {passport.photoOfflineLines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>
          )}

          {/* Тонировка поверх фото — псевдоэлемент низкой плотности. */}
          <span className={styles.tint} aria-hidden="true" />

          {!offline && (
            <>
              <span className={styles.crosshair} aria-hidden="true" />
              {ANALYSIS_POINTS.map((p) => (
                <span
                  key={p.label}
                  className={styles.point}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  aria-hidden="true"
                >
                  <span className={styles.pointDot} />
                  <span className={styles.pointLine} />
                  <span className={styles.pointLabel}>{p.label}</span>
                </span>
              ))}
              {scanning && <span className={styles.scanLine} aria-hidden="true" />}
            </>
          )}

          <span className={styles.vScale} aria-hidden="true">
            {Array.from({ length: 11 }).map((_, i) => (
              <span key={i} />
            ))}
          </span>
        </div>

        {/* Служебные метки поверх рамки. */}
        <span className={`${styles.tag} ${styles.tagTL}`} aria-hidden="true">
          SUBJECT / {subject.name}
        </span>
        <span className={`${styles.tag} ${styles.tagTR}`} aria-hidden="true">
          ID / {subject.age}
        </span>
        <span className={`${styles.tag} ${styles.tagBL}`} aria-hidden="true">
          {subject.serial}
        </span>
        <span className={`${styles.tag} ${styles.tagBR}`} aria-hidden="true">
          {offline ? 'OPT / OFFLINE' : scanning ? 'SCAN / ACTIVE' : 'SCAN / IDLE'}
        </span>
      </div>

      <figcaption className={styles.caption}>
        <StatusChip
          label={scanning ? passport.scanLabels.scanning : confirmed ? passport.scanLabels.confirmed : 'STANDBY'}
          tone={scanning ? 'active' : confirmed ? 'ok' : 'neutral'}
          pulse={scanning}
        />
        <span className={styles.captionCoords}>
          X 0.{String(Math.round(48)).padStart(2, '0')} · Y 0.{String(Math.round(35)).padStart(2, '0')} · Z 1.00
        </span>
      </figcaption>
    </figure>
  );
}

export function ServicePassport({
  onStartDiagnostics,
  started,
}: {
  onStartDiagnostics: () => void;
  started: boolean;
}) {
  return (
    <div className={styles.passport}>
      <div className={styles.passportHead}>
        <TechnicalLabel tone="bright">{passport.eyebrow}</TechnicalLabel>
        <h1 className={styles.title}>{passport.title}</h1>
        <p className={styles.subtitle}>{passport.status}</p>
      </div>

      <PanelFrame className={styles.fieldsPanel}>
        <dl className={styles.fields}>
          {passport.fields.map((f) => (
            <div key={f.label} className={styles.field}>
              <dt className={styles.fieldLabel}>{f.label}</dt>
              <dd
                className={[
                  styles.fieldValue,
                  'mono',
                  f.pending ? styles.fieldPending : '',
                  f.muted ? styles.fieldMuted : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </PanelFrame>

      {!started && (
        <div className={styles.passportAction}>
          <ActionButton onClick={onStartDiagnostics}>{passport.action}</ActionButton>
        </div>
      )}
    </div>
  );
}

/** Акт 2: фото и паспорт работают как единая hero-композиция. */
export function SubjectWorkspace({
  scanning,
  confirmed,
  started,
  onStartDiagnostics,
}: {
  scanning: boolean;
  confirmed: boolean;
  started: boolean;
  onStartDiagnostics: () => void;
}) {
  // Сканирование запускается один раз при входе в акт.
  useEffect(() => {}, []);

  return (
    <section className={styles.workspace} aria-labelledby="subject-title">
      <span id="subject-title" className="visually-hidden">
        Объект сервисной диагностики
      </span>
      <SubjectScanner scanning={scanning} confirmed={confirmed} />
      <ServicePassport onStartDiagnostics={onStartDiagnostics} started={started} />
    </section>
  );
}
