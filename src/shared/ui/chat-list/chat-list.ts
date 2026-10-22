import { Block, type BlockOwnProps } from "@shared/ui/block";
import chatListStyles from "./chat-list.module.css";
import template from "./chat-list.hbs?raw";

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

export interface ChatListProps extends BlockOwnProps {
  chats: ChatItem[];
  styles: typeof chatListStyles;
}

export class ChatList extends Block<ChatListProps> {
  static componentName = "ChatList";

  protected template = template;

  constructor(props: ChatListProps) {
    super({ ...props, styles: chatListStyles });
  }
}
