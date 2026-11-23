## Проект

Мессенджер

## Технологический стек

Vanilla JS, TypeScript, PostCss, Vite, Handlebars

## Макет

https://www.figma.com/design/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=1-507&t=IUhcn9p0idqP2fMp-0

---

# Спринт 1

## Задачи на 1 спринт

- Настроить сборку и запуск проекта с помощью Vite
- Добавить в проект Handlebars и PostCss
- Создать базовую структуру проекта
- Прототипировать и добавить в проект страницы из макета Figma (обязательно использовать для данных целей Handlebars)

## Страницы

1. Авторизация

- Форма с полями: login, password.
- Кнопка отправки формы (варианты текста: «Вход», «Войти», Enter, Sign in).
- Ссылка на страницу регистрации (варианты: «Ещё не зарегистрированы?», «Нет аккаунта?», «Зарегистрироваться», Sign up и другие).

2. Регистрация

- Форма с полями: first_name, second_name, login, email, password, phone.
- Кнопка отправки формы (варианты: «Зарегистрироваться», Sign up, Registration и другие).

3. Страница ошибки 404
4. Страница ошибки 5хх

5. Страница со списком чатов и содержимого выбранного чата

- Поле для ввода сообщения с именем message.
- Возможность создания страницы-заглушки для этого спринта.

6. Профиль пользователя

- Поля для изменения информации: first_name, second_name, display_name, login, email, phone.
- Поле для изменения аватара: avatar.
- Поля для изменения пароля: old_password, new_password.

7. Различные модалки (Добавление пользователя, загрузка файлов и тд)

## Текущее состояние

- Настроена сборка и запуск проекта
- Добавлены все необходимые плагины и библиотеки
- Создана базовая структура проекта
- Внедрён TypeScript со строгими настройками
- Реализована компонентная архитектура на базе класса Block
- Настроена валидация форм (blur + submit)
- Реализован роутинг (Router, History API)
- Интегрировано HTTP API (XHR + Promise)
- Реализовано хранилище состояния (Store) и HOC connect
- Внедрён MVC-паттерн (Controller)
- Реализована работа с файлами (FormData, аватары)

## Что сделано

### Настроенная сборка

- Vite с поддержкой HMR
- TypeScript со строгими настройками (`noImplicitAny`, `strictNullChecks`, `sourceMap`)
- PostCSS с CSS Modules
- Handlebars для шаблонов
- ESLint, Stylelint, Prettier для линтинга

### Реализованные страницы

- **Авторизация** — форма с полями login/password, кнопка "Войти", ссылка на регистрацию, интеграция с API
- **Регистрация** — форма с полями first_name, second_name, login, email, password, phone, интеграция с API, редирект на `/messenger`
- **Страница 404** — заглушка с текстом "404 — Страница не найдена"
- **Страница 500** — заглушка с текстом "500 — Ошибка сервера"
- **Список чатов** — две колонки: список чатов из API, лента переписки, поле ввода сообщения, управление участниками (добавление/удаление), создание/удаление чатов
- **Профиль пользователя** — аватар с hover-эффектом, данные пользователя, переключение режимов (изменить данные/пароль), загрузка аватара, интеграция с API
- **Модалка загрузки аватара** — общий компонент Modal, file input, кнопка "Поменять", валидация файла

### Реализованные компоненты

- **Button** — кнопка с текстом
- **Input** — поле ввода с поддержкой ошибок и валидации
- **Link** — компонент ссылки
- **ChatList** — список чатов с аватаром, названием, последним сообщением, бейджем непрочитанных, выделением выбранного
- **ProfileAvatar** — аватар с hover-оверлеем
- **Modal** — переиспользуемый компонент модалки
- **AddUserModal** — модалка добавления пользователя в чат
- **RemoveUserModal** — модалка удаления пользователя из чата

### Архитектура

- **Block** — базовый класс компонентов с жизненным циклом (`componentDidMount`, `componentWillUnmount`, `onEnter`)
- **registerComponent** — регистрация компонентов в Handlebars
- **Store** — Singleton хранилище состояния с подпиской (`getState`, `setState`, `subscribe`, `emit`)
- **connect** — HOC для подписки компонентов на Store
- **Router** — Singleton роутер с History API
- **HTTPTransport** — класс для HTTP-запросов (XHR + Promise)
- **API-классы** — AuthAPI, UserAPI, ChatAPI
- **Контроллеры** — AuthController, UserController, ChatController
- **Валидация** — validateForm утилита + validators с правилами для всех полей

