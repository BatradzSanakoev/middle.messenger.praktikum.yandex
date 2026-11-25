import { Block } from "@shared/ui/block";
import { validateForm } from "@features";
import { ChatController } from "@features/controllers";
import { Router } from "@features/router";
import type { ChatResponse, ChatUser } from "@features/api";
import { WebSocketService } from "@features/websocket";

import styles from "./chat.module.css";
import template from "./chat.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";
import { connect, store } from "@/shared/utils";
import { formatTime } from "@/shared/utils/formatTime";
import type { ChatMessage } from "@/features/websocket/types";
import { CreateChatModal } from "./create-chat-modal";
import { AddUserModal } from "./add-user-modal";
import { RemoveUserModal } from "./remove-user-modal";

// Пропсы страницы чатов
interface ChatPageProps extends BlockOwnProps {
  chats?: ChatItem[];
  styles: typeof styles;
  selectedChatId?: number | null;
  chatUsers?: Record<number, ChatUser[]>;
  messages?: Array<ChatMessage & { isMine?: boolean }>;
  currentUserId?: string;
  messageDisabled?: boolean;
}

// Структура элемента списка чатов
interface ChatItem {
  id: number;
  title: string;
  avatarUrl: string;
  alt: string;
  unreadCount: number;
  lastMessage: {
    author: string;
    text: string;
    time: string;
  };
  isSelected?: boolean;
}

// Карта данных из Store в props компонента
const AVATAR_BASE_URL = "https://ya-praktikum.tech/api/v2/resources";

const mapStateToProps = (state: Record<string, unknown>) => {
  const rawChats = (state.chats as ChatResponse[]) || [];
  // Получаем selectedChatId из store для правильного выделения
  const selectedChatId = state.selectedChatId as number | null | undefined;
  // Получаем загруженных пользователей чатов из store
  const chatUsers = (state.chatUsers as Record<number, ChatUser[]>) || {};
  // Получаем сообщения текущего чата из store
  const messagesState = (state.messages as Record<string, ChatMessage[]>) || {};
  const messages = selectedChatId ? messagesState[String(selectedChatId)] || [] : [];
  // Получаем ID текущего пользователя из store
  const user = state.user as Record<string, unknown> | null | undefined;
  const currentUserId = user?.id ? String(user.id) : "";

  // Создаём массив чатов с правильным isSelected
  const chats: ChatItem[] = rawChats.map((chat) => ({
    id: chat.id,
    title: chat.title,
    // Преобразуем относительный путь аватара в полный URL
    avatarUrl: chat.avatar
      ? chat.avatar.startsWith("http")
        ? chat.avatar
        : `${AVATAR_BASE_URL}${chat.avatar}`
      : "",
    alt: chat.title,
    unreadCount: 0,
    lastMessage: {
      author: "",
      text: "",
      time: "",
    },
    // Выделяем чат, если его ID совпадает с selectedChatId из store
    isSelected: chat.id === selectedChatId,
  }));

  // Вычисляем, заблокировано ли поле ввода (когда чат не выбран)
  const messageDisabled = !selectedChatId;

  // Добавляем isMine, messageClass и форматируем время для каждого сообщения
  const enrichedMessages = messages.map((msg) => {
    const isMine = String(msg.user_id) === currentUserId;
    return {
      ...msg,
      isMine,
      messageClass: isMine ? styles.myMessage : styles.otherMessage,
      time: formatTime(msg.time),
    };
  });

  return {
    chats,
    styles,
    selectedChatId,
    chatUsers,
    messages: enrichedMessages,
    currentUserId,
    messageDisabled,
  };
};

// Страница чатов со списком чатов и полем ввода сообщения
export class ChatPage extends Block<ChatPageProps> {
  static componentName = "ChatPage";

  // Handlebars-шаблон страницы
  protected template = template;

  // Текущий выбранный чат
  private selectedChatId: number | null = null;

  // Модальные окна
  private createChatModal: CreateChatModal | null = null;
  private addUserModal: AddUserModal | null = null;
  private removeUserModal: RemoveUserModal | null = null;

