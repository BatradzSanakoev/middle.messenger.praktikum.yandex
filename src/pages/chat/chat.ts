import { Block } from "@shared/ui/block";
import { chats } from "@helpers/mocks/chats";
import { validateForm } from "@features";

import styles from "./chat.module.css";
import template from "./chat.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы страницы чатов
interface ChatPageProps extends BlockOwnProps {
  chats: typeof chats;
  styles: typeof styles;
}

// Страница чатов со списком чатов и полем ввода сообщения
export class ChatPage extends Block<ChatPageProps> {
  static componentName = "ChatPage";

  // Handlebars-шаблон страницы
  protected template = template;

  // Конструктор: инициализирует обработчик отправки сообщения
  constructor() {
    super({ chats, styles });
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
}
