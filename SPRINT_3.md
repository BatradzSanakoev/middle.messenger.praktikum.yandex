# Спринт 3

## Задачи на 3 спринт

- Роутинг приложения (Router, Route, History API)
- Интеграция с HTTP API (регистрация, вход, выход, профиль, чаты)
- Класс для работы с запросами (XHR + Promise, GET/POST/PUT/DELETE)
- Хранилище состояния (Store) и HOC connect
- Контроллеры (MVC-паттерн)
- Работа с файлами (FormData, multipart/form-data)
- Обновить README.md

---

## Функциональные требования

### 1. Роутинг приложения
- Настроить маршруты для всех страниц: `/`, `/sign-up`, `/settings`, `/messenger`, `/404`, `/500`
- Переходы по клику, корректная история браузера (кнопки «Назад»/«Вперёд»)
- При перезагрузке пользователь остаётся на той же странице
- В DOM одновременно активна только одна страница

### 2. Интеграция с HTTP API
- Регистрация, вход, выход из системы
- Управление профилем (данные, аватар, пароль)
- Работа с чатами (список, создание, добавление/удаление пользователей)
- После регистрации — перенаправление на страницу чата

### 3. Класс для работы с запросами
- Только Promise и XHR (fetch, axios запрещены)
- Поддержка методов GET, POST, PUT, DELETE
- Query string для GET, body для остальных методов

---

## Нефункциональные требования

- Сборка через Vite без ошибок
- Ветка `sprint_3`
- Только инструменты из предыдущих спринтов (TypeScript, PostCSS, Handlebars)
- Обновить README.md

---

## API ручки

### Авторизация
- `POST /auth/signup` — регистрация
- `POST /auth/signin` — авторизация
- `GET /auth/user` — информация о текущем пользователе (по cookie)
- `POST /auth/logout` — выход из системы

### Пользователи
- `PUT /user/profile` — изменение данных
- `PUT /user/profile/avatar` — обновление аватара (multipart/form-data)
- `PUT /user/password` — изменение пароля
- `GET /user/:id` — информация о пользователе по ID
- `POST /user/search` — поиск пользователей (макс. 10)

### Чаты
- `GET /chats` — список чатов
- `POST /chats` — создание чата
- `DELETE /chats` — удаление чата
- `GET /chats/:id/users` — пользователи чата
- `GET /chats/new/:id` — количество непрочитанных сообщений
- `PUT /chats/avatar` — аватар чата (multipart/form-data)
- `PUT /chats/users` — добавить пользователя в чат
- `DELETE /chats/users` — удалить пользователей из чата

---

## Структура проекта (обновлённая)

```
src/
├── main.ts
├── styles/
│   └── global.css
├── init/
│   ├── app.ts
│   └── app.module.css
├── shared/
│   ├── ui/
│   │   ├── block/
│   │   ├── button/
│   │   ├── input/
│   │   ├── link/
│   │   ├── chat-list/
│   │   ├── profile-avatar/
│   │   └── modal/
│   └── utils/
│       ├── isEqual.ts        — рекурсивное сравнение объектов
│       ├── merge.ts          — merge (иммутабельное объединение)
│       ├── set.ts            — set (установка по вложенному пути)
│       ├── types.ts          — Indexed
│       ├── store/
│       │   ├── store.ts      — Singleton Store
│       │   ├── connect.ts    — HOC connect
│       │   └── index.ts      — экспорт
│       └── index.ts          — экспорт всех утилит
├── pages/
│   ├── login/
│   ├── register/
│   ├── 404/
│   ├── 500/
│   ├── chat/
│   └── profile/
├── helpers/
├── features/
│   ├── api/                    ← [Спринт 3] HTTP-слой и API-классы
│   │   ├── lib/
│   │   │   ├── constants.ts    — METHODS (GET, POST, PUT, DELETE)
│   │   │   ├── common.ts       — isPlainObject, queryString, getParams
│   │   │   ├── types.ts        — все типы (HTTP + API)
│   │   │   └── index.ts        — экспорт из lib
│   │   ├── endpoints/
│   │   │   ├── auth-api.ts     — AuthAPI (signup, signin, getUser, logout)
│   │   │   ├── user-api.ts     — UserAPI (profile, avatar, password, get, search)
│   │   │   ├── chat-api.ts     — ChatAPI (get, create, delete, getUsers, getUnreadCount, addUser, removeUser, avatar)
│   │   │   └── index.ts        — экспорт API-классов
│   │   ├── httpTransport.ts    — класс HTTPTransport (XHR + Promise)
│   │   └── index.ts            — экспорт всех API-классов
│   ├── form/
│   │   ├── validateForm.ts
│   │   └── index.ts
│   ├── validation/
│   │   ├── validators.ts
│   │   └── index.ts
│   └── controllers/
│       ├── auth-controller.ts
│       ├── user-controller.ts
│       ├── chat-controller.ts
│       └── index.ts
└── README.md
```

---

## Что сделано

### Шаг 1: HTTP-слой ✅

- **src/features/api/lib/constants.ts** — константы HTTP-методов
- **src/features/api/lib/common.ts** — вспомогательные функции: `isPlainObject`, `isArray`, `queryString`
- **src/features/api/lib/types.ts** — типизация HTTP-слоя и API
- **src/features/api/httpTransport.ts** — класс `HTTPTransport` (XHR + Promise)
- **src/features/api/index.ts** — экспорт всех API-классов

### Шаг 2: API слой ✅

- **AuthAPI** — `signup`, `signin`, `getUser`, `logout`
- **UserAPI** — `profile`, `avatar`, `password`, `get`, `search`
- **ChatAPI** — `get`, `create`, `delete`, `getUsers`, `getUnreadCount`, `addUser`, `removeUser`, `avatar`

