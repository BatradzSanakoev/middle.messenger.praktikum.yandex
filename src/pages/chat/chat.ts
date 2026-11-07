import { Block } from "@shared/ui/block";
import { validateForm } from "@features";
import { ChatController } from "@features/controllers";
import { Router } from "@features/router";
import type { ChatResponse } from "@features/api";

import styles from "./chat.module.css";
import template from "./chat.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";
import { connect } from "@/shared/utils";

// Пропсы страницы чатов
interface ChatPageProps extends BlockOwnProps {
  chats?: ChatItem[];
  styles: typeof styles;
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
}

// Карта данных из Store в props компонента
const mapStateToProps = (state: Record<string, unknown>) => {
  const rawChats = (state.chats as ChatResponse[]) || [];
  return {
    chats: rawChats.map((chat) => ({
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
    })),
    styles,
  };
};

// Страница чатов со списком чатов и полем ввода сообщения
export class ChatPage extends Block<ChatPageProps> {
  static componentName = "ChatPage";

  // Handlebars-шаблон страницы
  protected template = template;

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
    };
  }

  // Вызывается при каждом переходе на страницу — загружает чаты из контроллера
  protected onEnter(): void {
    ChatController.getChats().catch(() => {
      Router.getInstance().go("/500");
    });
  }
}

// Подписка на Store — компонент обновляется при изменении чатов
export const ConnectedChatPage = connect(ChatPage, mapStateToProps);
