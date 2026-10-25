<<<<<<< Updated upstream
import { Block } from "@shared/ui/block";

import styles from "./500.module.css";
import template from "./500.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы страницы 500
interface Error500Props extends BlockOwnProps {
  styles: typeof styles;
}

=======
<<<<<<< HEAD
import templateRaw from "./500.hbs?raw";
import Handlebars from "handlebars";
import styles from "./500.module.css";
=======
import { Block } from "@shared/ui/block";
>>>>>>> 85bb16bb9c8f929c7c21d55d023a376cc5e52e87

import styles from "./500.module.css";
import template from "./500.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы страницы 500
interface Error500Props extends BlockOwnProps {
  styles: typeof styles;
}

>>>>>>> Stashed changes
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
