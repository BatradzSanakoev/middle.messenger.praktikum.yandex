import templateRaw from './500.hbs?raw';
import Handlebars from 'handlebars';
import styles from './500.module.css';

const template = Handlebars.compile(templateRaw);

export class Error500Page {
  render(container: HTMLElement) {
    const html = template({ styles });

    const fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}
