<<<<<<< Updated upstream
import { Block } from "@shared/ui/block";
import { validateForm } from "@features";

import styles from "./register.module.css";
import template from "./register.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы страницы регистрации
interface RegisterProps extends BlockOwnProps {
  styles: typeof styles;
}

=======
<<<<<<< HEAD
import templateRaw from "./register.hbs?raw";
import Handlebars from "handlebars";
import styles from "./register.module.css";
=======
import { Block } from "@shared/ui/block";
import { validateForm } from "@features";
>>>>>>> 85bb16bb9c8f929c7c21d55d023a376cc5e52e87

import styles from "./register.module.css";
import template from "./register.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы страницы регистрации
interface RegisterProps extends BlockOwnProps {
  styles: typeof styles;
}

>>>>>>> Stashed changes
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
