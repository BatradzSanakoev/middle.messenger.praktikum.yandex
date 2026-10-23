import { Block } from "@shared/ui/block";

import chatListStyles from "./chat-list.module.css";
import template from "./chat-list.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Структура одного элемента чата
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

// Пропсы компонента ChatList
export interface ChatListProps extends BlockOwnProps {
  chats: ChatItem[];
  styles: typeof chatListStyles;
}

// Компонент списка чатов
export class ChatList extends Block<ChatListProps> {
  static componentName = "ChatList";

  // Handlebars-шаблон компонента
  protected template = template;

  // Конструктор: создаёт список с переданными данными чатов
  constructor(props: ChatListProps) {
    super({ ...props, styles: chatListStyles });
  }
}
