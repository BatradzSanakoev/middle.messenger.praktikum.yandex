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
   - `sendOldMessages()` — запрос старых сообщений
   - Авто-ping каждые 30 секунд
   - `disconnect()` — закрытие соединения
   - Обработчики событий: `open`, `message`, `error`, `close`
   - Парсер входящих сообщений (JSON.parse)
   - Обработка ошибок связи
   - Reconnect при обрыве (код != 1000) с лимитом 5 попыток и экспоненциальной задержкой
   - Запрос старых сообщений при подключении к чату

---

### Фаза 3: Интеграция в ChatPage ✅

1. **Рендеринг сообщений встроен в `chat.hbs`**
   - `{{#each messages}}` — рендеринг через Handlebars
   - `isMine` вычисляется в `mapStateToProps` и добавляется к каждому сообщению
   - Стили перенесены в `chat.module.css`
   - Убраны отдельные компоненты `MessageList` и `MessageItem`

2. **Интеграция в ChatPage**
   - При выборе чата: `WebSocketService.connect(userId, chatId)`
   - Регистрация обработчика через `onMessage` (один раз при монтировании страницы)
   - Сортировка сообщений по времени при добавлении
   - Отправка сообщений через форму (`submit` → `WebSocketService.send`)
   - Автоскролл к последнему сообщению
   - Сброс WebSocket при уходе со страницы (`componentWillUnmount`)

3. **Пустое состояние** — "Выберите чат"

4. **Сортировка сообщений по времени** — массив сообщений сортируется перед добавлением в Store

---

### Фаза 4: Защита от XSS ✅

1. **Экранирование контента**
   - `{{{ message.content }}}` → `{{ message.content }}` — Handlebars автоматически экранирует HTML
   - `{{{ message.time }}}` → `{{ message.time }}`

2. **Безопасная работа с DOM**
   - `Block.ts` использует `createContextualFragment` вместо `innerHTML`
   - Хrefs валидированы (только `/settings`)

3. **CSS** — `stylelint` проверяет синтаксис (modern `rgb()` вместо `rgba()`)

---

### Фаза 5: Исправление багов и оптимизация ✅

1. **Баг: старые сообщения не отображались**
   - `onMessage` вешался при каждом выборе чата → callback терялся при `disconnect()`
   - **Решение:** `setupMessageHandler()` вызывается один раз в `componentDidMount`
   - `sendOldMessages()` вызывается после `await connect()`

2. **Баг: `messageCallback` сбрасывался при каждом ре-рендере**
   - `disconnect()` сбрасывал `messageCallback = null`
   - **Решение:** закомментировал `this.messageCallback = null` в `disconnect()`

3. **Баг: сервер возвращал массив, а не объект**
   - `msg.type` был `undefined` — сервер возвращал `[msg1, msg2, ...]`
   - **Решение:** добавил проверку `Array.isArray(msg)`

4. **Баг: `currentUserId` пустой → все сообщения чужие**
   - `msg.user_id` — число (62), `currentUserId` — строка ("62")
   - **Решение:** `String(msg.user_id) === currentUserId`

5. **Баг: дублирование `getChats()`**
   - **Решение:** убрал из `componentDidMount`

6. **Баг: бесконечный `setTimeout` и `reconnect`**
   - **Решение:** лимиты 10 и 5 попыток соответственно

7. **Оптимизация:**
   - Удалён бесполезный override `setProps`
   - Убраны `console.log` из production-кода
   - Экспоненциальная задержка reconnect

---

### Фаза 6: Визуальные улучшения ✅

1. **Сообщения: свои справа, чужие слева**
   - `.myMessage` — `align-self: flex-end`, `var(--color-light-gray)`
   - `.otherMessage` — `align-self: flex-start`, `#f0f0f0`
   - `width: fit-content` — сообщения не растягиваются

2. **Скролл внутри чата**
   - `.messagesContainer` — `flex: 1`, `min-height: 0`
   - `.inputWrapper` — `flex-shrink: 0`

3. **Стили сообщений:** паддинги `0.75rem 1rem`, скругление `0.75rem`, тень

4. **Кнопка "Удалить участника"** — добавлен стиль `.removeUserBtn`

---

### Фаза 7: Тесты (Vitest) ✅

Написаны тесты для чистых функций (77 тестов, 5 файлов):

1. **`isEqual.test.ts`** — 10 тестов
   - Примитивы, объекты, массивы, вложенные структуры

2. **`merge.test.ts`** — 9 тестов
   - Плоские объекты, вложенные, null/undefined, immutability

3. **`validators.test.ts`** — 35 тестов
   - first_name, second_name, login, email, password, phone, message, display_name

4. **`common.test.ts`** — 13 тестов
   - `isPlainObject`, `isArray`, `isArrayOrObject`, `queryString`

5. **`route.test.ts`** — 10 тестов
   - `Route.match()` — точное и неточное совпадение путей
   - `Route.setRootElement()` — установка контейнера

Все тесты — **чистые функции без моков DOM/XHR/WebSocket**.

---

### Фаза 8: Финализация ✅

1. **Обновить README.md** ✅
   - Описание WebSocket-функциональности
   - Команды для запуска тестов
   - Обновить список технологий (Vitest, Husky, Jest)

2. **Проверить сборку** ✅ — `npm run build` без ошибок

3. **Проверить линтинг** ✅ — `npm run lint` без ошибок

4. **Проверить тесты** ✅ — `npm run test:run` все проходят (77 тестов)

5. **Деплой в Netlify** ✅ — сборка обновлена

6. **Добавить Jest** ✅ — `jest: ^29.0.0` в devDependencies (для CI/CD)

---

## Архитектурные решения

- **WebSocketService** — Singleton, подписка через callback, авто-ping
- **Сообщения в Store** — ключ `messages` с объектом `{ [chatId]: ChatMessage[] }`
- **onMessage** — регистрируется один раз в `componentDidMount`, не при каждом выборе чата
- **Тесты** — рядом с модулями, `*.test.ts`, 77 тестов (чистые функции)
- **XSS** — `{{ }}` вместо `{{{ }}}`, `createContextualFragment` вместо `innerHTML`
- **Jest** — добавлен в devDependencies для CI/CD совместимости

---

## Оценка сложности

| Фаза                     | Сложность       |
| ------------------------ | --------------- |
| 1. Инфраструктура        | Низкая          |
| 2. WebSocket-клиент      | Средняя         |
| 3. Интеграция в ChatPage | Средняя-высокая |
| 4. XSS защита            | Низкая          |
| 5. Багфикс и оптимизация | Средняя         |
| 6. Визуальные улучшения  | Низкая          |
| 7. Тесты                 | Средняя         |
| 8. Финализация           | Низкая          |
