import { Block, type BlockOwnProps } from "@shared/ui/block";
import styles from "./chat.module.css";
import template from "./chat.hbs?raw";
import { chats } from "@helpers/mocks/chats";

interface ChatPageProps extends BlockOwnProps {
  chats: typeof chats;
  styles: typeof styles;
}

export class ChatPage extends Block<ChatPageProps> {
  static componentName = "ChatPage";

  protected template = template;

  constructor() {
    super({ chats, styles });
  }
}
