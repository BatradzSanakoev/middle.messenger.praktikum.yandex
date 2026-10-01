import templateRaw from './login.hbs?raw';
import Handlebars from 'handlebars';
import styles from './login.module.css';

const template = Handlebars.compile(templateRaw);

export class LoginPage {
  render(container: HTMLElement) {
    const html = template({ styles });

    const fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}
