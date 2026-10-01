import { inputStyles } from ".";
import { inputTemplate } from "./input.template";

export class Input {
  constructor(
    container: HTMLElement,
    options: {
      type?: string;
      name: string;
      placeholder: string;
      value?: string;
      error?: string;
    },
  ) {
    const html = inputTemplate({
      ...options,
      styles: inputStyles,
      type: options.type || "text",
    });

    const fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}
