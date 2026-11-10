import { Modal } from "@shared/ui/modal";
import { ChatController } from "@features/controllers";
import Handlebars from "handlebars";
import store from "@/shared/utils/store/store";

import templateRaw from "./remove-user-modal.hbs?raw";
import styles from "./remove-user-modal.module.css";

// Компилированный шаблон тела модалки
const template = Handlebars.compile(templateRaw);

/**
 * Модалка для удаления участника из чата.
 * Содержит поле ввода логина и кнопку "Удалить".
 * Удаляет только не-admin пользователей.
 */
export class RemoveUserModal {
  // Внутренний компонент Modal
  private modal: Modal | null = null;
  // ID чата, из которого удаляем
  private chatId: number;

  constructor(chatId: number) {
    this.chatId = chatId;
  }

  // Обновляет ID чата для удаления участника
  setChatId(chatId: number) {
    this.chatId = chatId;
  }

  /**
   * Показывает модалку удаления участника.
   * Блокирует кнопку, пока инпут пустой.
   */
  show() {
    const bodyHtml = template({ styles });

    this.modal = new Modal({
      title: "Удалить участника",
      body: bodyHtml,
      buttonText: "Удалить",
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
        // Получаем текущих участников чата из Store
        const chatUsersState = store.getState().chatUsers as Record<number, { id: number; login: string; role?: string }[]> || {};
        const currentUsers = chatUsersState[this.chatId] || [];

        // Ищем пользователя по логину в текущем списке участников чата
        const userToRemove = currentUsers.find((u) => u.login === login);

        if (!userToRemove) {
          // Пользователь не найден в списке участников чата
          if (errorSpan) {
            errorSpan.textContent = "Пользователь не найден в чате";
          }
          return;
        }

        // Не даём удалить admin
        if (userToRemove.role === "admin") {
          if (errorSpan) {
            errorSpan.textContent = "Нельзя удалить администратора";
          }
          return;
        }

        // Удаляем пользователя из чата
        await ChatController.removeUserFromChat(userToRemove.id, this.chatId);

        // Обновляем список участников — запрашиваем свежие данные
        const updatedUsers = await ChatController.getChatUsers(this.chatId);
        store.setState("chatUsers", { [this.chatId]: updatedUsers });

        // При успехе — очищаем ошибку и закрываем модалку
        if (errorSpan) {
          errorSpan.textContent = "";
        }
        this.close();
      } catch (error) {
        console.error("Ошибка при удалении участника:", error);
        if (errorSpan) {
          errorSpan.textContent = "Не удалось удалить участника";
        }
      }
    });
  }

  // Закрывает модалку
  close() {
    this.modal?.close();
  }
}
