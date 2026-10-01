import templateRaw from './404.hbs?raw';
import Handlebars from 'handlebars';
import styles from './404.module.css';

const template = Handlebars.compile(templateRaw);

export class Error404Page {
  render(container: HTMLElement) {
    const html = template({ styles });

    const fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}
