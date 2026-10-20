import { Block, type BlockOwnProps } from "@shared/ui/block";
import inputStyles from "./input.module.css";

interface InputProps extends BlockOwnProps {
  type?: string;
  name: string;
  id?: string;
  placeholder: string;
  value?: string;
  disabled?: boolean;
  error?: string;
  styles: typeof inputStyles;
}

export class Input extends Block<InputProps> {
  static componentName = "Input";

  protected template = `
    <div class="{{ styles.inputWrapper }}">
      <input
        type="{{ type }}"
        name="{{ name }}"
        {{#if id}}
          id="{{ id }}"
        {{/if}}
        placeholder="{{ placeholder }}"
        value="{{ value }}"
        {{#if disabled}}
          disabled
        {{/if}}
        class="
          {{ styles.input }}
          {{#if error}}
            {{ styles.inputError }}
          {{/if}}
        "
      />
      {{#if error}}
        <span class="{{ styles.error }}">
          {{ error }}
        </span>
      {{/if}}
    </div>
  `;

  constructor(props: InputProps) {
    super({ ...props, styles: inputStyles });
  }
}
