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
- ✅ Исправление наложения страниц: скрытие всех маршрутов при переходе вместо `currentRoute.leave()`

## Шаг 5: Контроллеры (MVC) ✅ ВЫПОЛНЕНО

- ✅ Создать `src/features/controllers/auth-controller.ts` — `signin`, `signup`, `logout`, `checkAuth`
- ✅ Создать `src/features/controllers/user-controller.ts` — `getProfile`, `updateProfile`, `updatePassword`, `updateAvatar`, `searchUsers`
- ✅ Создать `src/features/controllers/chat-controller.ts` — `getChats`, `createChat`, `deleteChat`, `getChatUsers`, `getUnreadCount`, `addUserToChat`, `removeUserFromChat`
- ✅ Создать `src/features/controllers/index.ts` — экспорт контроллеров
- ✅ Обновить `src/features/index.ts` — экспорт контроллеров
- ✅ Использование алиасов: `@shared/` для shared, относительные пути для `features/api`
- ✅ Все методы `async/await`
- ✅ Контроллеры НЕ вызывают API напрямую — через API-классы

## Шаг 6: Интеграция с API на страницах ✅

- ✅ **LoginPage:** вызов `AuthController.signin()` при отправке формы
- ✅ **RegisterPage:** вызов `AuthController.signup()` при отправке формы
- ✅ **ChatPage:** вызов `ChatController.getChats()` при каждом переходе на страницу (`onEnter`)
- ✅ **ProfilePage:** вызов `UserController.getProfile()` при каждом переходе на страницу
- ✅ **Сохранение данных:** `UserController.updateProfile()` при нажатии «Сохранить»
- ✅ **Смена пароля:** `UserController.updatePassword()` при нажатии «Сохранить» (с проверкой совпадения паролей)
- ✅ **Загрузка аватара:** `UserController.updateAvatar()` через модалку с валидацией файла
- ✅ **Logout:** `AuthController.logout()` при нажатии «Выйти»
- ✅ **Обработка ошибок:** переход на `/404` или `/500` при ошибках API

## Шаг 7: Работа с файлами ✅

- ✅ Загрузка аватара пользователя — `PUT /user/profile/avatar` с `FormData`
- ❌ Загрузка аватара чата — `PUT /chats/avatar` с `FormData` (API есть, но не используется на UI)
- ✅ Валидация файла: расширение (jpg, jpeg, png, gif, webp), размер (до 5 МБ)
- ✅ Отображение имени выбранного файла в модалке

## Шаг 8: Подписка на Store через connect ✅

- ✅ **ChatPage:** `connect(ChatPage, mapStateToProps)` — данные чатов обновляют props
- ✅ **ProfilePage:** `connect(ProfilePage, mapStateToProps)` — данные пользователя обновляют props
- ✅ **mapStateToProps:** извлекает данные из Store, добавляет BASE_URL для аватара
- ✅ **chat/index.ts:** переименование `ConnectedChatPage as ChatPage` для корректного экспорта
- ✅ **chat.ts:** `styles` включён в `mapStateToProps`, `chats` типизирован как `ChatItem[]`
- ✅ **connect.ts:** добавлен явный возвращаемый тип `: T` для корректной типизации HOC
- ✅ **password.ts:** `PasswordData` изменён на camelCase (`oldPassword`, `newPassword`)

## Шаг 9: onEnter — вызов при каждом переходе на страницу ✅

- ✅ **Block.ts:** добавлен хук `onEnter()` (protected, по умолчанию пустой)
- ✅ **route.ts:** при повторном переходе вызывается `onEnter()` перед `show()`
- ✅ **ChatPage:** `onEnter()` вызывает `ChatController.getChats()`
- ✅ **ProfilePage:** `onEnter()` вызывает `UserController.getProfile()` + сбрасывает UI-состояние формы пароля
- ✅ **ProfilePage:** `componentWillUnmount` — закрытие модалки аватара при уходе со страницы

## Шаг 10: Сохранение состояния авторизации при перезагрузке ✅

- ✅ **app.ts:** `AuthController.checkAuth()` вызывается при старте приложения
- ✅ Загружает данные пользователя из `GET /auth/user` и сохраняет в Store
- ✅ Если не авторизован — редирект на `/`

## Шаг 11: Исправления и доработки ✅

- ✅ **ProfilePage:** `saveData()` и `savePassword()` — сбор FormData, вызов API, обработка ошибок
- ✅ **ProfilePage:** сброс формы пароля при каждом входе на страницу
- ✅ **ProfilePage:** очистка полей пароля после успешного сохранения
- ✅ **ProfileModal:** обработка выбора файла, отображение имени файла, валидация, отправка на сервер
- ✅ **Modal:** кнопка ищется по `data-role` вместо `ref` (ref удаляется при компиляции)
- ✅ **profile-modal.hbs:** добавлен `<span data-role="file-name">` для отображения имени файла

## Шаг 12: Обновление документации ✅

- ✅ Обновить `README.md` с информацией о роутинге, API, HTTP-классе, Store, контроллерах

## Шаг 13: Исправления и доработки ✅

- ✅ **Block.ts:** добавлен флаг `_isFirstMount` — `componentDidMount` вызывается только при первом монтировании
- ✅ **Block.ts:** `setProps` больше не сбрасывает `__children` и `__refs`
- ✅ **Block.ts:** `compile()` вызывает `embed` для вставки вложенных компонентов
- ✅ **registerComponent.ts:** вставка DOM-элемента вложенного компонента в placeholder через `embed`
- ✅ **ChatPage:** визуальное выделение выбранного чата через `selectedChatId` в Store
- ✅ **ChatPage:** запрос на участников отправляется при каждом выборе чата
- ✅ **ChatPage:** участники сохраняются в Store (`chatUsers`), обновляются при добавлении/удалении
- ✅ **ChatPage:** фильтрация admin из списка участников — "В чате нет участников"
- ✅ **ChatPage:** кнопки "Добавить/Удалить" скрыты без выбранного чата (`{{#if selectedChatId}}`)
- ✅ **ChatPage:** сброс выбранного чата при переходе на другую страницу
- ✅ **ChatPage:** кнопки с отступом `gap: 1rem` через `.actionButtons`
- ✅ **ChatPage:** высота панелей синхронизирована (`height: 4rem`)
- ✅ **AddUserModal:** обновление участников после добавления через Store
- ✅ **RemoveUserModal:** новый компонент для удаления участника по логину
- ✅ **ChatAPI:** `addUser` и `removeUser` — поле `id` → `chatId`
- ✅ **ChatController:** `addUserToChat` и `removeUserFromChat` — передача `chatId`
- ✅ **ProfilePage:** слушатель аватара перенесён в `this.events.click`
- ✅ **ProfilePage:** URL аватара — `BASE_URL` = `https://ya-praktikum.tech/api/v2/resources`
- ✅ **ProfilePage:** проверка `startsWith("http")` — предотвращает дублирование URL
- ✅ **ProfileAvatar:** `object-fit: cover` и `border-radius: 50%`
- ✅ **ChatUser:** добавлено поле `role?: string`
