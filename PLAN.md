# План Спринта 4 — Мессенджер

---

## Сводка по спринту

### Основные задачи

1. **Тестирование (Vitest)** — роутер, компоненты, HTTP-модуль
2. **Полная функциональность чата** — WebSocket, отправка/получение сообщений, пагинация
3. **Защита от XSS**
4. **Инфраструктура** — Husky precommit, аудит зависимостей
5. **Опционально** — `vite-plugin-checker`, собственный плагин Vite

### Ключевые API для WebSocket

- `POST /api/v2/chats/token/:id` — получение токена для подключения
- `wss://ya-praktikum.tech/ws/chats/<USER_ID>/<CHAT_ID>/<TOKEN>` — подключение
- Формат сообщений: `{ content, type }`
- Типы: `message`, `file`, `sticker`, `user connected`, `get old`, `ping`, `pong`
- Пагинация: `{ content: "offset", type: "get old" }`

---

## План выполнения

### Фаза 1: Инфраструктура и подготовка ✅

1. **Создать ветку `sprint_4`** ✅ — ветка уже создана
2. **Настроить Husky + lint-staged** ✅
   - `husky init` — выполнено
   - lint-staged настроен: `prettier --write --ignore-unknown` для всех файлов
   - `.husky/pre-commit` запускает `lint-staged`
   - ⚠️ `tsc`, `stylelint` и `eslint` убраны из pre-commit (не работают корректно через lint-staged на Windows)
   - Проверка запускается отдельно: `npm run lint` и `npm run typecheck`
3. **Установить и настроить Vitest** ✅
   - `npm install --save-dev vitest @vitest/ui jsdom`
   - `vitest.config.ts`: `globals: true`, `environment: 'jsdom'`
   - Скрипты: `test`, `test:ui`, `test:run`
4. **Аудит зависимостей** ✅ — `npm audit fix`, 0 уязвимостей
5. **Опционально:** `vite-plugin-checker` ✅ — проверка TS/ESLint/Stylelint во время сборки
6. **Дополнительно:**
   - `.prettierrc` починен (были merge-конфликты)
   - `.gitignore` обновлён (добавлен `.gigacode_vsc`)

---

### Фаза 2: WebSocket-клиент (сервис-обёртка) ✅

Создан модуль `src/features/websocket/`:

1. **`WebSocketService`** — сервис-обёртка (Singleton)
   - `connect(userId, chatId)` — получение токена через `POST /api/v2/chats/token/:id` → подключение к `wss://ya-praktikum.tech/ws/chats/<USER_ID>/<CHAT_ID>/<TOKEN>`
   - `send(message)` — отправка JSON: `{ content, type }`
   - `sendOldMessages(offset)` — пагинация: `{ content: String(offset), type: "get old" }`
   - Авто-ping каждые 30 секунд
   - `disconnect()` — закрытие соединения
   - Обработчики событий: `open`, `message`, `error`, `close`
   - Парсер входящих сообщений (JSON.parse)
   - Обработка ошибок связи
   - Reconnect при обрыве (код != 1000) с задержкой 3 сек
   - Запрос старых сообщений при подключении к чату (`sendOldMessages(0)` в `onopen`)

---

### Фаза 3: Интеграция в ChatPage

1. **Компонент `MessageList`** — список сообщений чата
   - Рендерит массив сообщений из Store
   - Временные метки (форматирование `time`)
   - Разделение сообщений по author (свои/чужие) — через CSS-классы

2. **Компонент `MessageItem`** — одно сообщение
   - Отображение контента (текст или файл/стикер)
   - Временная метка
   - Имя автора

3. **Обновить ChatPage**
   - При выборе чата: вызов `WebSocketService.connect(userId, chatId)`
   - Запрос старых сообщений: `sendOldMessages(0)` → пагинация до конца
   - При получении нового сообщения — добавление в Store → ре-рендер
   - При отправке — `send({ content: message, type: "message" })`
   - Автоскролл к последнему сообщению (ref на контейнер, `scrollToBottom`)
   - При скролле вверх — загрузка предыдущих порций (если нужно)
   - Сброс WebSocket при уходе со страницы (`componentWillUnmount`)

4. **Пустое состояние** — "Выберите чат" или "Начните переписку"

---

### Фаза 4: Защита от XSS

1. **Проверка всех мест** — убедиться, что нигде не используется `innerHTML` (уже должен быть только `createContextualFragment`)
2. **Санитайзинг сообщений** — если в сообщениях может быть HTML, использовать `textContent` или санитайзер
3. **Проверка href** — валидация URL перед использованием в `href` (только `http/https`)
4. **Проверка стилей** — не подставлять пользовательские данные в `style.textContent`
5. **CSP** — добавить заголовок Content-Security-Policy через Vite plugin или netlify.toml

---

### Фаза 5: Тесты (Vitest)

Файлы тестов рядом с тестируемыми модулями:

1. **`src/features/api/httpTransport.test.ts`** — тесты HTTPTransport
   - GET, POST, PUT, DELETE запросы
   - Mock XHR
   - Обработка ошибок

2. **`src/shared/utils/router.test.ts`** — тесты Router
   - Регистрация маршрутов
   - Переходы
   - History API

3. **`src/shared/utils/isEqual.test.ts`** — тесты isEqual
   - Равные/неравные объекты
   - Вложенные объекты
   - Массивы

4. **`src/shared/utils/merge.test.ts`** — тесты merge

5. **`src/features/validation/validators.test.ts`** — тесты валидаторов
   - first_name, second_name, login, email, password, phone, message

6. **`src/shared/ui/input/input.test.ts`** — тесты компонента Input
   - Рендер
   - Валидация

7. **`src/features/websocket/webSocketService.test.ts`** — тесты WebSocketService
   - Подключение
   - Отправка
   - Подписка на события
   - Mock WebSocket

---

### Фаза 6: Финализация

1. **Обновить README.md**
   - Описание WebSocket-функциональности
   - Команды для запуска тестов
   - Обновить список технологий (Vitest, Husky)
2. **Проверить сборку** — `npm run build` без ошибок
3. **Проверить линтинг** — `npm run lint` без ошибок
4. **Проверить тесты** — `npm run test:run` все проходят
5. **Деплой в Netlify** — обновить сборку
6. **Мерж в `main`** — через PR

---

## Архитектурные решения

- **WebSocketService** — Singleton, подписка через callback, авто-ping
- **Сообщения в Store** — ключ `chatMessages` с объектом `{ [chatId]: Message[] }`
- **Компоненты сообщений** — вынести в `src/shared/ui/message/` (message-list, message-item)
- **Тесты** — рядом с модулями, `*.test.ts`
- **XSS** — `textContent` вместо `innerHTML`, валидация URL, санитайзинг

---

## Оценка сложности

| Фаза                     | Сложность       |
| ------------------------ | --------------- |
| 1. Инфраструктура        | Низкая          |
| 2. WebSocket-клиент      | Средняя         |
| 3. Интеграция в ChatPage | Средняя-высокая |
| 4. XSS защита            | Низкая-средняя  |
| 5. Тесты                 | Средняя         |
| 6. Финализация           | Низкая          |