### Особенности реализации

- Минималистичный стиль (белый/черный/серый)
- Шрифт Caveat
- Семантические теги (main, aside, form, ul/li)
- Компоненты через `registerComponent` (без Handlebars-хелперов)
- Aliases для импортов (@shared, @pages и т.д.)
- Безопасная работа с DOM (`createContextualFragment`, без innerHTML)
- Без внешних отступов (margin)
- CSS-переменные для всех цветов в `:root`
- Поддержка `disabled` в компоненте Input
- Атрибут `alt` для accessibility на всех img
- Валидация по blur и submit
- Подписка на Store через connect с оптимизацией через isEqual
- Роутинг с History API (без hash)
- Состояние авторизации сохраняется при перезагрузке
- Обработка ошибок API (переход на 404/500)

---

# Спринт 2

## Задачи на 2 спринт

1. Внедрение TypeScript — миграция JS → TS, строгая типизация, проверка типов в сборке
2. Компонентная архитектура — базовый класс Block, жизненный цикл, реактивность, вложенные компоненты
3. Реализация страницы чатов — клиентская генерация, список чатов + лента переписки
4. Валидация форм — единый механизм с blur + submit проверками
5. Сбор данных из форм — console.log объекта с полями при отправке
6. MVC-архитектура — View (Block), Model (сервисы), Controller

## Функциональные требования

### 1. TypeScript

- Миграция всего клиентского кода на TypeScript
- Строгая типизация в `tsconfig.json`
- `tsc --noEmit` в процессе сборки
- Типизация всех компонентов, интерфейсов, API

### 2. Компонентная архитектура

- Базовый класс `Block<Props>` — «React на минималках»
- Жизненный цикл: `componentDidMount`, `componentWillUnmount`
- Реактивность через `setProps()`
- Вложенные компоненты через Handlebars-хелперы (`registerComponent`)
- Ссылки на DOM-элементы через `ref` атрибут
- Обработка событий через `events` объект
- Компоненты: инпуты, формы, кнопки, сообщения в чате

### 3. Страница чатов

- Список чатов + лента переписки
- Поле ввода сообщения: `name="message"`
- Клиентская генерация страниц

### 4. Валидация форм

- Проверка по `blur` и `submit`
- Правила:
  - `first_name`, `second_name` — кириллица/латиница, первая буква заглавная, без пробелов/цифр, только дефис
  - `login` — 3–20 символов, латиница + цифры + `_` + `-`, не только цифры
  - `email` — обязательны `@` и `.` после него
  - `password` — 8–40 символов, заглавная буква + цифра
  - `phone` — 10–15 цифр, возможен `+` в начале
  - `message` — не пустой
- Регулярные выражения
- Формы: авторизация, регистрация, профиль, отправка сообщения

### 5. Сбор данных

- `console.log` объекта с полями при отправке
- Корректная обработка типов `input`

### 6. MVC-архитектура

- **View** — `Block` + наследники, генерация через Handlebars
- **Model** — сервисы и модули для бизнес-логики и данных
- **Controller** — взаимодействие View и Model

## Нефункциональные требования

### Настройка TypeScript

```json
{
  "noImplicitAny": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "sourceMap": true,
  "strictNullChecks": true
}
```

### Качество кода

- ESLint с проверкой TypeScript
- Stylelint для CSS
- EditorConfig
- Команда `npm run lint`

### Архитектура

- Единообразная структура папок
- Правильные экспорты/импорты
- Декомпозиция, минимальная связность

### Ограничения библиотек

- Только: TypeScript, PostCSS, Handlebars
- Никаких фреймворков

### Типизация

- Избегать `any`
- Использовать `unknown` / `never` где возможно
- Без `@ts-ignore`, `@ts-expect-error`
- Типизация props компонентов

### Техническая конфигурация

- Порт 3000
- `npm run start` — сборка + запуск
- Сборка Vite без ошибок
- Ветка `sprint_2`

### Развёртывание

- Обновить README.md
- Сборка в Netlify
- Ветка `main` — только исходники

## Текущее состояние

- Базовая структура из Спринта 1 готова
- ESLint + Prettier настроены и работают (0 ошибок)
- Базовый класс Block реализован
- Порядок импортов задаётся вручную (обычные → типы)

## Что сделано

### Шаг 1: Подготовка

- **tsconfig.json** — добавлены строгие настройки: `noImplicitAny: true`, `strictNullChecks: true`, `sourceMap: true`
- Ветка `sprint_2` активна

