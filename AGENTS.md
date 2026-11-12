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

## Что сделано

### Настроенная сборка
- Vite с поддержкой HMR
- TypeScript со строгими настройками
- PostCSS с CSS Modules
- Handlebars для шаблонов

### Реализованные страницы
- **Авторизация** — форма с полями login/password, кнопка "Войти", ссылка на регистрацию
- **Регистрация** — форма с полями first_name, second_name, login, email, password, phone
- **Страница 404** — заглушка с текстом "404 — Страница не найдена"
- **Страница 500** — заглушка с текстом "500 — Ошибка сервера"
- **Список чатов** — две колонки: список чатов из мок-данных, пустое состояние, поле ввода сообщения
- **Профиль пользователя** — аватар с hover-эффектом, данные пользователя, переключение режимов (изменить данные/пароль)
- **Модалка загрузки аватара** — общий компонент Modal, file input, кнопка "Поменять"

### Реализованные компоненты
- **Button** — кнопка с текстом
- **Input** — поле ввода с поддержкой ошибок
- **Link** — компонент ссылки
- **ChatItem** — элемент списка чатов с аватаром, названием, последним сообщением, бейджем непрочитанных
- **ProfileAvatar** — аватар с hover-оверлеем
- **Modal** — переиспользуемый компонент модалки

### Особенности реализации
- Минималистичный стиль (белый/черный/серый)
- Шрифт Caveat
- Без border-radius
- Семантические теги (main, aside, form, ul/li)
- Handlebars-хелперы для рендеринга компонентов
- Aliases для импортов (@shared, @pages и т.д.)
- Без использования innerHTML
- Без внешних отступов (margin)
- CSS-переменные для всех цветов в `:root`
- Поддержка `disabled` в компоненте Input
- Атрибут `alt` для accessibility на всех img

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
