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

## Архитектура

### Компонентная архитектура (Block)

- Базовый класс `Block<Props>` — аналог React-компонентов на минималках
- Жизненный цикл: `componentDidMount`, `componentWillUnmount`
- Реактивность через `setProps()` → автоматический ре-рендер
- Вложенные компоненты через `registerComponent()`
- Декларативный синтаксис: `{{{ ComponentName prop="value" ref="key" }}}`

### MVC-паттерн

- **View** — компоненты на базе `Block`, генерация через Handlebars
- **Model** — сервисы и модули для бизнес-логики и данных
- **Controller** — взаимодействие View и Model

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
- Правила для всех полей: имена, логин, email, пароль, телефон, сообщение
- Регулярные выражения с понятными сообщениями об ошибках
- Валидация интегрирована в компонент `Input` через `validationKey`
- Ошибки отображаются красным цветом

### Шаблоны компонентов

- Шаблоны вынесены в отдельные `.hbs` файлы
- Каждый компонент имеет свой `.hbs` файл в той же директории
- Шаблоны импортируются через `import template from "./component.hbs"`
- Vite конфигурируется для обработки `.hbs` файлов через `assetsInclude`