### Шаг 2: Базовый класс Block

- **src/shared/ui/block/block.ts** — базовый абстрактный класс `Block<Props>`:
  - `abstract template` — шаблон Handlebars
  - `props`, `domElement`, `children`, `refs`, `events` — свойства
  - `element()` — ленивый рендер DOM-элемента
  - `setProps()` — обновление свойств + ре-рендер
  - `render()` / `compile()` — компиляция и замена в DOM
  - `componentDidMount()` / `componentWillUnmount()` — хуки жизненного цикла
  - `attachListeners()` / `removeListeners()` — управление событиями
  - Поддержка вложенных компонентов через `__children` и `__refs`
  - Named export (`export class Block`)
- **src/shared/ui/block/registerComponent.ts** — хелпер регистрации компонентов в Handlebars:
  - `registerComponent(componentName, Component)` — регистрация
  - Генерация `data-component-hbs-id` для заглушек
  - Обработка `ref` из hash
  - Сохранение `__children` с функцией `embed`
- **src/shared/ui/block/index.ts** — экспорты `Block` и `registerComponent`

### Инструментарий

- **eslint.config.ts** — отключена сортировка импортов (порядок задаётся вручную: обычные → типы)
- **eslint.config.ts** — исключены `package-lock.json` и `tsconfig.json` из JSON-линтера
- **eslint.config.ts** — отключено `css/no-invalid-properties` (CSS-переменные объявлены в global.css)
- **.prettierignore** — создан, исключены `node_modules/`, `dist/`, `coverage/`
- **.prettierrc** — добавлены явные настройки: `trailingComma: "es5"`, `tabWidth: 2`, `printWidth: 100`
- **package.json** — обновлены скрипты: `lint` (eslint + prettier), `lint:fix` (eslint --fix + prettier --write)

### Шаг 3.1: Рефакторинг Input

