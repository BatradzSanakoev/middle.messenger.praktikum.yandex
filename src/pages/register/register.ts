import { Block, type BlockOwnProps } from "@shared/ui/block";
import inputStyles from "@shared/ui/input/input.module.css";
import styles from "./register.module.css";
import { validate, type ValidationKey } from "@features/validation";
import template from "./register.hbs?raw";

interface RegisterProps extends BlockOwnProps {
  styles: typeof styles;
}

export class RegisterPage extends Block<RegisterProps> {
  static componentName = "RegisterPage";

  protected template = template;

  constructor() {
    super({ styles });
    this.events = {
      submit: (e: Event) => {
        e.preventDefault();

        const form = this.element() as HTMLFormElement;
        const inputs = form.querySelectorAll<HTMLInputElement>("input");
        let hasError = false;

        inputs.forEach((input) => {
          const validationKey = input.getAttribute("data-validation-key");
          if (!validationKey) return;

          const error = validate(input.value, validationKey as ValidationKey);
          const wrapper = input.closest("[class*='inputWrapper']");
          if (wrapper) {
            const errorSpan = wrapper.querySelector("[class*='error']");
            const inputElement = wrapper.querySelector("input");

            if (error) {
              hasError = true;
              if (!errorSpan) {
                const span = document.createElement("span");
                span.className = inputStyles.error;
                span.textContent = error;
                wrapper.appendChild(span);
              } else {
                errorSpan.textContent = error;
              }
              inputElement?.classList.add(inputStyles.inputError);
            }
          }
        });

        if (hasError) return;

        const formData = new FormData(form);
        const data: Record<string, string> = {};
        formData.forEach((value, key) => (data[key] = value as string));
        console.log("Form data:", data);
      },
    };
  }
}