  // Конструктор: инициализирует обработчик отправки сообщения
  constructor(props?: ChatPageProps) {
    super(props || { styles });
    this.events = {
      // Обработчик сабмита формы отправки сообщения
      submit: (e: Event) => {
        e.preventDefault();
        // Находим форму внутри компонента
        const form = this.element()?.querySelector("form");
        if (!form) return;

        // Валидируем форму
        const isValid = validateForm(form as HTMLFormElement);
        if (!isValid) {
          return;
        }

        // Проверяем, что чат выбран
        if (!this.selectedChatId) {
          return;
        }

        // Собираем данные из формы
        const formData = new FormData(form as HTMLFormElement);
        const message = formData.get("message") as string;
        if (!message) {
          return;
        }

        // Отправляем через WebSocket
        const wsService = WebSocketService.getInstance();
        if (
          !wsService.send({
            content: message,
            type: "message",
          })
        ) {
          // eslint-disable-next-line no-console
          console.warn("Нет соединения, сообщение не отправлено");
          return;
        }

        // Очищаем поле ввода
        (form.querySelector('input[name="message"]') as HTMLInputElement).value = "";
      },
      // Обработчик кликов — определяет какая кнопка нажата
      click: (e: Event) => {
        const target = e.target as HTMLElement;
        const createBtn = target.closest('[data-ref="createChatBtn"]');
        if (createBtn) {
          // Создаём модалку при первом клике
          if (!this.createChatModal) {
            this.createChatModal = new CreateChatModal();
          }
          this.createChatModal.show();
        }
        // Обработчик клика на чат — выделяет выбранный чат и загружает пользователей
        const chatItem = target.closest("[data-chat-id]");
        if (chatItem) {
          const chatId = Number(chatItem.getAttribute("data-chat-id"));
          this.selectChat(chatId);
        }
        // Обработчик клика на кнопку "Добавить участника"
        const addUserBtn = target.closest('[data-ref="addUserBtn"]');
        if (addUserBtn) {
          if (this.selectedChatId) {
            if (!this.addUserModal) {
              this.addUserModal = new AddUserModal(this.selectedChatId);
            } else {
              this.addUserModal.setChatId(this.selectedChatId);
            }
            this.addUserModal.show();
          }
        }
        // Обработчик клика на кнопку "Удалить участника"
        const removeUserBtn = target.closest('[data-ref="removeUserBtn"]');
        if (removeUserBtn) {
          if (this.selectedChatId) {
            if (!this.removeUserModal) {
              this.removeUserModal = new RemoveUserModal(this.selectedChatId);
            } else {
              this.removeUserModal.setChatId(this.selectedChatId);
            }
            this.removeUserModal.show();
          }
        }
      },
    };
  }

  // Вызывается при каждом переходе на страницу — загружает чаты из контроллера и сбрасывает выбор
  protected onEnter(): void {
    // Сбрасываем выбранный чат при переходе на страницу
    this.selectedChatId = null;
    store.setState("selectedChatId", null);
    // Очищаем кэш пользователей в Store
    store.setState("chatUsers", {});
    // Очищаем сообщения
    store.setState("messages", {});
    // Обновляем панель пользователей
    this.updateUsersList([]);
    // Загружаем чаты из контроллера
    ChatController.getChats().catch(() => {
      Router.getInstance().go("/500");
    });
  }

  // Вызывается при первом рендере (перезагрузка страницы) — загружает чаты и подписывается на WebSocket
  protected componentDidMount(): void {
    this.setupMessageHandler();
    // Загружаем чаты из контроллера
    ChatController.getChats().catch(() => {
      Router.getInstance().go("/500");
    });
  }

