import { linkStyles } from ".";
import { linkTemplate } from "./link.template";

export class Link {
  constructor(
    container: HTMLElement,
    options: {
      href: string;
      text: string;
    },
  ) {
    const html = linkTemplate({
      ...options,
      styles: linkStyles,
    });

    const fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}
