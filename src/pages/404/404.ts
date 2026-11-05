import { Block } from "@shared/ui/block";

import styles from "./404.module.css";
import template from "./404.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы страницы 404
interface Error404Props extends BlockOwnProps {
  styles: typeof styles;
}

// Страница ошибки 404 — страница не найдена
export class Error404Page extends Block<Error404Props> {
  static componentName = "Error404Page";

  // Handlebars-шаблон страницы
  protected template = template;

  // Конструктор: инициализирует страницу с стилями
  constructor() {
    super({ styles });
  }
}
