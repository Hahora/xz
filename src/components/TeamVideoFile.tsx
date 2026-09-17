import { useCallback, useEffect, useRef, useState } from 'react';
import { assets, features, videoFile } from '../content/siteContent';
import type { VideoState } from '../state/types';
import { ActionButton, PanelFrame, StatusChip } from '../primitives/Primitives';
import styles from './TeamVideoFile.module.css';

const FOCUSABLE =
  'button, [href], video, input, select, textarea, [tabindex]:not([tabindex="-1"])';

function AccessibleVideoDialog({
  onClose,
  onEnded,
  onError,
}: {
  onClose: () => void;
  onEnded: () => void;
  onError: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      // Focus trap: фокус не покидает диалог.
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const list = Array.from(nodes).filter((n) => !n.hasAttribute('disabled'));
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // При закрытии видео обязательно ставится на паузу.
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      video?.pause();
    };
  }, []);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={videoFile.dialogTitle}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.dialogHead}>
          <span className={`${styles.dialogTitle} mono`}>{videoFile.dialogTitle}</span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            ref={closeRef}
            aria-label={`${videoFile.close} отчёт команды`}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
            <span className={styles.closeLabel}>{videoFile.close}</span>
          </button>
        </header>

        <div className={styles.videoWrap}>
          {/* Ошибка на <source> не всплывает — слушаем её на самом video. */}
          <video
            ref={videoRef}
            className={styles.video}
            poster={assets.videoPoster}
            controls
            playsInline
            preload="metadata"
            onEnded={onEnded}
            // Отдельные <source> падают по очереди — это норма.
            // Ошибкой считаем только исчерпание всех вариантов.
            onError={(e) => {
              const v = e.currentTarget;
              if (v.networkState === v.NETWORK_NO_SOURCE) onError();
            }}
          >
            {assets.video.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
        </div>
      </div>
    </div>
  );
}

export function TeamVideoFile({ onComplete }: { onComplete: () => void }) {
  const [videoState, setVideoState] = useState<VideoState>(
    features.videoEnabled ? 'ready' : 'error',
  );
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);

  // Проверяем доступность файла до того, как показать кнопку открытия:
  // пробуем каждый формат и считаем файл недоступным, только если упали все.
  useEffect(() => {
    if (!features.videoEnabled) return;
    let cancelled = false;

    const probe = document.createElement('video');
    probe.preload = 'metadata';
    probe.muted = true;

    let index = 0;
    const tryNext = () => {
      if (cancelled) return;
      if (index >= assets.video.length) {
        setVideoState('error');
        return;
      }
      const candidate = assets.video[index];
      index += 1;
      // Формат, который браузер точно не умеет, не тратим на сетевой запрос.
      if (candidate.type && probe.canPlayType(candidate.type) === '') {
        tryNext();
        return;
      }
      probe.src = candidate.src;
      probe.load();
    };

    const ok = () => !cancelled && setVideoState('ready');
    probe.addEventListener('loadedmetadata', ok);
    probe.addEventListener('error', tryNext);
    tryNext();

    return () => {
      cancelled = true;
      probe.removeEventListener('loadedmetadata', ok);
      probe.removeEventListener('error', tryNext);
      probe.removeAttribute('src');
      probe.load();
    };
  }, []);

  // Закрытие само по себе не закрывает заказ: пользователь остаётся на этом
  // экране с кнопкой «Завершить», а фокус возвращается на кнопку открытия.
  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  }, []);

  const unavailable = videoState === 'error';

  return (
    <div className={styles.wrap}>
      <PanelFrame
        title={videoFile.detected}
        meta={
          <StatusChip
            label={unavailable ? 'UNAVAILABLE' : 'READY'}
            tone={unavailable ? 'warning' : 'ok'}
          />
        }
      >
        {!unavailable ? (
          <>
            <dl className={styles.fields}>
              {videoFile.fields.map((f) => (
                <div key={f.label} className={styles.field}>
                  <dt className={styles.fieldLabel}>{f.label}</dt>
                  <dd className={`${styles.fieldValue} mono`}>{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.action}>
              <ActionButton
                ref={openerRef}
                onClick={() => setOpen(true)}
              >
                {videoFile.action}
              </ActionButton>
            </div>
          </>
        ) : (
          <div className={styles.unavailable}>
            <p className={styles.unavailableHead}>{videoFile.unavailable.headline}</p>
            <p className={styles.unavailableNote}>{videoFile.unavailable.note}</p>
            <div className={styles.action}>
              <ActionButton onClick={onComplete}>{videoFile.unavailable.action}</ActionButton>
            </div>
          </div>
        )}
      </PanelFrame>

      {open && (
        <AccessibleVideoDialog
          onClose={close}
          onEnded={onComplete}
          onError={() => {
            setVideoState('error');
            setOpen(false);
          }}
        />
      )}

      {/* Финальный экран не блокируется, если видео закрыли раньше конца. */}
      {!unavailable && !open && (
        <div className={styles.skip}>
          <button type="button" className={styles.skipButton} onClick={onComplete}>
            {videoFile.finishAction}
          </button>
        </div>
      )}
    </div>
  );
}
