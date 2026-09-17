# ELECTROLITE // SERVICE — REMOTE DIAGNOSTIC TERMINAL

Интерактивное поздравление Андрею с 35-летием, оформленное как внутренняя система
сервисного центра. На диагностику поступает не инструмент, а сам Андрей: почти все
параметры исправны, и только после полной проверки система находит подключённую
внешнюю систему ELECTROLITE.RU и ставит диагноз её интерфейсу.

## Запуск

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build в dist/
npm run preview  # предпросмотр собранной версии
```

## Стек

Vite + React + TypeScript, CSS Modules. Без backend, аналитики и тяжёлых
animation-библиотек: конечный автомат на useState, анимации на CSS и таймерах.

## Сценарий

Шесть актов, ключевые переходы запускает пользователь:

1. **BOOT / IDENTIFICATION** — загрузка терминала, авторизация
2. **SERVICE OBJECT** — фото как сканируемый объект, паспорт оборудования
3. **FULL DIAGNOSTICS** — 8 метрик, затем 7 узлов
4. **EXTERNAL SYSTEM ERROR** — обнаружение ELECTROLITE.RU и диагноз
5. **SERVICE REPORT** — заказ-наряд, поздравление, панчлайн
6. **TEAM FILE / COMPLETE** — видео команды и закрытие заказа

Красный цвет и glitch появляются только в сцене ошибки сайта.

## Замена контента

Все тексты, пути к assets, даты и feature flags — в одном файле
[`src/content/siteContent.ts`](src/content/siteContent.ts).
Замена фото или видео одним файлом не требует правок в компонентах.

## Assets

Лежат в `public/assets/`:

| Файл | Назначение | Статус |
| --- | --- | --- |
| `andrey.webp` / `andrey.jpg` | Портрет 4:5, главный объект диагностики | готов |
| `andrey-35.mp4` | Отчёт команды (поддерживается и `.webm`) | **нужно добавить** |
| `andrey-35-poster.webp` | Постер видео | заглушка |
| `electrolite-logo.svg` | Знак в шапке | заглушка |
| `trafficrock-logo.svg` | Логотип в финале | заглушка |

Если файла нет, интерфейс не ломается: показывается корректное состояние
(`OPTICAL INPUT OFFLINE`, `SERVICE FILE TEMPORARILY UNAVAILABLE`, текстовый логотип),
и сценарий проходится до конца.

Позиционирование лица в кадре настраивается через `assets.andreyPhotoPosition`
отдельно для desktop и mobile.

## Доступность

- Полное прохождение с клавиатуры, видимый focus-ring 2px
- Видео в диалоге с `aria-modal`, focus trap, закрытием по Escape и возвратом фокуса
- Статусы дублируются текстом, не только цветом
- `prefers-reduced-motion` отключает сканлинию, glitch и искусственные задержки
- Autoplay и звук отсутствуют