### Шаг 3: Хранилище состояния (Store) и HOC connect ✅

- **isEqual.ts** — рекурсивное сравнение объектов
- **merge.ts** — иммутабельное объединение объектов
- **set.ts** — установка значения по вложенному пути
- **store.ts** — Singleton Store (`getState`, `setState`, `subscribe`, `emit`)
- **connect.ts** — HOC `connect(mapStateToProps)` с оптимизацией через `isEqual`

### Шаг 4: Роутер ✅

- **renderDOM.ts** — утилита для вставки компонента в DOM
- **route.ts** — класс `Route` (маршрут: URL + компонент)
- **router.ts** — класс `Router` (Singleton, управление маршрутами)
- **app.ts** — подключение роутера, замена hash-роутинга на real paths
- **Исправление бага:** замена `replaceChild` на `appendChild` (страницы остаются в DOM)
- **Исправление:** скрытие всех маршрутов при переходе вместо `currentRoute.leave()`

### Шаг 5: Контроллеры (MVC) ✅

- **AuthController** — `signin`, `signup`, `logout`, `checkAuth`
- **UserController** — `getProfile`, `updateProfile`, `updatePassword`, `updateAvatar`, `searchUsers`
- **ChatController** — `getChats`, `createChat`, `deleteChat`, `getChatUsers`, `getUnreadCount`, `addUserToChat`, `removeUserFromChat`

### Шаг 6: Интеграция с API на страницах ✅

- **LoginPage:** вызов `AuthController.signin()` при отправке формы
- **RegisterPage:** вызов `AuthController.signup()` при отправке формы
- **ChatPage:** вызов `ChatController.getChats()` при каждом переходе на страницу (`onEnter`)
- **ProfilePage:** вызов `UserController.getProfile()` при каждом переходе на страницу
- **Сохранение данных:** `UserController.updateProfile()` при нажатии «Сохранить»
- **Смена пароля:** `UserController.updatePassword()` при нажатии «Сохранить» (с проверкой совпадения)
- **Загрузка аватара:** `UserController.updateAvatar()` через модалку с валидацией файла
- **Logout:** `AuthController.logout()` при нажатии «Выйти»
- Обработка ошибок — переход на `/404` или `/500` при ошибках API

### Шаг 7: Работа с файлами ✅

- Загрузка аватара пользователя — `PUT /user/profile/avatar` с `FormData`
- Загрузка аватара чата — `PUT /chats/avatar` с `FormData`
- Валидация файла: расширение (jpg, jpeg, png, gif, webp), размер (до 5 МБ)
- Отображение имени выбранного файла в модалке

### Шаг 8: Подписка на Store через connect ✅

- **ChatPage:** `connect(ChatPage, mapStateToProps)` — данные чатов обновляют props при изменении Store
- **ProfilePage:** `connect(ProfilePage, mapStateToProps)` — данные пользователя обновляют props при изменении Store
- **mapStateToProps:** извлекает данные из Store, добавляет BASE_URL для аватара

### Шаг 9: onEnter — вызов при каждом переходе на страницу ✅

- **Block.ts:** добавлен хук `onEnter()` (protected, по умолчанию пустой)
- **route.ts:** при повторном переходе вызывается `onEnter()` перед `show()`
- **ChatPage:** `onEnter()` вызывает `ChatController.getChats()`
- **ProfilePage:** `onEnter()` вызывает `UserController.getProfile()` + сбрасывает UI-состояние формы пароля

### Шаг 10: Сохранение состояния авторизации при перезагрузке ✅

- **app.ts:** `AuthController.checkAuth()` вызывается при старте приложения
- Загружает данные пользователя из `GET /auth/user` и сохраняет в Store
- Если не авторизован — редирект на `/`

### Шаг 11: Исправления и доработки

- **connect.ts:** добавлен явный возвращаемый тип `: T` для корректной типизации HOC
- **chat.ts:** `chats` типизирован как `ChatItem[]` вместо `unknown[]`
- **chat.ts:** `styles` включён в `mapStateToProps` для корректной передачи через `connect`
- **chat/index.ts:** переименование `ConnectedChatPage as ChatPage` для корректного экспорта
- **ProfilePage:** `saveData()` и `savePassword()` — сбор FormData, вызов API, обработка ошибок
- **ProfilePage:** сброс формы пароля при каждом входе на страницу
- **ProfilePage:** очистка полей пароля после успешного сохранения
- **ProfilePage:** `componentWillUnmount` — закрытие модалки аватара при уходе со страницы
- **ProfileModal:** обработка выбора файла, отображение имени файла, валидация, отправка на сервер
- **Modal:** кнопка ищется по `data-role` вместо `ref` (ref удаляется при компиляции)
- **profile-modal.hbs:** добавлен `<span data-role="file-name">` для отображения имени файла
- **password.ts:** `PasswordData` изменён на camelCase (`oldPassword`, `newPassword`)

### Шаг 11: Обработка ошибок

- **router.ts** — `_onRoute()`: при неизвестном маршруте — редирект на `/404`
- **router.ts** — исправлен singleton: `getInstance()` возвращает один экземпляр
- **LoginPage** — `try/catch` при `AuthController.signin()` → `/500`
- **RegisterPage** — `try/catch` при `AuthController.signup()` → `/500`
- **ChatPage** — `try/catch` при `ChatController.getChats()` → `/500`
- **ProfilePage** — `try/catch` при `UserController.getProfile()` → `/500`
- **ProfilePage** — `try/catch` при `UserController.updateProfile()` → `/500`
- **ProfilePage** — `try/catch` при `UserController.updatePassword()` → `/500`

### Шаг 12: Обновление документации

- **README.md** — добавлены разделы: Роутинг, HTTP-класс, API-классы, Store, HOC connect, Контроллеры
