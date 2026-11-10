import { Modal } from "@shared/ui/modal";
import { UserController, ChatController } from "@features/controllers";
import Handlebars from "handlebars";
import store from "@/shared/utils/store/store";

import templateRaw from "./add-user-modal.hbs?raw";
import styles from "./add-user-modal.module.css";

// Компилированный шаблон тела модалки
const template = Handlebars.compile(templateRaw);

/**
 * Модалка для добавления участника в чат.
 * Содержит поле ввода логина и кнопку "Добавить".
 */
export class AddUserModal {
  // Внутренний компонент Modal
  private modal: Modal | null = null;
  // ID чата, в который добавляем
  private chatId: number;

  constructor(chatId: number) {
    this.chatId = chatId;
  }

  // Обновляет ID чата для добавления участника
  setChatId(chatId: number) {
    this.chatId = chatId;
  }

  /**
   * Показывает модалку добавления участника.
   * Блокирует кнопку, пока инпут пустой.
   */
  show() {
    const bodyHtml = template({ styles });

    this.modal = new Modal({
      title: "Добавить участника",
      body: bodyHtml,
      buttonText: "Добавить",
      styles,
    });

    this.modal.show();

    const element = this.modal.element();
    const input = element?.querySelector<HTMLInputElement>('input[name="login"]');
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
      const login = input.value.trim();
      if (!login) return;

      const errorSpan = element?.querySelector<HTMLSpanElement>('[data-role="error"]');

      try {
        // Ищем пользователя по логину
        const users = await UserController.searchUsers(login);

        if (users.length === 0) {
          // Пользователь не найден
          if (errorSpan) {
            errorSpan.textContent = "Пользователь не найден";
          }
          return;
        }

        // Берём первого найденного пользователя
        const userId = users[0].id;

        // Добавляем в чат
        await ChatController.addUserToChat(userId, this.chatId);

        // Обновляем список участников — запрашиваем свежие данные
        const updatedUsers = await ChatController.getChatUsers(this.chatId);
        store.setState("chatUsers", { [this.chatId]: updatedUsers });

        // При успехе — очищаем ошибку и закрываем модалку
        if (errorSpan) {
          errorSpan.textContent = "";
        }
        this.close();
      } catch (error) {
        console.error("Ошибка при добавлении участника:", error);
        if (errorSpan) {
          errorSpan.textContent = "Не удалось добавить участника";
        }
      }
    });
  }

  // Закрывает модалку
  close() {
    this.modal?.close();
  }
}
