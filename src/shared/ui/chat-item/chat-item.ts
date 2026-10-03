import { chatItemStyles } from ".";
import { chatItemTemplate } from "./chat-item.template";

export interface ChatItemData {
  id: number;
  title: string;
  avatarUrl: string;
  unreadCount: number;
  lastMessage: {
    author: string;
    text: string;
    time: string;
  };
}

export class ChatItem {
  constructor(container: HTMLElement, data: ChatItemData) {
    const html = chatItemTemplate({
      ...data,
      styles: chatItemStyles,
    });

    const fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}
