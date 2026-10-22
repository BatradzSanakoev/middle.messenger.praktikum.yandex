import { Block, type BlockOwnProps } from "@shared/ui/block";
import styles from "./500.module.css";
import template from "./500.hbs?raw";

interface Error500Props extends BlockOwnProps {
  styles: typeof styles;
}

export class Error500Page extends Block<Error500Props> {
  static componentName = "Error500Page";

  protected template = template;

  constructor() {
    super({ styles });
  }
}
