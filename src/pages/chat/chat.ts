import { Block } from "@shared/ui/block";
import { validateForm } from "@features";
import { ChatController } from "@features/controllers";
import { Router } from "@features/router";
import type { ChatResponse, ChatUser } from "@features/api";

import styles from "./chat.module.css";
import template from "./chat.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";
import { connect, store } from "@/shared/utils";
import { CreateChatModal } from "./create-chat-modal";
import { AddUserModal } from "./add-user-modal";
import { RemoveUserModal } from "./remove-user-modal";

// Пропсы страницы чатов
interface ChatPageProps extends BlockOwnProps {
  chats?: ChatItem[];
  styles: typeof styles;
  selectedChatId?: number | null;
  chatUsers?: Record<number, ChatUser[]>;
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
const mapStateToProps = (state: Record<string, unknown>) => {
  const rawChats = (state.chats as ChatResponse[]) || [];
  // Получаем selectedChatId из store для правильного выделения
  const selectedChatId = state.selectedChatId as number | null | undefined;
  // Получаем загруженных пользователей чатов из store
  const chatUsers = (state.chatUsers as Record<number, ChatUser[]>) || {};

  // Создаём массив чатов с правильным isSelected
  const chats: ChatItem[] = rawChats.map((chat) => ({
    id: chat.id,
    title: chat.title,
    avatarUrl: chat.avatar,
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

  return {
    chats,
    styles,
    selectedChatId,
    chatUsers,
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
        if (form) {
          validateForm(form as HTMLFormElement);
        }
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
        const chatItem = target.closest('[data-chat-id]');
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
    // Обновляем панель пользователей
    this.updateUsersList([]);
    // Загружаем чаты из контроллера
    ChatController.getChats().catch(() => {
      Router.getInstance().go("/500");
    });
  }

  // Вызывается при первом рендере (перезагрузка страницы) — загружает чаты из контроллера
  protected componentDidMount(): void {
    ChatController.getChats().catch(() => {
      Router.getInstance().go("/500");
    });
  }

  // Выбирает чат: обновляет UI, Store и загружает пользователей
  private selectChat(chatId: number): void {
    // Если тот же чат уже выбран — ничего не делаем
    if (this.selectedChatId === chatId) return;

    // Снимаем выделение со старого чата в DOM
    if (this.selectedChatId !== null) {
      const oldItem = this.element()?.querySelector(`[data-ref="chatItem"][data-chat-id="${this.selectedChatId}"]`);
      if (oldItem) {
        oldItem.classList.remove(styles.selected);
      }
    }

    // Обновляем selectedChatId в Store — это триггерит re-render через connect
    store.setState("selectedChatId", chatId);

    // Обновляем локальное состояние
    this.selectedChatId = chatId;

    // Загружаем пользователей чата — всегда, при каждом выборе
    this.loadChatUsers(chatId);
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

    usersList.textContent = filteredUsers.map((u) => u.display_name).join(", ");
  }

  // Обновление пропсов с ре-рендером и обновлением списка пользователей
  public setProps(props: Partial<ChatPageProps>) {
    super.setProps(props);
    // Обновляем список пользователей из Store, если есть данные
    const chatUsers = (props.chatUsers as Record<number, ChatUser[]>) || this.props.chatUsers;
    if (chatUsers && this.selectedChatId && chatUsers[this.selectedChatId]) {
      this.updateUsersList(chatUsers[this.selectedChatId]);
    }
  }

  // Загружает пользователей чата
  private loadChatUsers(chatId: number): void {
    ChatController.getChatUsers(chatId).then((users) => {
      // Сохраняем в Store для обновления через setProps
      const existingUsers = store.getState().chatUsers as Record<number, ChatUser[]> || {};
      store.setState("chatUsers", { ...existingUsers, [chatId]: users });
      this.updateUsersList(users);
    }).catch(() => {
      Router.getInstance().go("/500");
    });
  }
}

// Подписка на Store — компонент обновляется при изменении чатов
export const ConnectedChatPage = connect(ChatPage, mapStateToProps);
