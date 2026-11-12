# CHANGES_2.md

# Журнал изменений проекта «Мессенджер» — Спринт 2

---

## Цели спринта

Миграция на TypeScript, внедрение компонентной архитектуры (Block), валидация форм, MVC-паттерн.

---

## Функциональные требования

### 1. TypeScript
- Миграция всего клиентского кода на TypeScript
- Строгая типизация: `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters`
- `tsc --noEmit` в процессе сборки
- Типизация всех компонентов, интерфейсов, API

### 2. Компонентная архитектура
- Базовый класс `Block<Props extends object>` — «React на минималках»
- Жизненный цикл: `componentDidMount`, `componentWillUnmount`
- Реактивность: `setProps(props)` → автоматический `render()`
- Вложенные компоненты через `registerComponent(Component)`
- Ссылки на DOM-элементы: `ref` атрибут → `this.refs[key]`
- Обработка событий: `events: Record<keyof HTMLElementEventMap, (e: Event) => void>`
- Вложенные компоненты в Handlebars: `{{{ ComponentName prop="value" ref="key" }}}`
- Заглушки для вложенных компонентов: `data-component-hbs-id`
- Рекурсивный unmount дочерних компонентов

### 3. Страница чатов
- Список чатов + лента переписки
- Поле ввода сообщения: `name="message"`
- Клиентская генерация страниц

### 4. Валидация форм
- Проверка по `blur` и `submit`
- Правила:
  - `first_name`, `second_name` — кириллица/латиница, первая буква заглавная, без пробелов/цифр, только дефис
  - `login` — 3–20 символов, латиница + цифры + `_` + `-`, не только цифры
  - `email` — обязательны `@` и `.` после него, между ними буквы
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

---

## Нефункциональные требования

### TypeScript (tsconfig.json)
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

---

## Детали реализации Block

### Базовый класс
```typescript
abstract class Block<Props extends BlockOwnProps = BlockOwnProps> {
  protected abstract template: string;
  protected props = {} as Props;
  private domElement: Element | null = null;
  protected children: Block<object>[] = [];
  protected refs: Record<string, Element> = {};
  protected events: EventListType = {};

  constructor(props: Props = {} as Props);
  public element(): Element | null;
  public setProps(props: Partial<Props>): void;
  public destroy(): void;
  protected componentDidMount(): void;
  protected componentWillUnmount(): void;
  protected render(): void;
  private compile(): Element | null;
}
```

### Вложенные компоненты
- `registerComponent(Component)` — регистрация в Handlebars
- Декларативный синтаксис: `{{{ ComponentName prop="value" ref="key" }}}`
- Заглушки с `data-component-hbs-id` → замена на реальный DOM
- `__children` — массив дочерних компонентов в props
- `__refs` — ссылки на DOM-элементы вложенных компонентов

### Обработка событий
- `events: Partial<Record<keyof HTMLElementEventMap, (e: Event) => void>>`
- `attachListeners()` / `removeListeners()` в жизненном цикле

---

## Структура проекта (текущая)

```
src/
├── main.ts                    # Точка входа
├── styles/
│   └── global.css
├── init/
│   ├── app.ts                 # Инициализация + регистрация компонентов
│   └── app.module.css
├── shared/
│   └── ui/                    # Компоненты
│       ├── block/             # Базовый класс + регистрация
│       │   ├── block.ts
│       │   ├── registerComponent.ts
│       │   └── index.ts
│       ├── button/
│       │   ├── button.ts
│       │   ├── button.hbs
│       │   └── button.module.css
│       ├── input/
│       │   ├── input.ts
│       │   ├── input.hbs
│       │   └── input.module.css
│       ├── link/
│       │   ├── link.ts
│       │   ├── link.hbs
│       │   └── link.module.css
│       ├── chat-list/
│       │   ├── chat-list.ts
│       │   ├── chat-list.hbs
│       │   └── chat-list.module.css
│       ├── profile-avatar/
│       │   ├── profile-avatar.ts
│       │   ├── profile-avatar.hbs
│       │   └── profile-avatar.module.css
│       └── modal/
│           ├── modal.ts
│           ├── modal.hbs
│           └── modal.module.css
├── pages/
│   ├── login/
│   ├── register/
│   ├── 404/
│   ├── 500/
│   ├── chat/
│   └── profile/
├── helpers/
│   └── mocks/
│       └── chats.ts
├── features/                  # Валидация
│   ├── index.ts
│   └── validation/
│       ├── validators.ts
│       └── index.ts
├── models/                    # [Шаг 5] Заглушки
├── controllers/               # [Шаг 5] Заглушки
```

