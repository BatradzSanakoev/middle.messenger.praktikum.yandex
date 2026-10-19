import Handlebars from "handlebars";
import { chats } from "../../helpers/mocks/chats";
import templateRaw from "./chat.hbs?raw";
import styles from "./chat.module.css";

const template = Handlebars.compile(templateRaw);

export class ChatPage {
  render(container: HTMLElement) {
    const html = template({ styles, chats });

    const fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}
