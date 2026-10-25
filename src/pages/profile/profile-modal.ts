import { Modal } from "@shared/ui/modal";
import Handlebars from "handlebars";

import templateRaw from "./profile-modal.hbs?raw";
import styles from "./profile-modal.module.css";

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
      styles,
    });

    this.modal.show();
  }

  // Закрывает модалку
  close() {
    this.modal?.close();
  }
}
