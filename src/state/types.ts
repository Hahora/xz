export type DiagnosticStage =
  | 'booting'
  | 'authorization'
  | 'subject'
  | 'metricsScanning'
  | 'componentsScanning'
  | 'externalScan'
  | 'criticalError'
  | 'report'
  | 'videoReady'
  | 'complete';

export type AssetState = 'idle' | 'loading' | 'ready' | 'error';
export type VideoState = 'ready' | 'playing' | 'paused' | 'ended' | 'error';

/** Статус одной строки в последовательной проверке. */
export type RowState = 'queued' | 'checking' | 'done';

export const STAGE_ORDER: DiagnosticStage[] = [
  'booting',
  'authorization',
  'subject',
  'metricsScanning',
  'componentsScanning',
  'externalScan',
  'criticalError',
  'report',
  'videoReady',
  'complete',
];

export function stageIndex(stage: DiagnosticStage): number {
  return STAGE_ORDER.indexOf(stage);
}

export function stageReached(current: DiagnosticStage, target: DiagnosticStage): boolean {
  return stageIndex(current) >= stageIndex(target);
}
