# PLAN.md

# План работ — Спринт 2

---

## Шаг 1: Подготовка ✅ (выполнен)

- [x] Обновить `tsconfig.json` (`noImplicitAny: true`, `strictNullChecks: true`, `sourceMap: true`)
- [x] Ветка `sprint_2` активна

---

## Шаг 2: Базовый класс Block ✅ (выполнен)

- [x] Создать `src/shared/ui/block/block.ts` — базовый абстрактный класс `Block<Props>`:
  - `abstract template` — шаблон Handlebars
  - `private domElement` — DOM-элемент, доступен только через `element()`
  - `props`, `children`, `refs`, `events` — свойства
  - `element()` — ленивый рендер DOM-элемента
  - `setProps()` — обновление свойств + ре-рендер
  - `destroy()` — публичный метод полного удаления компонента
  - `render()` / `compile()` — компиляция и замена в DOM (protected)
  - `unmountComponent()` — рекурсивное размонтирование (private)
  - `componentDidMount()` / `componentWillUnmount()` — хуки жизненного цикла
  - `attachListeners()` / `removeListeners()` — управление событиями
  - Поддержка вложенных компонентов через `__children` и `__refs`
  - Named export (`export class Block`)
- [x] Создать `src/shared/ui/block/registerComponent.ts` — хелпер регистрации компонентов в Handlebars:
  - `registerComponent(componentName, Component)` — регистрация
  - Генерация `data-component-hbs-id` для заглушек
  - Обработка `ref` из hash
  - Сохранение `__children` с функцией `embed`
- [x] Создать `src/shared/ui/block/index.ts` — экспорты `Block` и `registerComponent`
- [x] Named export, строчное имя файла (`block.ts`)

---

## Инструментарий ✅ (выполнен)

- [x] `eslint.config.ts` — отключена сортировка импортов (порядок задаётся вручную: обычные → типы)
- [x] `eslint.config.ts` — исключены `package-lock.json` и `tsconfig.json` из JSON-линтера
- [x] `eslint.config.ts` — отключено `css/no-invalid-properties` (CSS-переменные объявлены в global.css)
- [x] `.prettierignore` — создан, исключены `node_modules/`, `dist/`, `coverage/`
- [x] `.prettierrc` — добавлены явные настройки: `trailingComma: "es5"`, `tabWidth: 2`, `printWidth: 100`
- [x] `package.json` — обновлены скрипты: `lint` (eslint + prettier), `lint:fix` (eslint --fix + prettier --write)

---

## Шаг 3: Рефакторинг компонентов

### 3.1. Переписать `Input` → наследник `Block` ✅ (выполнен)

- [x] `static componentName = "Input"`
- [x] `protected template` — импортируется из `input.hbs`
- [x] `interface InputProps extends BlockOwnProps` с `styles: typeof inputStyles`
- [x] `constructor` передаёт `styles: inputStyles` через `super`
- [x] `this.events` устанавливается в конструкторе после `super()`
- [x] `registerComponent("Input", Input)` — регистрация в Handlebars
- [x] **src/shared/ui/input/input.hbs** — шаблон вынесен в отдельный файл
- [x] **src/shared/ui/input/input.hbs** — добавлен `data-validation-key="{{ validationKey }}"`
- [x] Удалены `input.template.ts`
- [x] Обновлены страницы: `login.hbs`, `register.hbs`, `profile.hbs`
  - `{{#input}}...{{/input}}` → `{{{ Input ... }}}`

### 3.2. Переписать `Button` → наследник `Block` ✅ (выполнен)

- [x] `static componentName = "Button"`
- [x] `protected template` — импортируется из `button.hbs`
- [x] `interface ButtonProps extends BlockOwnProps` с `styles: typeof buttonStyles`
- [x] `constructor` передаёт `styles: buttonStyles` через `super`
- [x] Добавлен проп `type?: "button" | "submit" | "reset"`
- [x] **src/shared/ui/button/button.hbs** — добавлен `{{#if type}}type="{{ type }}"{{/if}}`
- [x] `registerComponent("Button", Button)` — регистрация в Handlebars
- [x] Удалены `button.template.ts`
- [x] Обновлены страницы: `login.hbs`, `register.hbs`, `profile.hbs`
  - `{{#button}}...{{/button}}` → `{{{ Button ... }}}`

### 3.3. Переписать `Link` → наследник `Block` ✅ (выполнен)

