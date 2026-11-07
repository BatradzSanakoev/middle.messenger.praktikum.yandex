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
│   └── validation/
│       ├── validators.ts
│       └── index.ts
└── README.md
```

---

## Что сделано

### Шаг 1: HTTP-слой

- **src/features/api/lib/constants.ts** — константы HTTP-методов:
  - `METHODS = { GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE' } as const`

- **src/features/api/lib/common.ts** — вспомогательные функции:
  - `isPlainObject(value)` — проверка на чистый объект
  - `isArray(value)` — проверка на массив
  - `isArrayOrObject(value)` — проверка на объект или массив
  - `getKey(key, parentKey?)` — формирование ключа `foo[baz]` для вложенных структур
  - `getParams(data, parentKey?)` — рекурсивный сбор пар `[key, value]`, поддержка вложенных объектов и массивов, `undefined` и `null` пропускаются, `encodeURIComponent` для значений
  - `queryString(data)` — валидация входных данных + формирование query string (`key=value&key2=value2`)

- **src/features/api/lib/types.ts** — типизация HTTP-слоя и API:
  - **HTTP-типы:**
    - `PlainObject<T>` — тип для объектов
    - `RequestData` — тип данных для запросов (`Record | FormData | string | number | boolean`)
    - `RequestOptions` — опции запроса (`headers`, `method`, `data`, `responseType`, `timeout`)
    - `BaseError` — базовый интерфейс ошибок с полем `request: XMLHttpRequest`
    - `ApiError extends BaseError` — ошибки сервера (`status`, `statusText`, `response`)
    - `AbortError extends BaseError` — прерванный запрос
    - `NetworkError extends BaseError` — сетевая ошибка
    - `TimeoutError extends BaseError` — таймаут запроса
  - **API-типы:**
    - `SignupRequest` — данные для регистрации
    - `SigninRequest` — данные для входа
    - `ProfileData` — данные профиля
    - `PasswordData` — данные для смены пароля
    - `UserResponse` — ответ с данными пользователя
    - `SearchUser` — результат поиска пользователей
    - `CreateChatData` — данные для создания чата
    - `ChatUser` — пользователь чата
    - `ChatResponse` — ответ с данными чата
    - `UnreadCountResponse` — ответ с количеством непрочитанных

- **src/features/api/lib/index.ts** — экспорт из `constants`, `common` и всех типов из `types`

- **src/features/api/httpTransport.ts** — класс `HTTPTransport`:
  - Методы `get<T>`, `post<T>`, `put<T>`, `delete<T>` — дженерики для типизации ответов
  - Основной метод `request<T>` — XHR + Promise
  - `withCredentials = true` — cookies передаются автоматически
  - Для GET с data — добавляет query string в URL
  - Настраивает заголовки, responseType
  - `onload` — парсит JSON если `Content-Type: application/json`, иначе возвращает text; при ошибочном статусе — reject
  - `onabort`, `onerror`, `ontimeout` — reject с причиной
  - `send()` — пустой для GET, `FormData` для файлов, `JSON.stringify` для объектов
  - `timeout` по умолчанию 5000 мс
  - Без единого `as type` каста — используются `satisfies` для проверки типов ошибок
  - Объединённые импорты: `import { ... } from './lib'` и `import type { ... } from './lib'`

- **src/features/api/index.ts** — экспорт `HTTPTransport` и API-классов из `./endpoints`

### Шаг 2: API слой

- **src/features/api/endpoints/auth-api.ts** — `AuthAPI`:
  - `signup(data)` → `POST /auth/signup` — регистрация пользователя
  - `signin(data)` → `POST /auth/signin` — авторизация
  - `getUser()` → `GET /auth/user` — получение данных текущего пользователя
  - `logout()` → `POST /auth/logout` — выход из системы
  - Импорты: `HTTPTransport` из `../httpTransport`, типы из `../lib`

- **src/features/api/endpoints/user-api.ts** — `UserAPI`:
  - `profile(data)` → `PUT /user/profile` — обновление данных профиля
  - `avatar(avatar)` → `PUT /user/profile/avatar` — обновление аватара (FormData)
  - `password(data)` → `PUT /user/password` — изменение пароля
  - `get(id)` → `GET /user/:id` — получение пользователя по ID
  - `search(data)` → `POST /user/search` — поиск пользователей
  - Импорты: `HTTPTransport` из `../httpTransport`, типы из `../lib`

- **src/features/api/endpoints/chat-api.ts** — `ChatAPI`:
  - `get()` → `GET /chats` — получение списка чатов
  - `create(data)` → `POST /chats` — создание чата
  - `delete(data)` → `DELETE /chats` — удаление чата
  - `getUsers(id)` → `GET /chats/:id/users` — получение пользователей чата
  - `getUnreadCount(id)` → `GET /chats/new/:id` — количество непрочитанных сообщений
  - `addUser(data)` → `PUT /chats/users` — добавление пользователя в чат
  - `removeUser(data)` → `DELETE /chats/users` — удаление пользователей из чата
  - `avatar(avatar)` → `PUT /chats/avatar` — загрузка аватара чата (FormData)
  - Импорты: `HTTPTransport` из `../httpTransport`, типы из `../lib`

- **src/features/api/endpoints/index.ts** — экспорт `AuthAPI`, `UserAPI`, `ChatAPI`

### Шаг 3: Хранилище состояния (Store) и HOC connect

- **src/shared/utils/isEqual.ts** — рекурсивное сравнение объектов:
  - Быстрая проверка `===` для идентичности
  - Проверка типов перед сравнением
  - Рекурсивный обход вложенных структур
  - `Object.prototype.hasOwnProperty.call` для проверки собственных свойств

- **src/shared/utils/merge.ts** — иммутабельное объединение объектов:
  - Создаёт новый объект, не мутируя исходные
  - Вложенные объекты объединяются рекурсивно
  - Массивы заменяются целиком (не объединяются)
  - `Object.prototype.hasOwnProperty.call` для фильтрации унаследованных свойств

- **src/shared/utils/set.ts** — установка значения по вложенному пути:
  - Разбивает путь на ключи (`'user.name'` → `['user', 'name']`)
  - `reduceRight` создаёт вложенную структуру справа налево
  - `merge` объединяет с исходным объектом

- **src/shared/utils/types.ts** — тип `Indexed<T>` для объектов с динамическими ключами

- **src/shared/utils/store/store.ts** — Singleton Store:
  - `getState()` — получение состояния
  - `setState(path, value)` — установка значения по пути (иммутабельно через `set`)
  - `subscribe(listener)` — подписка на изменения, возвращает функцию отписки
  - `emit()` — уведомление всех подписчиков
  - Экспорт по умолчанию — `new Store()` (Singleton)

- **src/shared/utils/store/connect.ts** — HOC `connect(mapStateToProps)`:
  - Принимает компонент и функцию маппинга состояния в props
  - При создании — получает данные из Store и передаёт в `setProps`
  - При изменении Store — проверяет `isEqual`, если данные изменились → `setProps`
  - Компонент перерендеривается только если данные изменились
  - `abstract template` обходится через `as any` с комментарием

- **src/shared/utils/store/index.ts** — экспорт `store` и `connect`

- **src/shared/utils/index.ts** — экспорт всех утилит: `isEqual`, `merge`, `set`, `Indexed`, `store`, `connect`

### Шаг 4: Роутер

- **src/shared/utils/renderDOM.ts** — утилита для вставки компонента в DOM:
  - Очищает контейнер от старого контента
  - Вставляет DOM-элемент нового компонента
  - Проверка на `null` для `rootElement` и `component.element()`

- **src/features/router/route.ts** — класс `Route`:
  - `match(pathname)` — проверка совпадения пути
  - `leave()` — скрыть компонент (`hide()`)
  - `render()` — создать компонент (если нет) или показать (если есть)
  - Компоненты создаются лениво — при первом посещении маршрута
  - Тип `BlockConstructor` для обхода абстрактности `Block`

- **src/features/router/router.ts** — класс `Router` (Singleton):
  - `use(pathname, Block)` — регистрация маршрута
  - `start(rootElement?)` — запуск роутера, подписка на `popstate`
  - `_onRoute(pathname)` — обработчик перехода: скрывает старую, показывает новую
  - `go(pathname)` — программный переход через History API
  - Контейнер задаётся через `start(main)` — страницы рендерятся в `<main>`
  - Singleton через `private constructor()` + `static getInstance()`

- **src/features/router/index.ts** — экспорт `Router`, `Route`

- **src/init/app.ts** — подключение роутера:
  - Убран hash-based роутинг (`#login`, `#register`, и т.д.)
  - Навигация использует реальные пути (`/`, `/sign-up`, `/messenger`, `/settings`)
  - Клик по навигации вызывает `Router.getInstance().go(path)`
  - Регистрация всех маршрутов: `/`, `/sign-up`, `/messenger`, `/settings`, `/404`, `/500`
  - Запуск роутера с контейнером: `router.start(main)`

### Шаг 4.1: Исправление бага роутера

- **src/shared/utils/renderDOM.ts** — исправлен баг, из-за которого страницы становились скрытыми (`display: none`) при повторных переходах:
  - **Было:** `rootElement.replaceChild(element, rootElement.firstChild)` — физически удалял DOM-элементы предыдущих страниц
  - **Стало:** `rootElement.appendChild(element)` — все страницы остаются в DOM, переключение через `display: none`
  - **Причина:** `replaceChild` удалял DOM-элемент страницы при переходе, а при возврате `show()` не мог убрать `display: none` с элемента, которого больше нет в DOM

- **src/features/router/route.ts** — исправлена TypeScript-ошибка:
  - Добавлена проверка `if (this.block)` перед вызовом `render()` для корректной типизации
  - `this.block` имеет тип `Block | null`, TypeScript не делал narrowing после присваивания

- **src/features/router/router.ts** — исправлена TypeScript-ошибка:
  - `private rootElement: Element` инициализирован сразу `document.body as Element`
  - Убрано предупреждение о необязательной инициализации свойства

### Шаг 5: Контроллеры (MVC) ✅ ВЫПОЛНЕНО

- **AuthController** — `src/features/controllers/auth-controller.ts`:
  - `signin(login, password)` — вход, сохраняет user в Store, редирект на `/messenger`
  - `signup(data)` — регистрация, сохраняет user в Store, редирект на `/messenger`
  - `logout()` — выход, очищает user из Store, редирект на `/`
  - `checkAuth()` — проверка авторизации, если не авторизован — редирект на `/`
  - Все методы `async/await`

- **UserController** — `src/features/controllers/user-controller.ts`:
  - `getProfile(userId)` — получение профиля, сохраняет в Store
  - `updateProfile(data)` — обновление данных профиля, обновляет Store
  - `updatePassword(data)` — обновление пароля (без изменения Store)
  - `updateAvatar(avatar)` — обновление аватара, обновляет Store
  - `searchUsers(login)` — поиск пользователей

- **ChatController** — `src/features/controllers/chat-controller.ts`:
  - `getChats()` — получение списка чатов, сохраняет в Store
  - `createChat(data)` — создание чата, обновляет список в Store
  - `deleteChat(chatId)` — удаление чата, обновляет список в Store
  - `getChatUsers(chatId)` — получение пользователей чата
  - `getUnreadCount(chatId)` — получение количества непрочитанных
  - `addUserToChat(userId, chatId)` — добавление пользователя в чат
  - `removeUserFromChat(userId, chatId)` — удаление пользователя из чата

- Экспорты: `src/features/controllers/index.ts` → `src/features/index.ts`
- Импорт из `features/api` — относительные пути (`../api`), из `shared` — алиас `@shared/`
- Исправление TypeScript-ошибок: приведение типов `store.getState().chats as ChatResponse[]`, `await` вместо `return` для `addUser`/`removeUser`

### Шаг 6: Интеграция с API на страницах

- **LoginPage:** вызов `AuthController.login()` при отправке формы
- **RegisterPage:** вызов `AuthController.register()` при отправке формы
- **ChatPage:** вызов `ChatController.getChats()` при монтировании
- **ProfilePage:** вызов `UserController` для обновления данных/пароля/аватара
- Кнопка выхода → `AuthController.logout()` → переход на `/`

### Шаг 7: Работа с файлами

- Загрузка аватара пользователя — `PUT /user/profile/avatar` с `FormData`
- Загрузка аватара чата — `PUT /chats/avatar` с `FormData`

### Шаг 8: Обновление страниц

- Убрать мок-данные, подгружать реальные через API
- Обработка ошибок (переход на `/404` или `/500` при ошибках)
- Сохранение состояния авторизации при перезагрузке (`GET /auth/user`)
- Подписка компонентов на Store через `connect`

### Шаг 9: Обновление документации

- Обновить `README.md` с информацией о роутинге, API, HTTP-классе, Store, контроллерах
