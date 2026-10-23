import { Block } from "@shared/ui/block";
import { validateForm } from "@features";

import styles from "./login.module.css";
import template from "./login.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы страницы логина
interface LoginProps extends BlockOwnProps {
  styles: typeof styles;
}

// Страница авторизации с формой логина и пароля
export class LoginPage extends Block<LoginProps> {
  static componentName = "LoginPage";

  // Handlebars-шаблон страницы
  protected template = template;

  // Конструктор: инициализирует обработчик сабмита формы
  constructor() {
    super({ styles });
    this.events = {
      // Обработчик отправки формы — валидация и сбор данных
      submit: (e: Event) => {
        e.preventDefault();
        const form = this.element() as HTMLFormElement;
        validateForm(form);
      },
    };
  }
}