- [x] `static componentName = "Link"`
- [x] `protected template` — импортируется из `link.hbs`
- [x] `interface LinkProps extends BlockOwnProps` с `styles: typeof linkStyles`
- [x] `constructor` передаёт `styles: linkStyles` через `super`
- [x] `registerComponent("Link", Link)` — регистрация в Handlebars
- [x] Удалены `link.template.ts`
- [x] Обновлены страницы: `login.hbs`, `register.hbs`
  - `{{#link}}...{{/link}}` → `{{{ Link ... }}}`

### 3.4. Создание ChatList и удаление ChatItem ✅ (выполнен)

- [x] **src/shared/ui/chat-list/chat-list.ts** — новый компонент `ChatList extends Block`:
  - `static componentName = "ChatList"`
  - `protected template` — импортируется из `chat-list.hbs`
  - `interface ChatListProps extends BlockOwnProps` с `chats` и `styles: typeof chatListStyles`
  - `constructor` передаёт `styles: chatListStyles` через `super`
  - Убран `ChatItemData`, данные чатов встроены в `ChatListProps`
- [x] **src/shared/ui/chat-list/chat-list.hbs** — шаблон вынесен в отдельный файл
- [x] **src/shared/ui/chat-list/chat-list.module.css** — стили (перенесены из `chat-item.module.css`)
- [x] `registerComponent("ChatList", ChatList)` — регистрация в Handlebars
- [x] **src/pages/chat/chat.hbs** — `{{#each chats}}{{#chatItem this}}{{/chatItem}}{{/each}}` → `{{{ ChatList }}}`
- [x] **src/pages/chat/chat.ts** — создаёт `ChatList({ chats, styles })` и рендерит
- [x] Удалено: `src/shared/ui/chat-item/` (полный каталог), `chat-item.template.ts`

### 3.5. Переписать `ProfileAvatar` → наследник `Block` ✅ (выполнен)

- [x] `static componentName = "ProfileAvatar"`
- [x] `protected template` — импортируется из `profile-avatar.hbs`
- [x] `interface ProfileAvatarData extends BlockOwnProps` с `styles: typeof profileAvatarStyles`
- [x] `constructor` передаёт `styles: profileAvatarStyles` через `super`
- [x] `registerComponent("ProfileAvatar", ProfileAvatar)` — регистрация в Handlebars
- [x] Удалены `profile-avatar.template.ts`
- [x] Обновлена страница: `profile.hbs`
  - `{{#profileAvatar}}...{{/profileAvatar}}` → `{{{ ProfileAvatar ... }}}`

### 3.6. Переписать `Modal` → наследник `Block` ✅ (выполнен)

- [x] `static componentName = "Modal"`
- [x] `protected template` — импортируется из `modal.hbs`
- [x] `interface ModalOptions extends BlockOwnProps` с `styles: typeof modalStyles`
- [x] `constructor` передаёт `styles: modalStyles` через `super`
- [x] Сохранены методы `show()` и `close()`
- [x] Шаблон использует `{{{ Button text=buttonText }}}` вместо `{{#button}}`
- [x] `registerComponent("Modal", Modal)` — регистрация в Handlebars
- [x] Удалены `modal.template.ts`
- [x] Обновлён `src/pages/profile/profile-modal.ts` — добавлен `styles` в props

### 3.7. Централизация регистрации компонентов ✅ (выполнен)

- [x] **src/init/app.ts** — регистрация компонентов при инициализации приложения:
  - `registerComponent("Input", Input)`
  - `registerComponent("Button", Button)`
  - `registerComponent("Link", Link)`
  - `registerComponent("ChatList", ChatList)`
  - `registerComponent("ProfileAvatar", ProfileAvatar)`
  - `registerComponent("Modal", Modal)`
- [x] Удалён `src/helpers/handlebars-helpers.ts`
- [x] Регистрация происходит один раз при запуске приложения

---

## Шаг 4: Валидация форм ✅ (выполнен)

- [x] **src/features/validation/validators.ts** — правила валидации + функция `validate()`:
  - `first_name`, `second_name` — кириллица/латиница, первая буква заглавная, без пробелов/цифр, только дефис
  - `login` — 3–20 символов, латиница + цифры + `_` + `-`, не только цифры
  - `email` — обязательны `@` и `.` после него
  - `password` — 8–40 символов, заглавная буква + цифра
  - `phone` — 10–15 цифр, возможен `+` в начале
  - `message` — не пустой
