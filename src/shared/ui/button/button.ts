import templateRaw from './button.hbs?raw';
import Handlebars from 'handlebars';
import styles from './button.module.css';

const template = Handlebars.compile(templateRaw);

export class Button {
  constructor(container: HTMLElement, options: { text: string; variant?: string }) {
    const variantClass = options.variant ? styles[options.variant] : '';
    const html = template({ ...options, styles, variantClass });

    const fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}
