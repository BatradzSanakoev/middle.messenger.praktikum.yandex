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
    // Если модалка уже открыта — не создаём новую
    if (this.modal) return;

    const bodyHtml = template({ styles });

    this.modal = new Modal({
      title: "Создайте чат",
      body: bodyHtml,
      styles,
    });

    this.modal.show();

    const element = this.modal.element();
    const input = element?.querySelector<HTMLInputElement>('input[name="title"]');
    const form = element?.querySelector<HTMLFormElement>('form');
    const button = form?.querySelector<HTMLButtonElement>('[data-role="modal-action-btn"]');

    if (!input || !form || !button) return;

    // Блокируем кнопку, пока инпут пустой
    button.disabled = !input.value.trim();

    // Разблокируем при вводе
    input.addEventListener('input', () => {
      button.disabled = !input.value.trim();
    });

    // Обработчик сабмита формы
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = input.value.trim();
      if (!title) return;

      await ChatController.createChat({ title });
      this.close();
    });
  }

  // Закрывает модалку
  close() {
    this.modal?.close();
    this.modal = null;
  }
}
