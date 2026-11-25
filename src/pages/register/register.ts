import { Block } from "@shared/ui/block";
import { validateForm } from "@features";
import { AuthController } from "@features/controllers";
import { Router } from "@features/router";

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

  // Показывает ошибку в форме
  private showFormError(message: string): void {
    const form = this.element();
    let slot = form?.querySelector<HTMLElement>("[data-role='form-error']");
    if (!slot && form) {
      slot = document.createElement("div");
      slot.setAttribute("data-role", "form-error");
      slot.className = styles.formError;
      form.appendChild(slot);
    }
    if (slot) slot.textContent = message;
  }

  // Конструктор: инициализирует обработчики событий
  constructor() {
    super({ styles });
    this.events = {
      // Обработчик отправки формы — валидация и вызов контроллера регистрации
      submit: (e: Event) => {
        e.preventDefault();
        const form = this.element() as HTMLFormElement;

        if (!validateForm(form)) return;

        const formData = new FormData(form);
        AuthController.signup({
          first_name: formData.get("first_name") as string,
          second_name: formData.get("second_name") as string,
          login: formData.get("login") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
          password: formData.get("password") as string,
        }).catch((err) => {
          const reason = (err as { response?: { reason?: string } })?.response?.reason;
          if (reason === "User already in system") {
            Router.getInstance().go("/messenger");
            return;
          }
          if (reason) {
            this.showFormError(reason);
          } else {
            Router.getInstance().go("/500");
          }
        });
      },
      // Обработчик клика по ссылке "Войти" — переход на страницу логина
      click: (e: Event) => {
        const target = e.target as HTMLElement;
        const loginLink = target.closest('[data-ref="loginLink"]');
        if (loginLink) {
          Router.getInstance().go("/");
        }
      },
    };
  }
}