- [x] **src/features/validation/index.ts** — экспорт `validate` и `ValidationKey`
- [x] **src/features/index.ts** — ре-экспорт из `validation`
- [x] **src/shared/ui/input/input.ts** — интегрирована валидация:
  - `validationKey?: ValidationKey` в props
  - `this.events` устанавливается в конструкторе после `super()`
  - Обработчик `focusout` (всплывающая версия `blur`) вызывает `validate()` через `e.target`
  - При ошибке создаётся `<span>` с текстом ошибки, при успехе — удаляется
  - CSS-класс `inputError` добавляется/удаляется на `<input>`
  - `inputElement.value = input.value` — обновление value инпута при blur
- [x] **src/styles/global.css** — добавлена `--color-error: #ff0000`
- [x] **src/shared/ui/input/input.module.css** — `.inputError` и `.error` используют красный цвет
- [x] **src/shared/ui/input/input.hbs** — добавлен `data-validation-key="{{ validationKey }}"`
- [x] **src/pages/login/login.hbs** — добавлены `validationKey` ко всем инпутам (`login`, `password`)
- [x] **src/pages/register/register.hbs** — добавлены `validationKey` ко всем инпутам (`first_name`, `second_name`, `login`, `email`, `password`, `phone`)
- [x] **src/pages/login/login.ts** — валидация по `submit`:
  - `e.preventDefault()` — предотвращаем отправку формы
  - Проходим по всем `<input>` и вызываем `validate()` по `data-validation-key`
  - При ошибке — показываем span и добавляем класс `inputError`
  - При успехе — собираем данные через `FormData` и `console.log`
- [x] **src/pages/register/register.ts** — аналогично

---

## Шаг 5: Рефакторинг страниц на Block ✅ (выполнен)

- [x] **src/pages/login/login.ts** — переписан на `Block`:
  - `static componentName = "LoginPage"`
  - `protected template` — импортируется из `login.hbs`
  - `render(container)` — обёртка: `this.render()` + `container.appendChild(this.element())`
- [x] **src/pages/register/register.ts** — аналогично
- [x] **src/pages/404/404.ts** — аналогично
- [x] **src/pages/500/500.ts** — аналогично
- [x] **src/pages/profile/profile.ts** — переписан на `Block`:
  - `static componentName = "ProfilePage"`
  - `protected template` — импортируется из `profile.hbs`
  - `componentDidMount()` — обработчики событий перенесены из `render()`
  - `render(container)` — обёртка
- [x] **src/pages/chat/chat.ts** — переписан на `Block`:
  - `static componentName = "ChatPage"`
  - `protected template` — импортируется из `chat.hbs`
  - `render(container)` — обёртка
- [x] **src/pages/profile/profile.module.css** — добавлен `.hidden` класс

---

## Шаг 6: Исправление маршрутизации и инкапсуляция domElement ✅ (выполнен)

- [x] **src/init/app.ts** — обновлён `renderPage`:
  - `type PageComponent = new () => Block<any>`
  - `this.currentPage` — отслеживание текущей страницы
  - `this.currentPage.destroy()` — размонтирование предыдущей страницы
  - `this.pageContainer.replaceChildren(element)` — замена содержимого контейнера
- [x] **src/shared/ui/block/block.ts** — `domElement` изменён на `private`, доступ только через `element()`
- [x] **src/shared/ui/block/block.ts** — добавлен публичный метод `destroy()` для полного удаления компонента
- [x] **src/pages/profile/profile.ts** — все обращения `this.domElement` заменены на `this.element()`

---

## Шаг 7: Финализация

### 7.1. Проверка типов
```bash
npx tsc --noEmit
```

### 7.2. Линтинг
```bash
npm run lint
```
Цель: 0 ошибок

### 7.3. Обновить `README.md`
- Описание функциональности спринта 2
- Архитектура (Block, валидация)
- Команды для запуска

---

## Что в процессе

- [ ] Валидация по `submit` для страницы чатов (поле message) — отложено, так как `validate()` возвращает `null` для пустого поля (ошибка показывается только после ввода)
- [ ] `focusout` не показывает ошибку для пустых полей — нужно дополнительное решение

<!-- TODO: заполнять по мере выполнения задач -->
