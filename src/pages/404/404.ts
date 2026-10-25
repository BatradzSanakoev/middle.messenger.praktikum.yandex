<<<<<<< Updated upstream
import { Block } from "@shared/ui/block";

import styles from "./404.module.css";
import template from "./404.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы страницы 404
interface Error404Props extends BlockOwnProps {
  styles: typeof styles;
}

=======
<<<<<<< HEAD
import templateRaw from "./404.hbs?raw";
import Handlebars from "handlebars";
import styles from "./404.module.css";
=======
import { Block } from "@shared/ui/block";
>>>>>>> 85bb16bb9c8f929c7c21d55d023a376cc5e52e87

import styles from "./404.module.css";
import template from "./404.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы страницы 404
interface Error404Props extends BlockOwnProps {
  styles: typeof styles;
}

>>>>>>> Stashed changes
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
