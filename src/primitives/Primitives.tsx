import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Primitives.module.css';

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="visually-hidden">{children}</span>;
}

export function TechnicalLabel({
  children,
  tone = 'muted',
  as: Tag = 'span',
}: {
  children: ReactNode;
  tone?: 'muted' | 'bright';
  as?: 'span' | 'div' | 'h2' | 'h3';
}) {
  return <Tag className={`${styles.techLabel} ${styles[`tone_${tone}`]}`}>{children}</Tag>;
}

export type ChipTone = 'neutral' | 'ok' | 'warning' | 'danger' | 'active' | 'classified';

/** Статус всегда читается текстом — цвет только усиливает, но не кодирует. */
export function StatusChip({
  label,
  tone = 'neutral',
  pulse = false,
}: {
  label: string;
  tone?: ChipTone;
  pulse?: boolean;
}) {
  return (
    <span className={`${styles.chip} ${styles[`chip_${tone}`]} ${pulse ? styles.chipPulse : ''}`}>
      <span className={styles.chipDot} aria-hidden="true" />
      {label}
    </span>
  );
}

export function PanelFrame({
  children,
  title,
  meta,
  emphasis = false,
  danger = false,
  className = '',
}: {
  children: ReactNode;
  title?: string;
  meta?: ReactNode;
  emphasis?: boolean;
  danger?: boolean;
  className?: string;
}) {
  return (
    <section
      className={[
        styles.panel,
        emphasis ? styles.panelEmphasis : '',
        danger ? styles.panelDanger : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {(title || meta) && (
        <header className={styles.panelHead}>
          {title && <TechnicalLabel tone="bright">{title}</TechnicalLabel>}
          {meta && <div className={styles.panelMeta}>{meta}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  children: ReactNode;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  function ActionButton({ variant = 'primary', children, className = '', ...rest }, ref) {
    return (
      <button
        type="button"
        ref={ref}
        className={`${styles.button} ${styles[`button_${variant}`]} ${className}`}
        {...rest}
      >
        <span className={styles.buttonLabel}>{children}</span>
      </button>
    );
  },
);

/** Декоративный штрихкод: детерминированный по seed, чтобы не «прыгал» между рендерами. */
export function Barcode({ seed = 7, bars = 44 }: { seed?: number; bars?: number }) {
  const widths: number[] = [];
  let value = seed;
  for (let i = 0; i < bars; i += 1) {
    value = (value * 1103515245 + 12345) % 2147483648;
    widths.push(1 + (value % 3));
  }
  return (
    <div className={styles.barcode} aria-hidden="true">
      {widths.map((w, i) => (
        <span key={i} style={{ width: `${w}px`, opacity: i % 3 === 0 ? 0.9 : 0.55 }} />
      ))}
    </div>
  );
}

export function ServiceStamp({ label, tone = 'ok' }: { label: string; tone?: 'ok' | 'danger' }) {
  return (
    <div className={`${styles.stamp} ${tone === 'danger' ? styles.stampDanger : ''}`}>
      <span>{label}</span>
    </div>
  );
}
