import { Block, type BlockOwnProps } from "@shared/ui/block";
import chatItemStyles from "./chat-item.module.css";

export interface ChatItemData extends BlockOwnProps {
  id: number;
  title: string;
  avatarUrl: string;
  alt?: string;
  unreadCount: number;
  lastMessage: {
    author: string;
    text: string;
    time: string;
  };
  styles: typeof chatItemStyles;
}

export class ChatItem extends Block<ChatItemData> {
  static componentName = "ChatItem";

  protected template = `
    <div class="{{ styles.chatItem }}">
      <img class="{{ styles.avatar }}" src="{{ avatarUrl }}" alt="{{ alt || title }}" />
      <div class="{{ styles.content }}">
        <div class="{{ styles.header }}">
          <span class="{{ styles.title }}">{{ title }}</span>
          <span class="{{ styles.time }}">{{ lastMessage.time }}</span>
        </div>
        <div class="{{ styles.footer }}">
          <span class="{{ styles.author }}">{{ lastMessage.author }}:</span>
          <span class="{{ styles.lastText }}">{{ lastMessage.text }}</span>
          {{#if unreadCount}}
            <span class="{{ styles.badge }}">
              {{ unreadCount }}
            </span>
          {{/if}}
        </div>
      </div>
    </div>
  `;

  constructor(props: ChatItemData) {
    super({ ...props, styles: chatItemStyles });
  }
}
