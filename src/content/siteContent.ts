/**
 * Единственный источник правды для всех текстов, путей к assets и параметров.
 * Замена фото/видео одним файлом не должна требовать правок в компонентах.
 */

interface VideoSource {
  src: string;
  type: string;
}

interface Assets {
  andreyPhoto: string;
  andreyPhotoFallback: string;
  andreyPhotoPosition: { desktop: string; mobile: string };
  /** Порядок важен: браузер берёт первый поддерживаемый формат. */
  video: VideoSource[];
  videoPoster: string;
  electroliteLogo: string;
  trafficRockLogo: string;
}

export const assets: Assets = {
  andreyPhoto: '/assets/andrey.webp',
  andreyPhotoFallback: '/assets/andrey.jpg',
  // Лицо в кадре примерно на 36% высоты — кроп не должен срезать голову.
  andreyPhotoPosition: { desktop: '50% 30%', mobile: '50% 26%' },
  video: [
    { src: '/assets/andrey-35.mp4', type: 'video/mp4' },
    { src: '/assets/andrey-35.webm', type: 'video/webm' },
  ],
  videoPoster: '/assets/andrey-35-poster.webp',
  electroliteLogo: '/assets/electrolite-logo.svg',
  trafficRockLogo: '/assets/trafficrock-logo.svg',
};

interface Features {
  showElectroliteLogo: boolean;
  videoEnabled: boolean;
}

export const features: Features = {
  showElectroliteLogo: true,
  videoEnabled: true,
};

export const subject = {
  name: 'ANDREY',
  age: 35,
  birthYear: 1991,
  serial: 'AND-1991-PRO-35',
  orderNumber: 'SRV-35-1991',
  nextServiceAge: 40,
  nextServiceIn: 5,
} as const;

export const boot = {
  lines: [
    'ELECTROLITE // SERVICE NETWORK',
    'REMOTE DIAGNOSTIC TERMINAL v3.5',
    '',
    'SYSTEM CHECK........................ OK',
    'SERVICE DATABASE.................... ONLINE',
    'SCANNING ACTIVE QUEUE...............',
    '',
    'NON-STANDARD SERVICE OBJECT DETECTED',
    'SUBJECT: ANDREY',
    'TYPE: PROFESSIONAL UNIT',
    'YEAR: 1991',
    'OPERATING TIME: 35 YEARS',
    '',
    'AUTHORIZATION REQUIRED',
  ],
  primaryAction: 'НАЧАТЬ ДИАГНОСТИКУ',
  skipAction: 'ПРОПУСТИТЬ ЗАГРУЗКУ',
  microcopy: ['SERVICE ORDER: SRV-35-1991', 'ESTIMATED TIME: 00:35'],
} as const;

export interface PassportField {
  label: string;
  value: string;
  /** Значение не раскрывается до полной диагностики. */
  pending?: boolean;
  muted?: boolean;
}

interface Passport {
  eyebrow: string;
  title: string;
  status: string;
  action: string;
  photoAlt: string;
  fields: PassportField[];
  photoOfflineLines: string[];
  scanLabels: { scanning: string; confirmed: string };
}

export const passport: Passport = {
  eyebrow: 'SERVICE OBJECT #35',
  title: 'ANDREY',
  status: 'SUBJECT DETECTED / IDENTITY CONFIRMED',
  action: 'ЗАПУСТИТЬ ПОЛНУЮ ПРОВЕРКУ',
  photoAlt: 'Андрей — объект сервисной диагностики №35',
  fields: [
    { label: 'MODEL', value: 'ANDREY' },
    { label: 'SERIAL NUMBER', value: 'AND-1991-PRO-35' },
    { label: 'YEAR OF MANUFACTURE', value: '1991' },
    { label: 'OPERATING TIME', value: '35 YEARS' },
    { label: 'TYPE', value: 'ENTREPRENEUR / PROFESSIONAL SERIES' },
    { label: 'MAIN APPLICATION', value: 'ELECTROLITE' },
    { label: 'OPERATION MODE', value: 'CONTINUOUS HIGH LOAD' },
    { label: 'SERVICE CLASS', value: 'PRO' },
    { label: 'POWER OUTPUT', value: 'CALIBRATION REQUIRED', pending: true },
    { label: 'CURRENT CONDITION', value: 'OPERATIONAL' },
    { label: 'WARRANTY DOCUMENTS', value: 'NOT FOUND', muted: true },
  ],
  photoOfflineLines: [
    'OPTICAL INPUT OFFLINE',
    'SUBJECT DATA AVAILABLE',
    'DIAGNOSTICS MAY CONTINUE',
  ],
  scanLabels: { scanning: 'SCANNING', confirmed: 'IDENTITY CONFIRMED' },
};

