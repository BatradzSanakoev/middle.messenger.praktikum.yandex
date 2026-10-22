import { Block, type BlockOwnProps } from "@shared/ui/block";
import styles from "./404.module.css";
import template from "./404.hbs?raw";

interface Error404Props extends BlockOwnProps {
  styles: typeof styles;
}

export class Error404Page extends Block<Error404Props> {
  static componentName = "Error404Page";

  protected template = template;

  constructor() {
    super({ styles });
  }
}