  // Регистрирует обработчик входящих WebSocket-сообщений
  private setupMessageHandler(): void {
    WebSocketService.getInstance().onMessage((msg, fromChatId) => {
      // Фильтр по источнику, а не по текущему выбранному чату
      if (fromChatId !== String(this.selectedChatId)) return;

      const messagesState = (store.getState().messages as Record<string, ChatMessage[]>) || {};
      const chatId = fromChatId;

      const newMessages: ChatMessage[] = Array.isArray(msg)
        ? msg
        : msg.type === "message"
          ? [msg]
          : msg.type === "system" && "messages" in msg
            ? msg.messages
            : [];

      if (newMessages.length === 0) return;

      // Дедуп по id — на случай reconnect или повторного get old
      const existing = messagesState[chatId] || [];
      const ids = new Set(existing.map((m) => m.id));
      const unique = newMessages.filter((m) => !ids.has(m.id));
      if (unique.length === 0) return;

      const merged = [...existing, ...unique].sort((a, b) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      });
      store.setState("messages", {
        ...messagesState,
        [chatId]: merged,
      });
      // Автоскролл к последнему сообщению
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  // Вызывается при уходе со страницы — отключаем WebSocket
  protected onLeave(): void {
    WebSocketService.getInstance().disconnect();
    this.selectedChatId = null;
    store.setState("selectedChatId", null);
  }

  // Вызывается при реальном уничтожении компонента (fallback)
  protected componentWillUnmount(): void {
    WebSocketService.getInstance().disconnect();
  }

  // Выбирает чат: обновляет UI, Store и загружает пользователей
  private selectChat(chatId: number): void {
    // Если тот же чат уже выбран — ничего не делаем
    if (this.selectedChatId === chatId) return;

    // Снимаем выделение со старого чата в DOM
    if (this.selectedChatId !== null) {
      const oldItem = this.element()?.querySelector(
        `[data-ref="chatItem"][data-chat-id="${this.selectedChatId}"]`
      );
      if (oldItem) {
        oldItem.classList.remove(styles.selected);
      }
    }

    // Обновляем selectedChatId в Store — это триггерит re-render через connect
    store.setState("selectedChatId", chatId);

    // Обновляем локальное состояние
    this.selectedChatId = chatId;

    // Подключаемся к WebSocket для получения сообщений
    this.connectToChat(chatId);

    // Загружаем пользователей чата — всегда, при каждом выборе
    this.loadChatUsers(chatId);
  }

  // Подключается к WebSocket для выбранного чата
  private async connectToChat(chatId: number, retries = 0): Promise<void> {
    const maxRetries = 10;
    const currentUserId = this.props.currentUserId || "";

    // Если пользователь ещё не загрузился — пробуем снова через 500мс с лимитом попыток
    if (!currentUserId) {
      if (retries >= maxRetries) return;
      setTimeout(() => this.connectToChat(chatId, retries + 1), 500);
      return;
    }

    try {
      await WebSocketService.getInstance().connect(currentUserId, String(chatId));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Не удалось подключиться к чату:", err);
      return; // не падаем, пользователь может попробовать снова
    }
    // Историю запрашиваем только если в store её нет
    const existing = (store.getState().messages as Record<string, ChatMessage[]>)?.[String(chatId)];
    if (!existing || existing.length === 0) {
      WebSocketService.getInstance().sendOldMessages();
    }
  }

  // Обновляет панель пользователей
  private updateUsersList(users: ChatUser[]): void {
    const usersList = this.element()?.querySelector('[data-role="usersList"]');
    if (!usersList) return;

    if (!this.selectedChatId) {
      usersList.textContent = "";
      return;
    }

    // Фильтруем текущего пользователя (admin)
    const filteredUsers = users.filter((u) => u.role !== "admin");

    if (filteredUsers.length === 0) {
      usersList.textContent = "В чате нет участников";
      return;
    }

    usersList.textContent = filteredUsers
      .map((u) => u.display_name || u.login || u.first_name || String(u.id))
      .join(", ");
  }

  // Автоскролл к последнему сообщению
  private scrollToBottom(): void {
    const container = this.element()?.querySelector('[data-role="message-list"]') as HTMLElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  // Обновление пропсов с ре-рендером
  public setProps(props: Partial<ChatPageProps>) {
    // Сохраняем состояние input до пересоздания DOM
    const input = this.element()?.querySelector<HTMLInputElement>('input[name="message"]');
    const savedValue = input?.value ?? "";
    const hadFocus = input === document.activeElement;

    super.setProps(props);

    // Восстанавливаем — input пересоздан, но текст и фокус сохранены
    const fresh = this.element()?.querySelector<HTMLInputElement>('input[name="message"]');
    if (fresh) {
      if (savedValue) fresh.value = savedValue;
      if (hadFocus) fresh.focus();
    }

    // Список участников тоже пересоздаётся — обновляем из props
    if (this.selectedChatId) {
      this.updateUsersList(this.props.chatUsers?.[this.selectedChatId] ?? []);
    }
  }

  // Загружает пользователей чата
  private loadChatUsers(chatId: number): void {
    ChatController.getChatUsers(chatId)
      .then((users) => {
        // Сохраняем в Store для обновления через setProps
        const existingUsers = (store.getState().chatUsers as Record<number, ChatUser[]>) || {};
        store.setState("chatUsers", { ...existingUsers, [chatId]: users });
        this.updateUsersList(users);
      })
      .catch(() => {
        Router.getInstance().go("/500");
      });
  }
}

// Подписка на Store — компонент обновляется при изменении чатов
export const ConnectedChatPage = connect(ChatPage, mapStateToProps);
