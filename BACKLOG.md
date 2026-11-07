# BACKLOG — Анализ проекта

## Критические проблемы 🔴

### 1. Router singleton — сломан `getInstance()`
**Файл:** `src/features/router/router.ts:28-30`

```ts
static getInstance(): Router {
    return new Router(); // Всегда создаёт НОВЫЙ экземпляр!
}
```

Приватный конструктор с проверкой `__instance` никогда не срабатывает. Каждый вызов `getInstance()` создаёт новый роутер с пустым списком маршрутов.

**Влияние:** Работает пока случайно — роутер создаётся один раз при `app.init()`, но при повторных вызовах `getInstance()` создаётся новый пустой экземпляр.

**Решение:**
```ts
static getInstance(): Router {
    if (!Router.__instance) {
        Router.__instance = new Router();
    }
    return Router.__instance;
}
```

---

### 2. `setProps()` уничтожает вложенные компоненты
**Файл:** `src/shared/ui/block/block.ts:46`

```ts
this.props = { ...this.props, ...props, __children: [], __refs: {} } as Props;
```

При каждом `setProps()` (включая обновления из `connect`) `__children` и `__refs` сбрасываются в пустые значения. Все вложенные компоненты (`Input`, `ChatList`, `ProfileAvatar`) теряются при каждом обновлении store.

