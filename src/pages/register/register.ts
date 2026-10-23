<<<<<<< HEAD
import { Block } from "@shared/ui/block";
import { validateForm } from "@features";
=======
import templateRaw from "./register.hbs?raw";
import Handlebars from "handlebars";
import styles from "./register.module.css";
>>>>>>> 4bd676ab9adaaf0fbf1b64aa8639fb8d60224d33

import styles from "./register.module.css";
import template from "./register.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы страницы регистрации
interface RegisterProps extends BlockOwnProps {
  styles: typeof styles;
}

// Страница регистрации с формой создания аккаунта
export class RegisterPage extends Block<RegisterProps> {
  static componentName = "RegisterPage";

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
