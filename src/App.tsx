import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  diagnosis,
  externalScan,
  metrics,
  report,
  serviceComponents,
} from './content/siteContent';
import type { DiagnosticStage, RowState } from './state/types';
import { stageReached } from './state/types';
import { useIsMobile, useReducedMotion } from './lib/useReducedMotion';
import { useSequence } from './lib/useSequence';
import { DiagnosticShell, StageRail, SystemHeader } from './components/DiagnosticShell';
import { BootSequence } from './components/BootSequence';
import { SubjectWorkspace } from './components/SubjectWorkspace';
import { DiagnosticsPanel } from './components/DiagnosticsPanel';
import { CriticalErrorPanel, ExternalSystemScan } from './components/ExternalSystemScan';
import { ServiceReport } from './components/ServiceReport';
import { TeamVideoFile } from './components/TeamVideoFile';
import { CompletionScreen } from './components/CompletionScreen';
import styles from './App.module.css';

const METRIC_STEP = 520;
const COMPONENT_STEP = 480;
const HOST_STEP = 420;
const FINDING_STEP = 460;

function queued(n: number): RowState[] {
  return Array.from({ length: n }, () => 'queued' as RowState);
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const [stage, setStage] = useState<DiagnosticStage>('booting');

  const [metricStates, setMetricStates] = useState<RowState[]>(() => queued(metrics.length));
  const [componentStates, setComponentStates] = useState<RowState[]>(() =>
    queued(serviceComponents.length),
  );
  const [hostStates, setHostStates] = useState<RowState[]>(() => queued(externalScan.checks.length));

  const [scanning, setScanning] = useState(false);
  const [showAdvisory, setShowAdvisory] = useState(false);
  const [revealFault, setRevealFault] = useState(false);
  const [visibleFindings, setVisibleFindings] = useState(0);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [showPunchline, setShowPunchline] = useState(false);
  const [visiblePunchlines, setVisiblePunchlines] = useState(0);

  const [sessionTime] = useState(() =>
    new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  );

  const metricsSeq = useSequence(reducedMotion);
  const componentsSeq = useSequence(reducedMotion);
  const externalSeq = useSequence(reducedMotion);
  const errorSeq = useSequence(reducedMotion);
  const punchSeq = useSequence(reducedMotion);

  // Защита от повторного запуска ОДНОГО И ТОГО ЖЕ этапа при двойном клике.
  // Ключ на действие: быстрый переход к следующему шагу блокироваться не должен.
  const fired = useRef<Set<string>>(new Set());
  const guard = useCallback((key: string, fn: () => void) => {
    if (fired.current.has(key)) return;
    fired.current.add(key);
    fn();
  }, []);

  /* ---------- Act 1 ---------- */
  const handleBootComplete = useCallback(() => {
    setStage((s) => (s === 'booting' ? 'authorization' : s));
  }, []);

  const handleStart = useCallback(() => {
    guard('start', () => {
      setStage('subject');
      setScanning(true);
      // Сканирующая линия: два прохода по 1.8s.
      if (!reducedMotion) {
        window.setTimeout(() => {
          setScanning(false);
        }, 3600);
      } else {
        setScanning(false);
      }
    });
  }, [guard, reducedMotion]);

  /* ---------- Act 3A: metrics ---------- */
  const runMetrics = useCallback(() => {
    guard('metrics', () => {
      setStage('metricsScanning');

      const steps = metrics.flatMap((_m, i) => [
        {
          delay: i === 0 ? 300 : METRIC_STEP,
          run: () => {
            setMetricStates((prev) => prev.map((s, j) => (j === i ? 'checking' : s)));
          },
        },
        {
          delay: 260,
          run: () => {
            setMetricStates((prev) => prev.map((s, j) => (j === i ? 'done' : s)));
          },
        },
      ]);

      metricsSeq.run(steps, () => {
        setShowAdvisory(true);
      });
    });
  }, [guard, metricsSeq]);

  /* ---------- Act 3B: components ---------- */
  const runComponents = useCallback(() => {
    guard('components', () => {
      setStage('componentsScanning');

      const steps = serviceComponents.flatMap((_c, i) => [
        {
          delay: i === 0 ? 260 : COMPONENT_STEP,
          run: () => {
            setComponentStates((prev) => prev.map((s, j) => (j === i ? 'checking' : s)));
          },
        },
        {
          delay: 240,
          run: () => {
            setComponentStates((prev) => prev.map((s, j) => (j === i ? 'done' : s)));
          },
        },
      ]);

      componentsSeq.run(steps, () => {
        // Пауза 700–1000 мс, затем система сама находит внешнюю связь.
        window.setTimeout(() => runExternal(), reducedMotion ? 0 : 850);
      });
    });
    // runExternal объявлен ниже — ссылка стабильна через useCallback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guard, componentsSeq, reducedMotion]);

  /* ---------- Act 4: external scan ---------- */
  const runExternal = useCallback(() => {
    setStage('externalScan');

    const steps = externalScan.checks.flatMap((_c, i) => [
      {
        delay: i === 0 ? 400 : HOST_STEP,
        run: () => {
          setHostStates((prev) => prev.map((s, j) => (j === i ? 'checking' : s)));
        },
      },
      {
        delay: 220,
        run: () => {
          setHostStates((prev) => prev.map((s, j) => (j === i ? 'done' : s)));
        },
      },
    ]);

    externalSeq.run(steps, () => {
      // Только теперь — короткий глитч и переход в критическое состояние.
      window.setTimeout(
        () => {
          setRevealFault(true);
          setStage('criticalError');
          runFindings();
        },
        reducedMotion ? 0 : 520,
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSeq, reducedMotion]);

  const runFindings = useCallback(() => {
    const steps = diagnosis.findings.map((_f, i) => ({
      delay: i === 0 ? 600 : FINDING_STEP,
      run: () => {
        setVisibleFindings(i + 1);
      },
    }));
    errorSeq.run(steps, () => setShowRecommendation(true));
  }, [errorSeq]);

  /* ---------- Act 5: report ---------- */
  const buildReport = useCallback(() => {
    guard('report', () => {
      setStage('report');
      window.setTimeout(() => setShowGreeting(true), reducedMotion ? 0 : 420);
    });
  }, [guard, reducedMotion]);

  const revealPunchline = useCallback(() => {
    guard('punchline', () => {
      setShowPunchline(true);
      const steps = report.punchline.map((_, i) => ({
        delay: i === 0 ? 220 : 520,
        run: () => setVisiblePunchlines(i + 1),
      }));
      punchSeq.run(steps, () => {
        setStage('videoReady');
      });
    });
  }, [guard, punchSeq]);

  const completeSession = useCallback(() => {
    setStage((s) => {
      if (s === 'complete') return s;
      return 'complete';
    });
  }, []);

  const restart = useCallback(() => {
    metricsSeq.clear();
    componentsSeq.clear();
    externalSeq.clear();
    errorSeq.clear();
    punchSeq.clear();
    setMetricStates(queued(metrics.length));
    setComponentStates(queued(serviceComponents.length));
    setHostStates(queued(externalScan.checks.length));
    setScanning(false);
    setShowAdvisory(false);
    setRevealFault(false);
    setVisibleFindings(0);
    setShowRecommendation(false);
    setShowGreeting(false);
    setShowPunchline(false);
    setVisiblePunchlines(0);
    fired.current.clear();
    setStage('booting');
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [componentsSeq, errorSeq, externalSeq, metricsSeq, punchSeq, reducedMotion]);

  /* ---------- Page Visibility: декоративные анимации на скрытой вкладке ---------- */
  useEffect(() => {
    const onVisibility = () => {
      document.documentElement.dataset.hidden = document.hidden ? 'true' : 'false';
    };
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const metricsDone = metricStates.every((s) => s === 'done');
  const componentsDone = componentStates.every((s) => s === 'done');
  const showDiagnostics = stageReached(stage, 'metricsScanning');
  const showExternal = stageReached(stage, 'externalScan');
  const errorActive = stageReached(stage, 'criticalError');
  const showReport = stageReached(stage, 'report');
  const showVideo = stageReached(stage, 'videoReady');
  const isComplete = stage === 'complete';

  const online = stage !== 'booting';

  const subjectStarted = stageReached(stage, 'metricsScanning');

  const headerStage = useMemo(() => stage, [stage]);

  return (
    <>
      <div className="grid-backdrop" aria-hidden="true" />
      <DiagnosticShell>
        <SystemHeader online={online} stage={headerStage} />

        {stage !== 'booting' && stage !== 'authorization' && <StageRail stage={stage} />}

        <main className={styles.main}>
          {(stage === 'booting' || stage === 'authorization') && (
            <BootSequence
              authorized={stage === 'authorization'}
              onBootComplete={handleBootComplete}
              onStart={handleStart}
              reducedMotion={reducedMotion}
            />
          )}

          {stage !== 'booting' && stage !== 'authorization' && !isComplete && (
            <>
              <SubjectWorkspace
                scanning={scanning}
                confirmed={!scanning}
                started={subjectStarted}
                onStartDiagnostics={runMetrics}
              />

              {showDiagnostics && (
                <DiagnosticsPanel
                  metricStates={metricStates}
                  componentStates={componentStates}
                  showAdvisory={showAdvisory}
                  showComponentsAction={metricsDone && showAdvisory}
                  showComponents={stageReached(stage, 'componentsScanning')}
                  componentsDone={componentsDone}
                  onCheckComponents={runComponents}
                />
              )}

              {showExternal && (
                <div className={styles.block}>
                  <ExternalSystemScan
                    checkStates={hostStates}
                    revealFault={revealFault}
                    errorActive={errorActive}
                  />
                </div>
              )}

              {errorActive && (
                <div className={styles.block}>
                  <CriticalErrorPanel
                    visibleFindings={visibleFindings}
                    showRecommendation={showRecommendation}
                    showAction={showRecommendation && !showReport}
                    onBuildReport={buildReport}
                  />
                </div>
              )}

              {showReport && (
                <div className={styles.block}>
                  <ServiceReport
                    sessionTime={sessionTime}
                    showGreeting={showGreeting}
                    showPunchlineAction={showGreeting}
                    showPunchline={showPunchline}
                    visiblePunchlines={visiblePunchlines}
                    onRevealPunchline={revealPunchline}
                  />
                </div>
              )}

              {showVideo && (
                <div className={styles.block}>
                  <TeamVideoFile
                    onComplete={completeSession}
                  />
                </div>
              )}
            </>
          )}

          {isComplete && <CompletionScreen onRestart={restart} />}
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerBar}>
            <span className={styles.footerNote}>
              {isMobile ? 'SRV-35-1991' : 'ELECTROLITE // SERVICE NETWORK · NODE 07'}
            </span>
          </div>
        </footer>
      </DiagnosticShell>
    </>
  );
}
