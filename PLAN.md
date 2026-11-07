# План реализации Спринта 3

## Шаг 1: Класс HTTPTransport ✅ ВЫПОЛНЕНО
- ✅ Создать `src/features/api/httpTransport.ts` — обёртка над XHR с Promise
- ✅ Поддержка методов: `GET`, `POST`, `PUT`, `DELETE`
- ✅ Функция `queryStringify` для GET-запросов
- ✅ Обработка ошибок: `onload`, `onabort`, `onerror`, `ontimeout`
- ✅ Обработка данных: FormData, JSON, пустые данные
- ✅ `credentials: 'include'` (через `xhr.withCredentials = true`)
- ✅ Типизация для ответов (дженерики `<T>`)

## Шаг 2: API слой ✅ ВЫПОЛНЕНО
- ✅ Создать `src/features/api/lib/common.ts` — вспомогательные функции
- ✅ Создать `src/features/api/lib/types.ts` — типы HTTP-слоя и API
- ✅ Создать `src/features/api/lib/constants.ts` — HTTP-методы
- ✅ Создать `src/features/api/lib/index.ts` — экспорт из lib
- ✅ Создать `src/features/api/endpoints/auth-api.ts` — API авторизации (`signup`, `signin`, `getUser`, `logout`)
- ✅ Создать `src/features/api/endpoints/user-api.ts` — API пользователей (`profile`, `avatar`, `password`, `get`, `search`)
- ✅ Создать `src/features/api/endpoints/chat-api.ts` — API чатов (`get`, `create`, `delete`, `getUsers`, `getUnreadCount`, `addUser`, `removeUser`, `avatar`)
- ✅ Создать `src/features/api/endpoints/index.ts` — экспорт API-классов
- ✅ Обновить `src/features/api/index.ts` — экспорт всех API-классов

## Шаг 3: Хранилище состояния (Store) и HOC connect ✅ ВЫПОЛНЕНО
- ✅ Создать `src/shared/utils/isEqual.ts` — рекурсивное сравнение объектов
- ✅ Создать `src/shared/utils/merge.ts` — иммутабельное объединение объектов
- ✅ Создать `src/shared/utils/set.ts` — установка значения по вложенному пути
- ✅ Создать `src/shared/utils/types.ts` — тип `Indexed<T>`
- ✅ Создать `src/shared/utils/store/store.ts` — Singleton Store с `getState`, `setState`, `subscribe`, `emit`
- ✅ Создать `src/shared/utils/store/connect.ts` — HOC `connect(mapStateToProps)` с оптимизацией через `isEqual`
- ✅ Создать `src/shared/utils/store/index.ts` — экспорт `store` и `connect`
- ✅ Обновить `src/shared/utils/index.ts` — экспорт всех утилит

## Шаг 4: Роутер ✅ ВЫПОЛНЕНО
- ✅ Создать `src/shared/utils/renderDOM.ts` — утилита для вставки компонента в DOM
- ✅ Создать `src/features/router/route.ts` — класс `Route` (маршрут: URL + компонент)
- ✅ Создать `src/features/router/router.ts` — класс `Router` (Singleton, управление маршрутами)
- ✅ Создать `src/features/router/index.ts` — экспорт `Router`, `Route`
- ✅ Обновить `src/features/index.ts` — экспорт роутера
- ✅ Обновить `src/init/app.ts` — подключение роутера, замена hash-роутинга на real paths
- ✅ Маршруты: `/` → `LoginPage`, `/sign-up` → `RegisterPage`, `/settings` → `ProfilePage`, `/messenger` → `ChatPage`, `/404` → `Error404Page`, `/500` → `Error500Page`
- ✅ Исправление бага: замена `replaceChild` на `appendChild` в `renderDOM.ts` (страницы остаются в DOM, переключение через `display: none`)
- ✅ Исправление TypeScript-ошибок в `route.ts` и `router.ts`

## Шаг 5: Контроллеры (MVC)
- **AuthController** — логика входа, регистрации, выхода (валидация, вызов API, обновление Store, роутинг)
- **UserController** — обновление профиля, пароля, аватара
- **ChatController** — получение списка чатов, поиск пользователей, управление чатами
- Контроллеры НЕ вызывают API напрямую — через API-классы

## Шаг 6: Интеграция с API на страницах
- **LoginPage:** вызов `AuthController.login()` при отправке формы
- **RegisterPage:** вызов `AuthController.register()` при отправке формы
- **ChatPage:** вызов `ChatController.getChats()` при монтировании
- **ProfilePage:** вызов `UserController` для обновления данных/пароля/аватара
- Кнопка выхода → `AuthController.logout()` → переход на `/`

## Шаг 7: Работа с файлами
- Загрузка аватара пользователя — `PUT /user/profile/avatar` с `FormData`
- Загрузка аватара чата — `PUT /chats/avatar` с `FormData`

## Шаг 8: Обновление страниц
- Убрать мок-данные, подгружать реальные через API
- Обработка ошибок (переход на `/404` или `/500` при ошибках)
- Сохранение состояния авторизации при перезагрузке (`GET /auth/user`)
- Подписка компонентов на Store через `connect`

## Шаг 9: Обновление документации
- Обновить `README.md` с информацией о роутинге, API, HTTP-классе, Store, контроллерах
- Добавить ссылку на развёрнутую версию в Netlify
