import { Block } from "@shared/ui/block";

import buttonStyles from "./button.module.css";
import template from "./button.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы компонента Button
interface ButtonProps extends BlockOwnProps {
  text: string;
  type?: "button" | "submit" | "reset";
  dataRole?: string;
  styles: typeof buttonStyles;
}

// Компонент кнопки
export class Button extends Block<ButtonProps> {
  static componentName = "Button";

  // Handlebars-шаблон компонента
  protected template = template;

  // Конструктор: создаёт кнопку с переданными пропсами
  constructor(props: ButtonProps) {
    super({ ...props, styles: buttonStyles });
  }
}