export type MetricStatus = 'OK' | 'WARNING' | 'MAX' | 'ARMED';

export interface Metric {
  id: string;
  labelRu: string;
  labelEn: string;
  value: string;
  percent: number;
  status: MetricStatus;
  note: string;
}

export const metrics: Metric[] = [
  {
    id: 'power',
    labelRu: 'МОЩНОСТЬ',
    labelEn: 'POWER OUTPUT',
    value: '100%',
    percent: 100,
    status: 'MAX',
    note: 'Ебейшая. Значение выходит за пределы бытовой шкалы.',
  },
  {
    id: 'reliability',
    labelRu: 'НАДЁЖНОСТЬ',
    labelEn: 'RELIABILITY',
    value: '97%',
    percent: 97,
    status: 'OK',
    note: 'Проверено 35 годами эксплуатации. Критические отказы не зарегистрированы.',
  },
  {
    id: 'entrepreneur',
    labelRu: 'ПРЕДПРИНИМАТЕЛЬСКИЙ РЕСУРС',
    labelEn: 'ENTREPRENEUR CAPACITY',
    value: '100%',
    percent: 100,
    status: 'OK',
    note: 'Расчётного запаса хватит, чтобы ещё не раз начать всё заново.',
  },
  {
    id: 'troubleshooting',
    labelRu: 'РЕШЕНИЕ ПРОБЛЕМ',
    labelEn: 'TROUBLESHOOTING',
    value: '100%',
    percent: 100,
    status: 'OK',
    note: 'Включая проблемы, которых до запуска системы ещё не существовало.',
  },
  {
    id: 'load',
    labelRu: 'СТРЕССОУСТОЙЧИВОСТЬ',
    labelEn: 'LOAD TOLERANCE',
    value: '89%',
    percent: 89,
    status: 'OK',
    note: 'В пределах допуска. Без необходимости не тестировать.',
  },
  {
    id: 'humor',
    labelRu: 'ЧУВСТВО ЮМОРА',
    labelEn: 'HUMOR MODULE',
    value: '100%',
    percent: 100,
    status: 'OK',
    note: 'Совместимо с текущим отчётом.',
  },
  {
    id: 'rest',
    labelRu: 'МОДУЛЬ ОТДЫХА',
    labelEn: 'REST CAPACITY',
    value: '23%',
    percent: 23,
    status: 'WARNING',
    note: 'Установлен штатно. Активируется подозрительно редко.',
  },
  {
    id: 'celebration',
    labelRu: 'ПРАЗДНИЧНЫЙ РЕЖИМ',
    labelEn: 'CELEBRATION MODE',
    value: 'READY',
    percent: 100,
    status: 'ARMED',
    note: 'Сегодня разрешена кратковременная работа на предельной мощности.',
  },
];

export const advisory = {
  label: 'LIVER MODULE / BASELINE: 65%',
  note: 'Повторная диагностика после сегодняшнего вечера может дать спорные данные.',
} as const;

export type ComponentStatus = 'OK' | 'CLASSIFIED' | 'READY';

export interface ServiceComponent {
  id: string;
  labelRu: string;
  labelEn: string;
  status: ComponentStatus;
  note: string;
}

export const componentsAction = 'ПРОВЕРИТЬ ОСНОВНЫЕ УЗЛЫ';

