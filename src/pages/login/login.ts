import { Block } from "@shared/ui/block";
import { validateForm } from "@features";
import { AuthController } from "@features/controllers";
import { Router } from "@features/router";

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

  // Конструктор: инициализирует обработчики событий
  constructor() {
    super({ styles });
    this.events = {
      // Обработчик отправки формы — валидация и вызов контроллера авторизации
      submit: (e: Event) => {
        e.preventDefault();
        const form = this.element() as HTMLFormElement;
        
        if (!validateForm(form)) return;
        
        const formData = new FormData(form);
        AuthController.signin(formData.get("login") as string, formData.get("password") as string)
          .catch((err) => {
            if (err?.response?.reason === "User already in system") {
              Router.getInstance().go("/messenger");
            } else {
              Router.getInstance().go("/500");
            }
          });
      },
      // Обработчик клика по ссылке "Зарегистрироваться" — переход на страницу регистрации
      click: (e: Event) => {
        const target = e.target as HTMLElement;
        const registerLink = target.closest('[data-ref="registerLink"]');
        if (registerLink) {
          Router.getInstance().go("/sign-up");
        }
      },
    };
  }
}
