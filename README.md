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
