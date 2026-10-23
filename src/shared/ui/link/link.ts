import { Block } from "@shared/ui/block";

import linkStyles from "./link.module.css";
import template from "./link.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы компонента Link
interface LinkProps extends BlockOwnProps {
  href: string;
  text: string;
  styles: typeof linkStyles;
}

// Компонент ссылки
export class Link extends Block<LinkProps> {
  static componentName = "Link";

  // Handlebars-шаблон компонента
  protected template = template;

  // Конструктор: создаёт ссылку с переданными пропсами
  constructor(props: LinkProps) {
    super({ ...props, styles: linkStyles });
  }
}