**Влияние:** При обновлении store через `connect` вложенные компоненты пересоздаются заново. Placeholder'ы имеют новые data-component-hbs-id, но `embed` хранит замыкание на старый ID — возникает ошибка `Can't find data-id for component`.

**Решение:** Хранить `__children` и `__refs` в экземпляре компонента, а не в `this.props`. При `setProps` обновлять только пользовательские пропсы, не трогая `__children` и `__refs`.

---

### 3. `innerHTML` в `compile()` — нарушение безопасности
**Файл:** `src/shared/ui/block/block.ts:125`

```ts
templateElement.innerHTML = html; // Запрещено в AGENTS.md
```

AGENTS.md прямо запрещает `innerHTML`, требуя `createContextualFragment`. Это XSS-риск.

**Влияние:** Если в шаблоне окажется пользовательский ввод, он будет выполнен как код.

**Решение:**
```ts
const fragment = document.createRange().createContextualFragment(html);
// querySelectorAll и firstElementChild работают на DocumentFragment так же
```

---

### 4. Modal listener leak — утечка слушателей
**Файл:** `src/shared/ui/modal/modal.ts:40-44`

```ts
this.overlay.addEventListener("click", (e) => { ... });
```

Слушатель вешается в `show()`, но никогда не снимается. При повторном `show()` после `close()` накапливаются дубликаты.

**Влияние:** При каждом открытии/закрытии модалки — новый слушатель. При 10 открытиях — 10 слушателей на одном элементе.

**Решение:** Снимать слушатель в `close()`, вешать в `show()` с уникальным именем или хранить ссылку на функцию.

---

## Проблемы TypeScript 🟡

### 5. `connect` использует `any` трижды
**Файл:** `src/shared/utils/store/connect.ts:7-12`

```ts
function connect<Props extends object, T extends new (props?: any) => Block>(
    Component: T,
) {
    return class extends (Component as any) {
```

Три `any` — полная потеря типизации. Возвращаемый тип HOC не инференсируется корректно.

**Решение:** Добавить явный возвращаемый тип `: T` и приведение `as unknown as T` на `return`.

---

### 6. `Route.render()` — два `as any`
**Файл:** `src/features/router/route.ts:57, 65`

```ts
this.block = new (this.blockClass as any)();
(this.block as any).onEnter();
```

Первый — чтобы обойти абстрактный класс. Второй — потому что `onEnter` protected.

**Решение:** Либо сделать `onEnter` public, либо использовать `as any` осознанно с комментарием.

---

### 7. `ProfilePage.componentDidMount` — async, но базовый класс не async
**Файл:** `src/pages/profile/profile.ts:97`

```ts
protected async componentDidMount(): Promise<void> // Базовый: componentDidMount(): void {}
```

Сигнатуры не совпадают. TypeScript ругается.

**Решение:** Либо сделать `componentDidMount` в базовом классе async, либо не делать его async в наследнике (использовать `void` return).

---

## Проблемы архитектуры 🟡

### 8. `HTTPTransport` создаётся заново для каждого API-класса
**Файлы:** `chat-api.ts:9`, `auth-api.ts:8`, `user-api.ts:9`

```ts
const chatTransport = new HTTPTransport();
const authTransport = new HTTPTransport();
const userTransport = new HTTPTransport();
```

Три одинаковых экземпляра с одинаковым `BASE_URL`. Должен быть один shared instance.

**Решение:** Singleton или DI — создать один `HTTPTransport` и передавать в API-классы.

---

### 9. `Block.render()` пересоздаёт ВСЕХ детей при каждом `setProps`
**Файл:** `src/shared/ui/block/block.ts:110-118`

```ts
this.unmountComponent(); // Уничтожает всех детей
const fragment = this.compile(); // Пересоздаёт DOM
```

Для сложных страниц с множеством инпутов — это пересоздание всего DOM при каждом обновлении store.

**Решение:** Diffing/reconciliation — пересоздавать только изменённые компоненты, а не всех детей.

---

### 10. `window.onpopstate` перезаписывает обработчик
**Файл:** `src/features/router/router.ts:61`

```ts
window.onpopstate = () => { ... };
```

Перезаписывает любой существующий обработчик.

**Решение:** `window.addEventListener('popstate', ...)` вместо присваивания.

---

### 11. Нет DI — каждый контроллер создаёт свой API, каждый API создаёт свой HTTPTransport
**Файлы:** `chat-controller.ts:5`, `chat-api.ts:9`

Цепочка: `Controller → new API → new HTTPTransport`. Нет общего экземпляра.

**Решение:** Singleton для `HTTPTransport`, shared instance для API-классов, DI для контроллеров.

---

## Дублирование кода 🟡

### 12. Одинаковая логика показа ошибок в `validateForm` и `Input`
**Файлы:** `validateForm.ts:42-61`, `input.ts:42-65`

Оба файла делают одно и то же:
- Ищут wrapper через `[class*='inputWrapper']`
- Ищут error span через `[class*='error']`
- Создают/обновляют span с текстом ошибки

**Решение:** Вынести в утилиту `showInputError(input, error, styles)`.

---

### 13. `ProfilePage` — DOM-запросы повторяются 4+ раза
**Файл:** `src/pages/profile/profile.ts:118-191`

Каждый метод (`enableEditData`, `saveData`, `showPasswordForm`, `savePassword`) делает одни и те же `querySelector('[data-role="..."]')`.

**Решение:** Вынести в приватный `$` хелпер:
```ts
private $ = (selector: string): HTMLElement | null => 
    this.element()?.querySelector(selector) ?? null;
```

---

### 14. `LoginPage` и `RegisterPage` — идентичные обработчики событий
Оба имеют:
- `submit` с `e.preventDefault()` + `validateForm` + `FormData`
- `click` с `data-ref` → `Router.go()`

**Решение:** Базовый класс `AuthPage extends Block`.

---

## Проблемы безопасности 🟡

### 15. `ProfileModal` body — raw HTML
**Файл:** `src/pages/profile/profile-modal.ts:23`

```ts
const bodyHtml = template({ styles });
this.modal = new Modal({ body: bodyHtml, ... });
```

Если `Modal` рендерит через `{{{ body }}}` — XSS-риск.

---

### 16. Нет CSRF-защиты
`HTTPTransport` отправляет cookies (`withCredentials: true`), но нет CSRF-токенов.

---

## Производительность 🟢

### 17. `setProps()` всегда перерендеривает
**Файл:** `src/shared/ui/block/block.ts:45-48`

Даже если props не изменились, `setProps()` вызывает `render()`. `connect` пытается mitigate через `isEqual`, но damage уже сделан внутри `setProps`.

---

### 18. `compile()` querySelectorAll на весь фрагмент
**Файл:** `src/shared/ui/block/block.ts:138`

```ts
Array.from(fragment.querySelectorAll("[ref]"))
```

Для больших шаблонов — O(n).

---

### 19. `Store.emit()` вызывает всех слушателей синхронно
**Файл:** `src/shared/utils/store/store.ts:29`

```ts
private emit(): void {
    this.listeners.forEach((listener) => listener());
}
```

Если много компонентов подписаны и `setState` вызывается часто — блокировка main thread.

---

## Не реализовано 🟡

### 20. Отправка сообщений не вызывает API
**Файл:** `src/pages/chat/chat.ts:48-58`

`validateForm` логирует в консоль, но к `ChatAPI.sendMessage` обращение не идёт.

---

### 21. `lastMessage` и `unreadCount` всегда пустые
**Файл:** `src/pages/chat/chat.ts:27-32`

```ts
unreadCount: 0,
lastMessage: { author: "", text: "", time: "" },
```

`getUnreadCount` API доступен, но не вызывается.

---

### 22. Нет обработки ошибок в контроллерах
`AuthController.signin()`, `ChatController.getChats()` и т.д. — ошибки API пролетают без `try/catch`.

---

### 23. Avatar не отображается
Сервер возвращает 404 для аватара. Фронтенд формирует URL правильно, но сервер не отдаёт файл.

**Решение:** Fallback на placeholder-картинку при 404.

---

## Мелочи 🟢

### 24. `validateForm` + `Input` blur — двойная валидация
Поле валидируется при blur (Input) И при submit (validateForm).

---

### 25. `uniqueId` в `registerComponent` — модульный глобал
**Файл:** `src/shared/ui/block/registerComponent.ts:8`

```ts
let uniqueId = 0;
```

При HMR в dev-режиме счётчик не сбрасывается.

---

### 26. Cache-busting на ВСЕХ GET-запросах
**Файл:** `src/features/api/httpTransport.ts:55-57`

```ts
if (isGet) {
    finalUrl += `${finalUrl.includes("?") ? "&" : "?"}_t=${Date.now()}`;
}
```

Даже на запросы, которые можно кэшировать.

---

## Сводная таблица

| Категория | Кол-во | Приоритет |
|---|---|---|
| Критические | 4 | 🔴 Fix first |
| TypeScript | 3 | 🟡 Fix |
| Архитектура | 4 | 🟡 Fix |
| Дублирование | 3 | 🟡 Nice to fix |
| Безопасность | 2 | 🟡 Fix |
| Производительность | 3 | 🟢 Low priority |
| Не реализовано | 4 | 🟡 Fix |
| Мелочи | 3 | 🟢 Low priority |

---

## Приоритетный план исправлений

### Блок 1: Критическое (блокирует работу)
1. Router singleton — `getInstance()`
2. `setProps` ломает вложенные компоненты
3. `innerHTML` → `createContextualFragment`

### Блок 2: Важное (ломает UX)
4. Modal listener leak
5. `connect` — добавить явный тип
6. `onEnter` — сделать public или осознанный `as any`
7. `ProfilePage.componentDidMount` — async fix

### Блок 3: Архитектура (чистота кода)
8. Singleton для `HTTPTransport`
9. Diffing/reconciliation для `Block.render()`
10. `addEventListener` вместо `onpopstate`
11. DI для контроллеров

### Блок 4: Качество кода
12. Утилита `showInputError`
13. `$` хелпер в `ProfilePage`
14. Базовый `AuthPage`

### Блок 5: Безопасность
15. XSS в `ProfileModal` body
16. CSRF-токены

### Блок 6: Не реализовано
17. Отправка сообщений → API
18. `lastMessage` / `unreadCount`
19. `try/catch` в контроллерах
20. Avatar fallback на placeholder