export const serviceComponents: ServiceComponent[] = [
  {
    id: 'drive',
    labelRu: 'ДВИГАТЕЛЬ',
    labelEn: 'DRIVE UNIT',
    status: 'OK',
    note: 'Запускается с утра. В холодном состоянии требуется кофе.',
  },
  {
    id: 'core',
    labelRu: 'МОЗГОВОЙ МОДУЛЬ',
    labelEn: 'PROCESSING CORE',
    status: 'OK',
    note: 'Параллельных процессов: много. Кнопка отключения не обнаружена.',
  },
  {
    id: 'decision',
    labelRu: 'БЛОК ПРИНЯТИЯ РЕШЕНИЙ',
    labelEn: 'DECISION UNIT',
    status: 'OK',
    note: 'Срабатывает раньше, чем окружающие успевают сформулировать вопрос.',
  },
  {
    id: 'entrepreneur',
    labelRu: '',
    labelEn: 'ENTREPRENEUR MODULE',
    status: 'OK',
    note: 'Выявлена хроническая несовместимость с режимом «работать на кого-то».',
  },
  {
    id: 'control',
    labelRu: '',
    labelEn: 'ELECTROLITE CONTROL SYSTEM',
    status: 'OK',
    note: 'Связь стабильная. Команды исполняются. Иногда даже те, которых не было.',
  },
  {
    id: 'finance',
    labelRu: 'ФИНАНСОВЫЙ МОДУЛЬ',
    labelEn: 'FINANCE UNIT',
    status: 'CLASSIFIED',
    note: 'Доступ ограничен владельцем системы. И правильно.',
  },
  {
    id: 'override',
    labelRu: '',
    labelEn: 'CELEBRATION OVERRIDE',
    status: 'READY',
    note: 'Ограничитель оборотов временно снят до 23:59.',
  },
];

export const primaryCheckResult = {
  headline: 'PRIMARY SYSTEMS CHECK: PASSED',
  sub: 'NO CRITICAL FAULTS DETECTED',
} as const;

export const externalScan = {
  detection: [
    { label: 'ADDITIONAL CONNECTED SYSTEM DETECTED', value: '' },
    { label: 'HOST', value: 'ELECTROLITE.RU' },
    { label: 'ROLE', value: 'EXTERNAL CUSTOMER INTERFACE' },
    { label: 'CONNECTION', value: 'ACTIVE' },
  ],
  running: 'RUNNING COMPATIBILITY CHECK...',
  checks: [
    { id: 'business', label: 'BUSINESS CORE', result: 'OK' as const },
    { id: 'catalog', label: 'CATALOG CONNECTION', result: 'OK' as const },
    { id: 'network', label: 'SERVICE NETWORK', result: 'ONLINE' as const },
    { id: 'protocol', label: 'INTERFACE PROTOCOL', result: 'OK' as const },
    { id: 'ux', label: 'USER EXPERIENCE', result: 'OK' as const },
    { id: 'visual', label: 'VISUAL SYSTEM', result: 'OK' as const },
  ],
  passedHeadline: 'EXTERNAL SYSTEM CHECK: PASSED',
  passedSub: 'NO FAULTS DETECTED',
} as const;

export interface DiagnosisField {
  label: string;
  value: string;
  /** Красным подсвечивается только то, что относится к сайту. */
  danger?: boolean;
}

interface Diagnosis {
  fields: DiagnosisField[];
  findings: string[];
  recommendationTitle: string;
  recommendation: string[];
  action: string;
}

export const diagnosis: Diagnosis = {
  fields: [
    { label: 'OBJECT', value: 'ELECTROLITE.RU' },
    { label: 'STATUS', value: 'FULLY OPERATIONAL' },
    { label: 'OWNER STATUS', value: 'FULLY OPERATIONAL' },
    { label: 'BUSINESS CORE', value: 'OPERATIONAL' },
    { label: 'INTERFACE CLASS', value: 'UI / UX / VISUAL SYSTEM — OK' },
  ],
  findings: [
    'Визуальный протокол соответствует текущему поколению.',
    'Плотность элементов в пределах нормы для спокойной эксплуатации.',
    'Интерфейс работает в рекомендованном межсервисном интервале.',
    'Пользовательский маршрут проходится без регулировки.',
    'Замена владельца не требуется.',
  ],
  recommendationTitle: 'RECOMMENDED ACTION',
  recommendation: [
    'Вмешательство не требуется. Система исправна.',
    'Основной агрегат не разбирать.',
  ],
  action: 'СФОРМИРОВАТЬ ЗАКЛЮЧЕНИЕ',
};

export interface ReportRow {
  label: string;
  value: string;
  /** 'danger' подсветит строку красным — на случай, если статус изменится. */
  tone: 'ok' | 'danger';
}

