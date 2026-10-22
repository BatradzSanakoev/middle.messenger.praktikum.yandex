import { Block, type BlockOwnProps } from "@shared/ui/block";
import buttonStyles from "./button.module.css";
import template from "./button.hbs?raw";

interface ButtonProps extends BlockOwnProps {
  text: string;
  dataRole?: string;
  styles: typeof buttonStyles;
}

export class Button extends Block<ButtonProps> {
  static componentName = "Button";

  protected template = template;

  constructor(props: ButtonProps) {
    super({ ...props, styles: buttonStyles });
  }
}
