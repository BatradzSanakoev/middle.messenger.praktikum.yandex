import templateRaw from './register.hbs?raw';
import Handlebars from 'handlebars';
import styles from './register.module.css';

const template = Handlebars.compile(templateRaw);

export class RegisterPage {
  render(container: HTMLElement) {
    const html = template({ styles });

    const fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}
