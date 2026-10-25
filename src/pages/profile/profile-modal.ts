<<<<<<< Updated upstream
import { Modal } from "@shared/ui/modal";
=======
<<<<<<< HEAD
import templateRaw from "./profile-modal.hbs?raw";
>>>>>>> Stashed changes
import Handlebars from "handlebars";

import templateRaw from "./profile-modal.hbs?raw";
import styles from "./profile-modal.module.css";
<<<<<<< Updated upstream
=======
import { Modal } from "@shared/ui/modal";
=======
import { Modal } from "@shared/ui/modal";
import Handlebars from "handlebars";
>>>>>>> 85bb16bb9c8f929c7c21d55d023a376cc5e52e87

import templateRaw from "./profile-modal.hbs?raw";
import styles from "./profile-modal.module.css";
>>>>>>> Stashed changes

// Компилированный шаблон тела модалки
const template = Handlebars.compile(templateRaw);

// Модалка для загрузки аватара пользователя
export class ProfileModal {
  // Внутренний компонент Modal
  private modal: Modal | null = null;

  // Показывает модалку загрузки аватара
  show() {
    // Компилируем тело модалки с стилями
    const bodyHtml = template({ styles });

    // Создаём и показываем модальное окно
    this.modal = new Modal({
      title: "Загрузите файл",
      body: bodyHtml,
      buttonText: "Поменять",
<<<<<<< Updated upstream
      styles,
=======
<<<<<<< HEAD
=======
      styles,
>>>>>>> 85bb16bb9c8f929c7c21d55d023a376cc5e52e87
>>>>>>> Stashed changes
    });

    this.modal.show();
  }

  // Закрывает модалку
  close() {
    this.modal?.close();
  }
}
