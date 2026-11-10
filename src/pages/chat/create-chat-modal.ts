import { Modal } from "@shared/ui/modal";
import { ChatController } from "@features/controllers";
import Handlebars from "handlebars";

import templateRaw from "./create-chat-modal.hbs?raw";
import styles from "./create-chat-modal.module.css";

// Компилированный шаблон тела модалки
const template = Handlebars.compile(templateRaw);

/**
 * Модалка для создания нового чата.
 * Содержит поле ввода названия и кнопку "Создать" (рендерится Modal).
 */
export class CreateChatModal {
  // Внутренний компонент Modal
  private modal: Modal | null = null;

  /**
   * Показывает модалку создания чата.
   * Блокирует кнопку "Создать", пока инпут пустой.
   */
  show() {
    const bodyHtml = template({ styles });

    this.modal = new Modal({
      title: "Создайте чат",
      body: bodyHtml,
      buttonText: "Создать",
      styles,
    });

    this.modal.show();

    const element = this.modal.element();
    const input = element?.querySelector<HTMLInputElement>('input[name="title"]');
    const button = element?.querySelector<HTMLButtonElement>('[data-role="modal-action-btn"]');

    if (!input || !button) return;

    // Блокируем кнопку, пока инпут пустой
    button.disabled = !input.value.trim();

    // Разблокируем при вводе
    input.addEventListener('input', () => {
      button.disabled = !input.value.trim();
    });

    // Отправка при клике на кнопку
    button.addEventListener('click', async () => {
      const title = input.value.trim();
      if (!title) return;

      await ChatController.createChat({ title });
      this.close();
    });
  }

  // Закрывает модалку
  close() {
    this.modal?.close();
  }
}
