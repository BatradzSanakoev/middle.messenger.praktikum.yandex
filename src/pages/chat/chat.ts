import templateRaw from "./chat.hbs?raw";
import Handlebars from "handlebars";
import styles from "./chat.module.css";
import { chats } from "../../helpers/mocks/chats";

const template = Handlebars.compile(templateRaw);

export class ChatPage {
  render(container: HTMLElement) {
    const html = template({ styles, chats });

    const fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}
