import { Block, type BlockOwnProps } from "@shared/ui/block";
import linkStyles from "./link.module.css";
import template from "./link.hbs?raw";

interface LinkProps extends BlockOwnProps {
  href: string;
  text: string;
  styles: typeof linkStyles;
}

export class Link extends Block<LinkProps> {
  static componentName = "Link";

  protected template = template;

  constructor(props: LinkProps) {
    super({ ...props, styles: linkStyles });
  }
}
