import { buttonStyles } from ".";
import { buttonTemplate } from "./button.template";

export class Button {
  constructor(container: HTMLElement, options: { text: string }) {
    const html = buttonTemplate({ text: options.text, styles: buttonStyles });

    const fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}
