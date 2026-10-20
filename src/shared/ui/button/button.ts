import { Block, type BlockOwnProps } from "@shared/ui/block";
import buttonStyles from "./button.module.css";

interface ButtonProps extends BlockOwnProps {
  text: string;
  dataRole?: string;
  styles: typeof buttonStyles;
}

export class Button extends Block<ButtonProps> {
  static componentName = "Button";

  protected template = `
    <button class="{{ styles.button }}" {{#if dataRole}}data-role="{{ dataRole }}"{{/if}}>
      {{ text }}
    </button>
  `;

  constructor(props: ButtonProps) {
    super({ ...props, styles: buttonStyles });
  }
}