---

## Текущее состояние

- Базовая структура из Спринта 1 готова
- ESLint + Prettier настроены и работают (0 ошибок)
- Все страницы прототипированы
- Компоненты реализованы через Handlebars-хелперы

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

- **eslint.config.ts** — отключена сортировка импортов (`simple-import-sort` убран): порядок импортов задаётся вручную
  - Исключены `package-lock.json` и `tsconfig.json` из JSON-линтера
  - Отключено `css/no-invalid-properties` (CSS-переменные объявлены в global.css)
- **.prettierignore** — создан, исключены `node_modules/`, `dist/`, `coverage/`
- **.prettierrc** — добавлены явные настройки: `trailingComma: "es5"`, `tabWidth: 2`, `printWidth: 100`
- **package.json** — обновлены скрипты: `lint` (eslint + prettier), `lint:fix` (eslint --fix + prettier --write)

### Структура проекта (обновлённая)

```
src/
├── main.ts
├── styles/
│   └── global.css
├── init/
│   ├── app.ts
│   └── app.module.css
├── shared/
│   └── ui/
│       ├── block/           ← [Шаг 2] block.ts, registerComponent.ts, index.ts
│       ├── button/
│       ├── input/
│       ├── link/
│       ├── chat-item/
│       ├── profile-avatar/
│       └── modal/
├── pages/
│   ├── login/
│   ├── register/
│   ├── chat/
│   ├── profile/
│   ├── 404/
│   └── 500/
├── helpers/
│   ├── handlebars-helpers.ts
│   └── mocks/
│       └── chats.ts
```

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

### Шаг 3.1: Рефакторинг Input

- **src/shared/ui/input/input.ts** — переписан на `Block`:
  - `static componentName = "Input"`
  - `protected template` — импортируется из `input.hbs`
  - `interface InputProps extends BlockOwnProps` с `styles: typeof inputStyles`
  - `constructor` передаёт `styles: inputStyles` через `super`
  - `this.events` устанавливается в конструкторе после `super()`
