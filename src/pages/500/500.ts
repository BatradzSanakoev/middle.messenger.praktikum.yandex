import { Block } from "@shared/ui/block";

import styles from "./500.module.css";
import template from "./500.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы страницы 500
interface Error500Props extends BlockOwnProps {
  styles: typeof styles;
}

// Страница ошибки 500 — ошибка сервера
export class Error500Page extends Block<Error500Props> {
  static componentName = "Error500Page";

  // Handlebars-шаблон страницы
  protected template = template;

  // Конструктор: инициализирует страницу с стилями
  constructor() {
    super({ styles });
  }
}