- **src/shared/ui/input/input.ts** — переписан на `Block`:
  - `static componentName = "Input"`
  - `protected template` — HBS-шаблон как template string
  - `interface InputProps extends BlockOwnProps` с `styles: typeof inputStyles`
  - `constructor` передаёт `styles: inputStyles` через `super`
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("Input", Input)`
- **src/shared/ui/block/index.ts** — добавлен экспорт `BlockOwnProps`
- **src/shared/ui/index.ts** — убран `inputTemplate`
- **src/helpers/handlebars-helpers.ts** — убран хелпер `input`, добавлена регистрация через `registerComponent`
- **src/pages/login/login.hbs** — `{{#input}}...{{/input}}` → `{{{ Input ... }}}`
- **src/pages/register/register.hbs** — аналогично
- **src/pages/profile/profile.hbs** — аналогично
- Удалено: `input.hbs`, `input.template.ts`

### Шаг 3.2: Рефакторинг Button

- **src/shared/ui/button/button.ts** — переписан на `Block`:
  - `static componentName = "Button"`
  - `protected template` — HBS-шаблон как template string
  - `interface ButtonProps extends BlockOwnProps` с `styles: typeof buttonStyles`
  - `constructor` передаёт `styles: buttonStyles` через `super`
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("Button", Button)`
- **src/shared/ui/button/index.ts** — убран `buttonTemplate`
- **src/shared/ui/index.ts** — убран `buttonTemplate`
- **src/helpers/handlebars-helpers.ts** — убран хелпер `button`, добавлена регистрация через `registerComponent`
- **src/pages/login/login.hbs** — `{{#button}}...{{/button}}` → `{{{ Button ... }}}`
- **src/pages/register/register.hbs** — аналогично
- **src/pages/profile/profile.hbs** — аналогично
- Удалено: `button.hbs`, `button.template.ts`

### Шаг 3.3: Рефакторинг Link

- **src/shared/ui/link/link.ts** — переписан на `Block`:
  - `static componentName = "Link"`
  - `protected template` — HBS-шаблон как template string
  - `interface LinkProps extends BlockOwnProps` с `styles: typeof linkStyles`
  - `constructor` передаёт `styles: linkStyles` через `super`
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("Link", Link)`
- **src/shared/ui/link/index.ts** — убран `linkTemplate`
- **src/shared/ui/index.ts** — убран `linkTemplate`
- **src/helpers/handlebars-helpers.ts** — убран хелпер `link`, добавлена регистрация через `registerComponent`
- **src/pages/login/login.hbs** — `{{#link}}...{{/link}}` → `{{{ Link ... }}}`
- **src/pages/register/register.hbs** — аналогично
- Удалено: `link.hbs`, `link.template.ts`

### Шаг 3.4: Рефакторинг ChatItem

- **src/shared/ui/chat-item/chat-item.ts** — переписан на `Block`:
  - `static componentName = "ChatItem"`
  - `protected template` — HBS-шаблон как template string
  - `interface ChatItemData extends BlockOwnProps` с `styles: typeof chatItemStyles`
  - `constructor` передаёт `styles: chatItemStyles` через `super`
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("ChatItem", ChatItem)`
- **src/shared/ui/chat-item/index.ts** — убран `chatItemTemplate`
- **src/shared/ui/index.ts** — убран `chatItemTemplate`
- **src/helpers/handlebars-helpers.ts** — убран хелпер `chatItem`, добавлена регистрация через `registerComponent`
- Удалено: `chat-item.hbs`, `chat-item.template.ts`

### Шаг 3.5: Рефакторинг ProfileAvatar

- **src/shared/ui/profile-avatar/profile-avatar.ts** — переписан на `Block`:
  - `static componentName = "ProfileAvatar"`
  - `protected template` — HBS-шаблон как template string
  - `interface ProfileAvatarData extends BlockOwnProps` с `styles: typeof profileAvatarStyles`
  - `constructor` передаёт `styles: profileAvatarStyles` через `super`
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("ProfileAvatar", ProfileAvatar)`
- **src/shared/ui/profile-avatar/index.ts** — убран `profileAvatarTemplate`
- **src/shared/ui/index.ts** — убран `profileAvatarTemplate`
- **src/helpers/handlebars-helpers.ts** — убран хелпер `profileAvatar`, добавлена регистрация через `registerComponent`
- **src/pages/profile/profile.hbs** — `{{#profileAvatar}}...{{/profileAvatar}}` → `{{{ ProfileAvatar ... }}}`
- Удалено: `profile-avatar.hbs`, `profile-avatar.template.ts`

### Шаг 3.6: Рефакторинг Modal

- **src/shared/ui/modal/modal.ts** — переписан на `Block`:
  - `static componentName = "Modal"`
  - `protected template` — HBS-шаблон как template string
  - `interface ModalOptions extends BlockOwnProps` с `styles: typeof modalStyles`
  - `constructor` передаёт `styles: modalStyles` через `super`
  - Сохранены методы `show()` и `close()`
  - Шаблон использует `{{{ Button text=buttonText }}}` вместо `{{#button}}`
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("Modal", Modal)`
- **src/shared/ui/modal/index.ts** — убран `modalTemplate`
- **src/shared/ui/index.ts** — убран `modalTemplate`
- **src/helpers/handlebars-helpers.ts** — убран хелпер `modal`, добавлена регистрация через `registerComponent`
- **src/pages/profile/profile-modal.ts** — добавлен `styles` в props Modal
- Удалено: `modal.hbs`, `modal.template.ts`

### Шаг 3.7: Создание ChatList и удаление ChatItem

- **src/shared/ui/chat-list/chat-list.ts** — новый компонент `ChatList extends Block`:
  - `static componentName = "ChatList"`
  - `protected template` — HBS-шаблон с `{{#each chats}}` внутри
  - `interface ChatListProps extends BlockOwnProps` с `chats` и `styles: typeof chatListStyles`
  - `constructor` передаёт `styles: chatListStyles` через `super`
  - Убран `ChatItemData`, данные чатов встроены в `ChatListProps`
- **src/shared/ui/chat-list/chat-list.module.css** — стили (перенесены из `chat-item.module.css`)
- **src/shared/ui/chat-list/index.ts** — экспорты `ChatList`, `ChatListProps`, `chatListStyles`
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("ChatList", ChatList)`
- **src/shared/ui/index.ts** — убран `ChatItem`, добавлен `ChatList`
- **handlebars-helpers.ts** — убран хелпер `chatItem`, добавлена регистрация `ChatList`
- **src/pages/chat/chat.hbs** — `{{#each chats}}{{#chatItem this}}{{/chatItem}}{{/each}}` → `{{{ ChatList }}}`
- **src/pages/chat/chat.ts** — создаёт `ChatList({ chats, styles })` и рендерит
- Удалено: `src/shared/ui/chat-item/` (полный каталог), `chat-item.hbs`, `chat-item.template.ts`

---

# Спринт 2.2 — Валидация форм и утилита validateForm

## Задачи

- Убрать компонент Form как Block-компонент (проблемы с block-хелперами в Handlebars)
- Создать утилиту `validateForm` для валидации всех форм
- Интегрировать валидацию в LoginPage, RegisterPage, ChatPage, ProfilePage
- Реализовать валидацию по submit с показом ошибок и сбором данных

## Что сделано

### Удаление компонента Form

- Удалена директория `src/features/form/` (form.ts, form.hbs, form.module.css)
- Убран импорт и `registerComponent("Form", Form)` из `app.ts`
- Убран экспорт Form из `src/features/index.ts`

### Утилита validateForm

- **src/features/form/validateForm.ts** — новая утилита для валидации форм:
  - Принимает `HTMLFormElement`
  - Очищает существующие ошибки перед валидацией
  - Проходит по всем инпутам с `data-validation-key`
  - Валидирует через функцию `validate` из `validation/validators.ts`
  - Показывает ошибки под инпутами (создаёт `<span class="error">`)
  - Собирает данные формы через `FormData` и выводит в консоль
  - Возвращает `boolean` — есть ли ошибки
- **src/features/form/index.ts** — экспорт `validateForm`

### Страница авторизации (LoginPage)

- **src/pages/login/login.hbs** — заменён `<Form class="{{ styles.form }}">` на `<form class="{{ styles.form }}">`
- **src/pages/login/login.ts** — добавлен `this.events` с обработчиком `submit`:
  - `e.preventDefault()` для предотвращения перезагрузки
  - Вызов `validateForm(form)` для валидации
  - Сбор данных через `FormData`

### Страница регистрации (RegisterPage)

- **src/pages/register/register.hbs** — заменён `<Form>` на `<form>`
- **src/pages/register/register.ts** — добавлен `this.events` с обработчиком `submit`
- Вызывает `validateForm(form)` при отправке

### Страница чатов (ChatPage)

- **src/pages/chat/chat.hbs** — поле ввода + кнопка обернуты в `<form class="{{ styles.inputContainer }}">`
- **src/pages/chat/chat.ts** — добавлен `this.events` с обработчиком `submit`
- Вызывает `validateForm(form)` при отправке сообщения

### Страница профиля (ProfilePage)

- **src/pages/profile/profile.hbs** — полная переработка структуры:
  - Две отдельные формы: `profile-form-data` и `profile-form-password`
  - Две кнопки "Сохранить": `save-data` и `save-password`
  - Каждая форма содержит только свои инпуты
  - Все инпуты обернуты в `inputWrapper` для корректной валидации
  - Сохранены `data-role` атрибуты для логики отображения
- **src/pages/profile/profile.ts** — обновлена логика:
  - `enableEditData()` — разблокирует поля данных, показывает кнопку "Сохранить" для данных
  - `showPasswordForm()` — скрывает форму данных, показывает форму паролей
  - `saveData()` — блокирует поля данных, возвращает кнопки управления
  - `savePassword()` — скрывает форму паролей, возвращает форму данных
  - Валидация вызывается в `click` обработчике перед сохранением

### Валидация

- **src/features/validation/validators.ts** — добавлен валидатор `display_name`
- **src/features/form/validateForm.ts** — поддержка `dataRow` для поиска wrapper'а (кроме `inputWrapper`)

### Особенности реализации

- Валидация по submit: `e.preventDefault()` предотвращает перезагрузку
- Валидация по blur: Input компонент вешает `focusout` слушатель
- Очистка ошибок: `clearInputError()` вызывается перед каждой валидацией
- Поддержка disabled инпутов: `validateForm` пропускает `disabled` инпуты
- Разделение форм: ProfilePage использует две отдельные формы для данных и паролей

---

# Спринт 2.3 — Рефакторинг и документация

## Задачи

- Добавить `ref` атрибуты ко всем компонентам в HBS-шаблонах
- Добавить комментарии ко всем ключевым файлам проекта

## Что сделано

### Добавление `ref` атрибутов

- **login.hbs** — `ref="loginInput"`, `ref="passwordInput"`, `ref="submitBtn"`, `ref="registerLink"`
- **register.hbs** — `ref="firstNameInput"`, `ref="secondNameInput"`, `ref="loginInput"`, `ref="emailInput"`, `ref="passwordInput"`, `ref="phoneInput"`, `ref="submitBtn"`, `ref="loginLink"`
- **chat.hbs** — `ref="chatList"`, `ref="messageInput"`, `ref="sendBtn"`
- **profile.hbs** — `ref="avatar"`, `ref="emailInput"`, `ref="loginInput"`, `ref="firstNameInput"`, `ref="secondNameInput"`, `ref="displayNameInput"`, `ref="phoneInput"`, `ref="editDataBtn"`, `ref="editPasswordBtn"`, `ref="logoutBtn"`, `ref="saveDataBtn"`, `ref="oldPasswordInput"`, `ref="newPasswordInput"`, `ref="confirmPasswordInput"`, `ref="savePasswordBtn"`
- **modal.hbs** — `ref="closeBtn"`

### Добавление комментариев

Комментарии добавлены ко всем ключевым файлам проекта:

- **Базовый класс и регистрация** — `Block.ts`, `registerComponent.ts`
- **Валидация** — `validateForm.ts`, `validators.ts`
- **UI-компоненты** — `Input.ts`, `Button.ts`, `Link.ts`, `ChatList.ts`, `ProfileAvatar.ts`, `Modal.ts`
- **Страницы** — `LoginPage.ts`, `RegisterPage.ts`, `ChatPage.ts`, `ProfilePage.ts`, `ProfileModal.ts`, `Error404Page.ts`, `Error500Page.ts`
- **Приложение** — `app.ts`

Комментарии описывают: назначение классов, методов, групп переменных, логических блоков (if/else, циклы), обработчиков событий.

---

# Спринт 2.4 — Финализация и документация

## Задачи

- Обновить README.md: удалить некорректную информацию, добавить страницы, компоненты, технологии
- Добавить Stylelint для линтинга CSS
- Исправить использование innerHTML в Block.ts на createContextualFragment
- Обновить netlify.toml с командой сборки

## Что сделано

### Обновление README.md

- **Удалён раздел "MVC-паттерн"** — некорректная информация, паттерн не используется
- **Добавлен раздел "Страницы"** — все 6 страниц с описанием:
  - Авторизация, Регистрация, Чаты, Профиль, 404, 500
- **Добавлен раздел "Компоненты"** — все UI-компоненты:
  - Input, Button, Link, ChatList, ProfileAvatar, Modal
- **Обновлён раздел "Валидация форм"** — добавлены конкретные правила для каждого поля
- **Добавлен раздел "Технологии"** — Vite, TypeScript, PostCSS, Handlebars, ESLint, Stylelint, Prettier

### Добавление Stylelint

- **Установлен пакет:** `stylelint`, `stylelint-config-standard`, `stylelint-order`
- **Создан конфиг:** `.stylelintrc.json` с базовыми правилами
- **Добавлен скрипт:** `"lint:style": "stylelint \"src/**/*.css\""` в `package.json`
- **Обновлена команда `lint`:** теперь включает `stylelint` + `eslint` + `prettier` + `tsc --noEmit`

### Исправление innerHTML в Block.ts

- **src/shared/ui/block/block.ts** — заменён `innerHTML` на `createContextualFragment`
- **Было:** `templateElement.innerHTML = html`
- **Стало:** `const fragment = document.createRange().createContextualFragment(html)`
- Устранён риск XSS уязвимостей, код безопасен

### Обновление netlify.toml

- **Добавлена команда сборки:** `command = "npm run build"`
- **Теперь содержит:** `[build] publish = "dist" command = "npm run build"`
- Netlify корректно выполнит сборку при деплое

---

# Спринт 3

## Задачи на 3 спринт

- Роутинг приложения (Router, Route, History API)
- Интеграция с HTTP API (регистрация, вход, выход, профиль, чаты)
- Класс для работы с запросами (XHR + Promise, GET/POST/PUT/DELETE)
- Хранилище состояния (Store) и HOC connect
- Контроллеры (MVC-паттерн)
- Работа с файлами (FormData, multipart/form-data)
- Обновить README.md

## Функциональные требования

### 1. Роутинг приложения

- Маршруты: `/`, `/sign-up`, `/settings`, `/messenger`, `/404`, `/500`
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

## Что сделано

### Шаг 1: HTTP-слой

- **src/features/api/lib/constants.ts** — константы HTTP-методов (GET, POST, PUT, DELETE)
- **src/features/api/lib/common.ts** — вспомогательные функции: `isPlainObject`, `isArray`, `queryString`
- **src/features/api/lib/types.ts** — типизация HTTP-слоя и API (HTTPMethod, HttpMethodData, APIResponse, User, Chat, ChatUser)
- **src/features/api/httpTransport.ts** — класс `HTTPTransport` (XHR + Promise)
- **src/features/api/index.ts** — экспорт всех API-классов

### Шаг 2: API слой

- **AuthAPI** — `signup`, `signin`, `getUser`, `logout`
- **UserAPI** — `profile`, `avatar`, `password`, `get`, `search`
- **ChatAPI** — `get`, `create`, `delete`, `getUsers`, `getUnreadCount`, `addUser`, `removeUser`, `avatar`

### Шаг 3: Хранилище состояния (Store) и HOC connect

- **src/shared/utils/isEqual.ts** — рекурсивное сравнение объектов (оптимизация для connect)
- **src/shared/utils/merge.ts** — иммутабельное объединение объектов (deep merge)
- **src/shared/utils/set.ts** — установка значения по вложенному пути (immutable set)
- **src/shared/utils/store/store.ts** — Singleton Store (`getState`, `setState`, `subscribe`, `emit`)
- **src/shared/utils/store/connect.ts** — HOC `connect(mapStateToProps)` с оптимизацией через `isEqual`
- **src/shared/utils/store/index.ts** — экспорт `Store` и `connect`
- **src/shared/utils/index.ts** — экспорт всех утилит

### Шаг 4: Роутер

- **src/shared/utils/renderDOM.ts** — утилита для вставки компонента в DOM (`createRange().createContextualFragment`)
- **src/shared/utils/route.ts** — класс `Route` (маршрут: URL + компонент)
- **src/shared/utils/router.ts** — класс `Router` (Singleton, управление маршрутами, History API)
- **src/init/app.ts** — подключение роутера, замена hash-роутинга на real paths (`/`, `/sign-up`, `/settings`, `/messenger`, `/404`, `/500`)
- **Исправление бага:** замена `replaceChild` на `appendChild` (страницы остаются в DOM для корректной работы роутера)
- **Исправление:** скрытие всех маршрутов при переходе вместо `currentRoute.leave()`

### Шаг 5: Контроллеры (MVC)

- **AuthController** — `signin`, `signup`, `logout`, `checkAuth`
- **UserController** — `getProfile`, `updateProfile`, `updatePassword`, `updateAvatar`, `searchUsers`
- **ChatController** — `getChats`, `createChat`, `deleteChat`, `getChatUsers`, `getUnreadCount`, `addUserToChat`, `removeUserFromChat`

### Шаг 6: Интеграция с API на страницах

- **LoginPage:** вызов `AuthController.signin()` при отправке формы, обработка ошибок → `/500`
- **RegisterPage:** вызов `AuthController.signup()` при отправке формы, редирект на `/messenger`, обработка ошибок → `/500`
- **ChatPage:** вызов `ChatController.getChats()` при каждом переходе на страницу (`onEnter`)
- **ProfilePage:** вызов `UserController.getProfile()` при каждом переходе на страницу
- **Сохранение данных:** `UserController.updateProfile()` при нажатии «Сохранить» (данные)
- **Смена пароля:** `UserController.updatePassword()` при нажатии «Сохранить» (с проверкой совпадения)
- **Загрузка аватара:** `UserController.updateAvatar()` через модалку с валидацией файла
- **Logout:** `AuthController.logout()` при нажатии «Выйти» → редирект на `/`
- Обработка ошибок — переход на `/404` или `/500` при ошибках API

### Шаг 7: Работа с файлами

- Загрузка аватара пользователя — `PUT /user/profile/avatar` с `FormData`
- Загрузка аватара чата — `PUT /chats/avatar` с `FormData`
- Валидация файла: расширение (jpg, jpeg, png, gif, webp), размер (до 5 МБ)
- Отображение имени выбранного файла в модалке

### Шаг 8: Подписка на Store через connect

- **ChatPage:** `connect(ChatPage, mapStateToProps)` — данные чатов обновляют props при изменении Store
- **ProfilePage:** `connect(ProfilePage, mapStateToProps)` — данные пользователя обновляют props при изменении Store
- **mapStateToProps:** извлекает данные из Store (`state.user`, `state.chats`), добавляет `BASE_URL` для аватара

### Шаг 9: onEnter — вызов при каждом переходе на страницу

- **Block.ts:** добавлен хук `onEnter()` (protected, по умолчанию пустой)
- **route.ts:** при повторном переходе вызывается `onEnter()` перед `show()`
- **ChatPage:** `onEnter()` вызывает `ChatController.getChats()`
- **ProfilePage:** `onEnter()` вызывает `UserController.getProfile()` + сбрасывает UI-состояние формы пароля

### Шаг 10: Сохранение состояния авторизации при перезагрузке

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

### Шаг 12: Обработка ошибок

- **router.ts** — `_onRoute()`: при неизвестном маршруте — редирект на `/404`
- **router.ts** — исправлен singleton: `getInstance()` возвращает один экземпляр
- **LoginPage** — `try/catch` при `AuthController.signin()` → `/500`
- **RegisterPage** — `try/catch` при `AuthController.signup()` → `/500`
- **ChatPage** — `try/catch` при `ChatController.getChats()` → `/500`
- **ProfilePage** — `try/catch` при `UserController.getProfile()` → `/500`
- **ProfilePage** — `try/catch` при `UserController.updateProfile()` → `/500`
- **ProfilePage** — `try/catch` при `UserController.updatePassword()` → `/500`

### Шаг 13: Обновление документации

- **README.md** — добавлены разделы: Роутинг, HTTP-класс, API-классы, Store, HOC connect, Контроллеры

### Шаг 14: Исправления и доработки (финализация)

- **Block.ts:** добавлен флаг `_isFirstMount` — `componentDidMount` вызывается только при первом монтировании, предотвращает дублирование запросов при ре-рендере через `connect`
- **Block.ts:** `setProps` больше не сбрасывает `__children` и `__refs` — вложенные компоненты сохраняются при ре-рендере
- **Block.ts:** `compile()` вызывает `embed` для вставки вложенных компонентов в placeholder'ы
- **registerComponent.ts:** добавлена вставка DOM-элемента вложенного компонента в placeholder через `embed`
- **ChatPage:** визуальное выделение выбранного чата — `selectedChatId` сохраняется в Store, `isSelected` вычисляется в `mapStateToProps`
- **ChatPage:** запрос на участников чата отправляется при каждом выборе чата (убрано кэширование в `loadedChatUsers`)
- **ChatPage:** участники сохраняются в Store под ключом `chatUsers` — обновляются при добавлении/удалении участника
- **ChatPage:** фильтрация текущего пользователя (role === 'admin') из списка участников — показывается "В чате нет участников"
- **ChatPage:** кнопки "Добавить/Удалить участника" скрыты, пока чат не выбран (`{{#if selectedChatId}}`)
- **ChatPage:** сброс выбранного чата при переходе на другую страницу (`onEnter` сбрасывает `selectedChatId` и `chatUsers` в Store)
- **ChatPage:** кнопки "Добавить/Удалить участника" с отступом `gap: 1rem` через `.actionButtons`
- **ChatPage:** высота боковой панели и верхней панели синхронизирована (`height: 4rem`)
- **AddUserModal:** обновление списка участников после добавления — данные запрашиваются заново и сохраняются в Store
- **RemoveUserModal:** новый компонент для удаления участника — поиск по логину в текущем списке участников, удаление через `ChatController.removeUserFromChat`
- **ChatAPI:** `addUser` — поле `id` заменено на `chatId`
- **ChatAPI:** `removeUser` — поле `id` заменено на `chatId`
- **ChatController:** `addUserToChat` — передача `chatId` вместо `id`
- **ChatController:** `removeUserFromChat` — передача `chatId` вместо `id`
- **ProfilePage:** обработчик клика на аватар перенесён из `componentDidMount` в `this.events.click` — слушатель восстанавливается при каждом ре-рендере
- **ProfilePage:** URL аватара — `BASE_URL` изменён на `https://ya-praktikum.tech/api/v2/resources` (статические файлы отдают по этому пути)
- **ProfilePage:** проверка `startsWith("http")` — предотвращает дублирование URL при ре-рендере через `connect`
- **ProfileAvatar:** аватар отображается круглым (`border-radius: 50%`) с `object-fit: cover`
- **ChatUser:** добавлено поле `role?: string` в интерфейс

---

## Ограничения

- Не вносить изменений в файловую структуру проекта и в содержимое самих файлов без разрешения!
- Для добавления текстового контента использовать `textContent` — не `innerHTML`
- Безопасная работа с DOM — использовать `createContextualFragment` вместо `innerHTML`:
  ```typescript
  const html = Handlebars.compile(template)(props);
  const fragment = document.createRange().createContextualFragment(html);
  ```
- Никаких фреймворков (React, Vue, Angular)
- Запрещено использовать внешние отступы типа margin