- **src/shared/ui/input/input.hbs** — шаблон вынесен в отдельный файл
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("Input", Input)`
- **src/shared/ui/block/index.ts** — добавлен экспорт `BlockOwnProps`
- **src/shared/ui/index.ts** — убран `inputTemplate`
- **src/helpers/handlebars-helpers.ts** — убран хелпер `input`, добавлена регистрация через `registerComponent`
- **src/pages/login/login.hbs** — `{{#input}}...{{/input}}` → `{{{ Input ... }}}`
- **src/pages/register/register.hbs** — аналогично
- **src/pages/profile/profile.hbs** — аналогично
- Удалено: `input.template.ts`

### Шаг 3.2: Рефакторинг Button

- **src/shared/ui/button/button.ts** — переписан на `Block`:
  - `static componentName = "Button"`
  - `protected template` — импортируется из `button.hbs`
  - `interface ButtonProps extends BlockOwnProps` с `styles: typeof buttonStyles`
  - `constructor` передаёт `styles: buttonStyles` через `super`
- **src/shared/ui/button/button.hbs** — шаблон вынесен в отдельный файл
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("Button", Button)`
- **src/shared/ui/button/index.ts** — убран `buttonTemplate`
- **src/shared/ui/index.ts** — убран `buttonTemplate`
- **src/helpers/handlebars-helpers.ts** — убран хелпер `button`, добавлена регистрация через `registerComponent`
- **src/pages/login/login.hbs** — `{{#button}}...{{/button}}` → `{{{ Button ... }}}`
- **src/pages/register/register.hbs** — аналогично
- **src/pages/profile/profile.hbs** — аналогично
- Удалено: `button.template.ts`

### Шаг 3.3: Рефакторинг Link

- **src/shared/ui/link/link.ts** — переписан на `Block`:
  - `static componentName = "Link"`
  - `protected template` — импортируется из `link.hbs`
  - `interface LinkProps extends BlockOwnProps` с `styles: typeof linkStyles`
  - `constructor` передаёт `styles: linkStyles` через `super`
- **src/shared/ui/link/link.hbs** — шаблон вынесен в отдельный файл
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("Link", Link)`
- **src/shared/ui/link/index.ts** — убран `linkTemplate`
- **src/shared/ui/index.ts** — убран `linkTemplate`
- **src/helpers/handlebars-helpers.ts** — убран хелпер `link`, добавлена регистрация через `registerComponent`
- **src/pages/login/login.hbs** — `{{#link}}...{{/link}}` → `{{{ Link ... }}}`
- **src/pages/register/register.hbs** — аналогично
- Удалено: `link.template.ts`

### Шаг 3.4: Рефакторинг ChatItem

- **src/shared/ui/chat-item/chat-item.ts** — переписан на `Block`:
  - `static componentName = "ChatItem"`
  - `protected template` — импортируется из `chat-item.hbs`
  - `interface ChatItemData extends BlockOwnProps` с `styles: typeof chatItemStyles`
  - `constructor` передаёт `styles: chatItemStyles` через `super`
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("ChatItem", ChatItem)`
- **src/shared/ui/chat-item/index.ts** — убран `chatItemTemplate`
- **src/shared/ui/index.ts** — убран `chatItemTemplate`
- **src/helpers/handlebars-helpers.ts** — убран хелпер `chatItem`, добавлена регистрация через `registerComponent`
- Удалено: `chat-item.template.ts`

### Шаг 3.5: Рефакторинг ProfileAvatar

- **src/shared/ui/profile-avatar/profile-avatar.ts** — переписан на `Block`:
  - `static componentName = "ProfileAvatar"`
  - `protected template` — импортируется из `profile-avatar.hbs`
  - `interface ProfileAvatarData extends BlockOwnProps` с `styles: typeof profileAvatarStyles`
  - `constructor` передаёт `styles: profileAvatarStyles` через `super`
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("ProfileAvatar", ProfileAvatar)`
- **src/shared/ui/profile-avatar/index.ts** — убран `profileAvatarTemplate`
- **src/shared/ui/index.ts** — убран `profileAvatarTemplate`
- **src/helpers/handlebars-helpers.ts** — убран хелпер `profileAvatar`, добавлена регистрация через `registerComponent`
- **src/pages/profile/profile.hbs** — `{{#profileAvatar}}...{{/profileAvatar}}` → `{{{ ProfileAvatar ... }}}`
- Удалено: `profile-avatar.template.ts`

### Шаг 3.6: Рефакторинг Modal

- **src/shared/ui/modal/modal.ts** — переписан на `Block`:
  - `static componentName = "Modal"`
  - `protected template` — импортируется из `modal.hbs`
  - `interface ModalOptions extends BlockOwnProps` с `styles: typeof modalStyles`
  - `constructor` передаёт `styles: modalStyles` через `super`
  - Сохранены методы `show()` и `close()`
  - Шаблон использует `{{{ Button text=buttonText }}}` вместо `{{#button}}`
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("Modal", Modal)`
- **src/shared/ui/modal/index.ts** — убран `modalTemplate`
- **src/shared/ui/index.ts** — убран `modalTemplate`
- **src/helpers/handlebars-helpers.ts** — убран хелпер `modal`, добавлена регистрация через `registerComponent`
- **src/pages/profile/profile-modal.ts** — добавлен `styles` в props Modal
- Удалено: `modal.template.ts`

### Шаг 3.7: Создание ChatList и удаление ChatItem

- **src/shared/ui/chat-list/chat-list.ts** — новый компонент `ChatList extends Block`:
  - `static componentName = "ChatList"`
  - `protected template` — импортируется из `chat-list.hbs`
  - `interface ChatListProps extends BlockOwnProps` с `chats` и `styles: typeof chatListStyles`
  - `constructor` передаёт `styles: chatListStyles` через `super`
  - Убран `ChatItemData`, данные чатов встроены в `ChatListProps`
- **src/shared/ui/chat-list/chat-list.hbs** — шаблон вынесен в отдельный файл
- **src/shared/ui/chat-list/chat-list.module.css** — стили (перенесены из `chat-item.module.css`)
- **src/shared/ui/chat-list/index.ts** — экспорты `ChatList`, `ChatListProps`, `chatListStyles`
- **src/shared/ui/block/registerComponent.ts** — регистрация через `registerComponent("ChatList", ChatList)`
- **src/shared/ui/index.ts** — убран `ChatItem`, добавлен `ChatList`
- **handlebars-helpers.ts** — убран хелпер `chatItem`, добавлена регистрация `ChatList`
- **src/pages/chat/chat.hbs** — `{{#each chats}}{{#chatItem this}}{{/chatItem}}{{/each}}` → `{{{ ChatList }}}`
- **src/pages/chat/chat.ts** — создаёт `ChatList({ chats, styles })` и рендерит
- Удалено: `src/shared/ui/chat-item/` (полный каталог), `chat-item.template.ts`

### Шаг 3.9: Централизация регистрации компонентов

- **src/init/app.ts** — регистрация компонентов при инициализации приложения:
  - `registerComponent("Input", Input)`
  - `registerComponent("Button", Button)`
  - `registerComponent("Link", Link)`
  - `registerComponent("ChatList", ChatList)`
  - `registerComponent("ProfileAvatar", ProfileAvatar)`
  - `registerComponent("Modal", Modal)`
- Удалён `src/helpers/handlebars-helpers.ts`
- Регистрация происходит один раз при запуске приложения

### Шаг 4: Валидация форм

- **src/features/validation/validators.ts** — правила валидации + функция `validate()`
- **src/features/validation/index.ts** — экспорт `validate` и `ValidationKey`
- **src/features/index.ts** — ре-экспорт из `validation`
- **src/shared/ui/input/input.ts** — интегрирована валидация:
  - `validationKey?: ValidationKey` в props
  - `this.events` устанавливается в конструкторе после `super()`
  - Обработчик `blur` вызывает `validate()` через `e.target`
- **src/styles/global.css** — добавлена `--color-error: #ff0000`
- **src/shared/ui/input/input.module.css** — `.inputError` и `.error` используют красный цвет
- **src/vite-env.d.ts** — добавлена типизация для `.hbs` файлов
- **vite.config.ts** — добавлен `assetsInclude: ["**/*.hbs"]` для корректной сборки

### Шаг 7: Рефакторинг страниц на Block

- **src/pages/login/login.ts** — переписан на `Block`:
  - `static componentName = "LoginPage"`
  - `protected template` — импортируется из `login.hbs`
  - `render(container)` — обёртка: `this.render()` + `container.appendChild(this.element())`
- **src/pages/register/register.ts** — аналогично
- **src/pages/404/404.ts** — аналогично
- **src/pages/500/500.ts** — аналогично
- **src/pages/profile/profile.ts** — переписан на `Block`:
  - `static componentName = "ProfilePage"`
  - `protected template` — импортируется из `profile.hbs`
  - `componentDidMount()` — обработчики событий перенесены из `render()`
  - `render(container)` — обёртка
- **src/pages/chat/chat.ts** — переписан на `Block`:
  - `static componentName = "ChatPage"`
  - `protected template` — импортируется из `chat.hbs`
  - `render(container)` — обёртка
- **src/pages/profile/profile.module.css** — добавлен `.hidden` класс
- **src/init/app.ts** — обновлён `renderPage`:
  - `type PageComponent = new () => Block<any>`
  - `const page = new Component()` → `page.render(this.pageContainer)` → `this.pageContainer = page.element()`

### Шаг 8: Исправление маршрутизации и инкапсуляция domElement

- **src/init/app.ts** — добавлено отслеживание `this.currentPage` для корректного размонтирования
  - `this.currentPage.destroy()` — вызывается перед рендерингом новой страницы
  - `this.pageContainer.replaceChildren(element)` — замена содержимого контейнера без замены самого контейнера
- **src/shared/ui/block/block.ts** — `domElement` изменён с `protected` на `private`
  - Доступ к DOM-элементу только через публичный метод `element()`
  - Добавлен публичный метод `destroy()` для полного удаления компонента
  - `destroy()` вызывает `unmountComponent()` (private) — рекурсивное размонтирование детей, `componentWillUnmount()`, `removeListeners()`
- **src/pages/profile/profile.ts** — все обращения `this.domElement` заменены на `this.element()`
  - `componentDidMount()` — `this.element()?.querySelector(...)`
  - `enableEditData()` — `this.element()?.querySelector(...)`
  - `showPasswordForm()` — `this.element()?.querySelector(...)`
  - `saveData()` — `this.element()?.querySelector(...)`

### Шаг 9: Валидация форм

- **src/features/validation/validators.ts** — правила валидации + функция `validate()`
- **src/features/validation/index.ts** — экспорт `validate` и `ValidationKey`
- **src/features/index.ts** — ре-экспорт из `validation`
- **src/shared/ui/input/input.ts** — интегрирована валидация:
  - `validationKey?: ValidationKey` в props
  - `this.events` устанавливается в конструкторе после `super()`
  - Обработчик `focusout` (всплывающая версия `blur`) вызывает `validate()` через `e.target`
  - При ошибке создаётся `<span>` с текстом ошибки, при успехе — удаляется
  - CSS-класс `inputError` добавляется/удаляется на `<input>`
  - `inputElement.value = input.value` — обновление value инпута при blur
- **src/styles/global.css** — добавлена `--color-error: #ff0000`
- **src/shared/ui/input/input.module.css** — `.inputError` и `.error` используют красный цвет
- **src/shared/ui/input/input.hbs** — добавлен `data-validation-key="{{ validationKey }}"` для доступа к ключу валидации
- **src/pages/login/login.hbs** — добавлены `validationKey` ко всем инпутам (`login`, `password`)
- **src/pages/register/register.hbs** — добавлены `validationKey` ко всем инпутам (`first_name`, `second_name`, `login`, `email`, `password`, `phone`)
- **src/pages/login/login.ts** — валидация по `submit`:
  - `e.preventDefault()` — предотвращаем отправку формы
  - Проходим по всем `<input>` и вызываем `validate()` по `data-validation-key`
  - При ошибке — показываем span и добавляем класс `inputError`
  - При успехе — собираем данные через `FormData` и `console.log`
- **src/pages/register/register.ts** — аналогично
- **src/shared/ui/button/button.ts** — добавлен проп `type?: "button" | "submit" | "reset"`
- **src/shared/ui/button/button.hbs** — добавлен `{{#if type}}type="{{ type }}"{{/if}}`

---

## Что в процессе

- [ ] Валидация по `submit` для страницы чатов (поле message) — отложено, так как `validate()` возвращает `null` для пустого поля (ошибка показывается только после ввода)
- [ ] `focusout` не показывает ошибку для пустых полей — нужно дополнительное решение

<!-- TODO: заполнять по мере выполнения задач -->

