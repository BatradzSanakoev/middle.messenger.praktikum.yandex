import { Block, type BlockOwnProps } from "@shared/ui/block";
import inputStyles from "./input.module.css";
import { validate, type ValidationKey } from "@features/validation";
import template from "./input.hbs?raw";

interface InputProps extends BlockOwnProps {
  type?: string;
  name: string;
  id?: string;
  placeholder: string;
  value?: string;
  disabled?: boolean;
  error?: string;
  validationKey?: ValidationKey;
  styles: typeof inputStyles;
}

export class Input extends Block<InputProps> {
  static componentName = "Input";

  protected template = template;

  constructor(props: InputProps) {
    super({ ...props, styles: inputStyles });
    this.events = {
      focusout: (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (!this.props.validationKey) return;

        const error = validate(input.value, this.props.validationKey);
        const wrapper = this.element();
        const errorSpan = wrapper?.querySelector("[class*='error']");
        const inputElement = wrapper?.querySelector("input");

        // Обновляем value инпута
        if (inputElement) {
          inputElement.value = input.value;
        }

        if (error) {
          if (!errorSpan) {
            const span = document.createElement("span");
            span.className = inputStyles.error;
            span.textContent = error;
            wrapper?.appendChild(span);
          } else {
            errorSpan.textContent = error;
          }
          inputElement?.classList.add(inputStyles.inputError);
        } else {
          if (errorSpan) errorSpan.remove();
          inputElement?.classList.remove(inputStyles.inputError);
        }
      },
    };
  }
}
