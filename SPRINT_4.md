# Спринт 4

## Задачи на 4 спринт

- Тестирование приложения (Vitest)
- Полная функциональность чата (WebSocket, отправка/получение сообщений)
- Защита от XSS-атак
- Инфраструктура (Husky, аудит зависимостей, vite-plugin-checker)
- Обновление README.md

---

## Что сделано

### Фаза 1: Инфраструктура и подготовка ✅

1. **Ветка `sprint_4`** — создана
2. **Husky + lint-staged**
   - `husky init` — выполнено
   - lint-staged настроен: `prettier --write --ignore-unknown` для всех файлов
   - `.husky/pre-commit` запускает `lint-staged`
   - ⚠️ `tsc`, `stylelint` и `eslint` убраны из pre-commit (не работают корректно через lint-staged на Windows)
   - Проверка запускается отдельно: `npm run lint` и `npm run typecheck`
3. **Vitest**
   - `npm install --save-dev vitest @vitest/ui jsdom`
   - `vitest.config.ts`: `globals: true`, `environment: 'jsdom'`
   - Скрипты: `test`, `test:ui`, `test:run`
4. **Аудит зависимостей** — `npm audit fix`, 0 уязвимостей
5. **vite-plugin-checker** — проверка TS/ESLint/Stylelint во время сборки
6. **Дополнительно:**
   - `.prettierrc` починен (убраны merge-конфликты)
   - `.gitignore` обновлён (добавлен `.gigacode_vsc`)
   - Исправлены TypeScript ошибки (index signature в интерфейсах, типизация `connect`)
   - Исправлены ESLint ошибки (`any`, unused vars, console.error)

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
   - Reconnect при обрыве соединения (код != 1000)
   - Запрос старых сообщений при подключении к чату

---

## TODO

- [x] Фаза 2: WebSocket-клиент (сервис-обёртка)
- [ ] Фаза 3: Интеграция в ChatPage (MessageList, MessageItem)
- [ ] Фаза 4: Защита от XSS
- [ ] Фаза 5: Тесты (Vitest)
- [ ] Фаза 6: Финализация (README, деплой)
