import { Block } from "@shared/ui/block";
import { validate } from "@features/validation";

import inputStyles from "./input.module.css";
import template from "./input.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";
import type { ValidationKey } from "@features/validation";

// Пропсы компонента Input
interface InputProps extends BlockOwnProps {
  type?: string;
  name: string;
  id?: string;
  placeholder: string;
  value?: string;
  disabled?: boolean;
  error?: string;
  validationKey?: ValidationKey;
  required?: boolean;
  styles: typeof inputStyles;
}

// Компонент поля ввода с валидацией по blur
export class Input extends Block<InputProps> {
  static componentName = "Input";

  // Handlebars-шаблон компонента
  protected template = template;

  // Конструктор: создаёт input с стилями и вешает обработчик blur для валидации
  constructor(props: InputProps) {
    super({ ...props, styles: inputStyles });
    this.events = {
      // Обработчик blur (focusout) — валидирует поле при потере фокуса
      focusout: (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (!this.props.validationKey) return;

        // Вызываем валидацию
        const error = validate(input.value, this.props.validationKey);
        const wrapper = this.element();
        const errorSpan = wrapper?.querySelector("[class*='error']");
        const inputElement = wrapper?.querySelector("input");

        // Обновляем значение в DOM
        if (inputElement) {
          inputElement.value = input.value;
        }

        // Если есть ошибка — показываем её, иначе убираем
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
