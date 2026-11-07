# Мессенджер

Мессенджер на Vanilla JS, TypeScript, PostCSS, Vite, Handlebars.

## Запуск

```bash
npm run dev
```

## Сборка

```bash
npm run build
```

## Предпросмотр

```bash
npm run preview
```

## Деплой

https://middlemessengerpraktikumyandex.netlify.app/

## Страницы

- **Авторизация** — форма с полями login/password, кнопка "Войти", ссылка на регистрацию
- **Регистрация** — форма с полями first_name, second_name, login, email, password, phone
- **Чаты** — список чатов, пустое состояние, поле ввода сообщения
- **Профиль** — аватар, данные пользователя, редактирование данных и пароля
- **404** — страница ошибки "Страница не найдена"
- **500** — страница ошибки "Ошибка сервера"

## Компоненты

- **Input** — поле ввода с валидацией и отображением ошибок
- **Button** — кнопка с текстом
- **Link** — ссылка с кастомной стилизацией
- **ChatList** — список чатов с аватаром, названием, последним сообщением
- **ProfileAvatar** — аватар пользователя с hover-эффектом
- **Modal** — переиспользуемая модалка для добавления пользователей, загрузки файлов

## Архитектура

### Компонентная архитектура (Block)

- Базовый класс `Block<Props>` — аналог React-компонентов на минималках
- Жизненный цикл: `componentDidMount`, `componentWillUnmount`
- Реактивность через `setProps()` → автоматический ре-рендер
- Вложенные компоненты через `registerComponent()`
- Декларативный синтаксис: `{{{ ComponentName prop="value" ref="key" }}}`

### Регистрация компонентов

Компоненты регистрируются в `src/init/app.ts` при инициализации приложения:

```typescript
registerComponent("Input", Input);
registerComponent("Button", Button);
registerComponent("Link", Link);
registerComponent("ChatList", ChatList);
registerComponent("ProfileAvatar", ProfileAvatar);
registerComponent("Modal", Modal);
```

### Валидация форм

- Проверка по `blur` и `submit`
- Правила для всех полей:
  - `first_name`, `second_name` — кириллица/латиница, заглавная первая буква, без пробелов и цифр
  - `login` — 3–20 символов, латиница + цифры + `_` + `-`
  - `email` — обязательны `@` и `.` после него
  - `password` — 8–40 символов, заглавная буква + цифра
  - `phone` — 10–15 цифр, возможен `+` в начале
  - `message` — не пустой
- Регулярные выражения с понятными сообщениями об ошибках
- Ошибки отображаются под полями ввода красным цветом

### Шаблоны компонентов

- Шаблоны вынесены в отдельные `.hbs` файлы
- Каждый компонент имеет свой `.hbs` файл в той же директории
- Шаблоны импортируются через `import template from "./component.hbs"`
- Vite конфигурируется для обработки `.hbs` файлов через `assetsInclude`

## Технологии

- **Vite** — сборщик с HMR
- **TypeScript** — строгая типизация (strict mode)
- **PostCSS + CSS Modules** — стилизация с автопрефиксером
- **Handlebars** — шаблонизатор
- **ESLint + Stylelint + Prettier** — линтинг и форматирование

## Архитектура

### Роутинг (Router, Route)

- **Router** — Singleton, управляет маршрутами и переходами между страницами
- **Route** — представляет один маршрут: URL-путь + компонент
- History API — кнопки «Назад»/«Вперёд» работают корректно
- Маршруты: `/` (Авторизация), `/sign-up` (Регистрация), `/messenger` (Чаты), `/settings` (Профиль), `/404`, `/500`
- При переходе на несуществующий URL — автоматический редирект на `/404`
- Компоненты создаются лениво — при первом посещении маршрута
- В DOM одновременно активна только одна страница (остальные скрыты через `display: none`)

### HTTP-класс (HTTPTransport)

- Обёртка над XHR с Promise
- Поддержка методов: `GET`, `POST`, `PUT`, `DELETE`
- `withCredentials: true` — cookies передаются автоматически
- Обработка ошибок: `onload`, `onabort`, `onerror`, `ontimeout`
- Обработка данных: `FormData`, `JSON`, пустые данные
- Дженерики для типизации ответов `<T>`

### API-классы

- **AuthAPI** — авторизация: `signup`, `signin`, `getUser`, `logout`
- **UserAPI** — пользователи: `profile`, `avatar`, `password`, `get`, `search`
- **ChatAPI** — чаты: `get`, `create`, `delete`, `getUsers`, `getUnreadCount`, `addUser`, `removeUser`, `avatar`

### Хранилище (Store)

- **Singleton Store** — централизованное хранение состояния приложения
- `getState()` — получение состояния
- `setState(path, value)` — установка значения по пути (иммутабельно)
- `subscribe(listener)` — подписка на изменения, возвращает функцию отписки
- `emit()` — уведомление всех подписчиков

### HOC connect

- Обёртка компонента для автоматической подписки на Store
- Принимает компонент и функцию `mapStateToProps`
- При изменении Store — обновляет props только если данные изменились
- Компонент перерендеривается автоматически

### Контроллеры (MVC)

- **AuthController** — `signin`, `signup`, `logout`, `checkAuth`
- **UserController** — `getProfile`, `updateProfile`, `updatePassword`, `updateAvatar`, `searchUsers`
- **ChatController** — `getChats`, `createChat`, `deleteChat`, `getChatUsers`, `getUnreadCount`, `addUserToChat`, `removeUserFromChat`
- Контроллеры вызывают API-классы и управляют Store
- Обработка ошибок — на уровне страниц (переход на `/500` при ошибках API)

### Компонентная архитектура (Block)