export const report: {
  title: string;
  order: string;
  status: string;
  rows: ReportRow[];
  stamp: string;
  engineerNoteLabel: string;
  greeting: string[];
  punchlineAction: string;
  punchline: string[];
} = {
  title: 'SERVICE REPORT №35',
  order: 'ORDER: SRV-35-1991',
  status: 'DIAGNOSTIC STATUS: COMPLETE',
  rows: [
    { label: 'АНДРЕЙ', value: 'ИСПРАВЕН', tone: 'ok' },
    { label: 'ДВИГАТЕЛЬ', value: 'ИСПРАВЕН', tone: 'ok' },
    { label: 'БИЗНЕС', value: 'ИСПРАВЕН', tone: 'ok' },
    { label: 'ELECTROLITE', value: 'ИСПРАВЕН', tone: 'ok' },
    { label: 'ЗАПАС МОЩНОСТИ', value: 'ОГРОМНЫЙ', tone: 'ok' },
    { label: 'СИСТЕМА ПРАЗДНОВАНИЯ', value: 'ГОТОВА', tone: 'ok' },
    { label: 'ELECTROLITE.RU', value: 'ИСПРАВЕН', tone: 'ok' },
  ],
  stamp: 'PASSED',
  engineerNoteLabel: 'КОММЕНТАРИЙ ИНЖЕНЕРА',
  greeting: [
    'Андрей, с 35-летием.',
    'Полная диагностика завершена. Критических неисправностей в основном агрегате не обнаружено.',
    'Ресурс — огромный. Мощность — ебейшая. Система управления бизнесом работает штатно даже при нагрузках, которые инструкцией не предусмотрены.',
    'Гарантийные документы не найдены, но аппарат ебашит как новый.',
    'Желаем ещё минимум 35 лет без перегрева, потери тяги и незапланированного ТО. А если что-то и пора ремонтировать — то точно не тебя.',
  ],
  punchlineAction: 'ПОКАЗАТЬ ЗАКЛЮЧЕНИЕ',
  punchline: ['АНДРЕЙ — ИСПРАВЕН.', 'ELECTROLITE — ИСПРАВЕН.', 'HAPPY БЕРЗДЕЦ BY TRAFFICROCK.'],
} as const;

export const videoFile = {
  detected: 'ADDITIONAL SERVICE FILE DETECTED',
  fields: [
    { label: 'FILE', value: 'ANDREY_35_FINAL_FINAL_REAL_FINAL.mp4' },
    { label: 'TYPE', value: 'SERVICE TEAM REPORT' },
    { label: 'SOURCE', value: 'TRAFFICROCK CREW' },
    { label: 'STATUS', value: 'READY' },
  ],
  action: 'ОТКРЫТЬ ОТЧЁТ КОМАНДЫ',
  dialogTitle: 'SERVICE TEAM REPORT',
  close: 'ЗАКРЫТЬ',
  unavailable: {
    headline: 'SERVICE FILE TEMPORARILY UNAVAILABLE',
    note: 'Основная диагностика завершена. Приложение будет установлено отдельно.',
    action: 'ЗАВЕРШИТЬ ДИАГНОСТИКУ',
  },
  finishAction: 'ЗАВЕРШИТЬ ДИАГНОСТИКУ',
} as const;

export const completion = {
  headline: 'SERVICE COMPLETE',
  bigNumber: '35',
  series: 'ANDREY / PRO SERIES',
  nextLabel: 'NEXT SCHEDULED SERVICE',
  nextValue: 'AGE 40 / IN 5 YEARS',
  rows: [
    { label: 'ORDER №35', value: 'CLOSED' },
    { label: 'FINAL STATUS', value: 'READY FOR FURTHER OPERATION' },
  ],
  greeting: 'С днём рождения, Андрей.',
  restart: 'ПОВТОРИТЬ ДИАГНОСТИКУ',
} as const;

export const shell = {
  brandMark: 'EL',
  brandName: 'ELECTROLITE',
  brandSub: 'SERVICE',
  systemOffline: 'SYSTEM / OFFLINE',
  systemOnline: 'SYSTEM / ONLINE',
  stageNames: {
    booting: 'BOOT',
    authorization: 'AUTHORIZATION',
    subject: 'SERVICE OBJECT',
    metricsScanning: 'DIAGNOSTICS',
    componentsScanning: 'COMPONENTS',
    externalScan: 'EXTERNAL SCAN',
    criticalError: 'EXTERNAL DIAGNOSIS',
    report: 'SERVICE REPORT',
    videoReady: 'TEAM FILE',
    complete: 'COMPLETE',
  },
} as const;
