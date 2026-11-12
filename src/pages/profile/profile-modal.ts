import { Modal } from "@shared/ui/modal";
import { UserController } from "@features";
import Handlebars from "handlebars";

import templateRaw from "./profile-modal.hbs?raw";
import styles from "./profile-modal.module.css";

// Разрешённые расширения файлов
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];
// Максимальный размер файла — 5 МБ
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Компилированный шаблон тела модалки
const template = Handlebars.compile(templateRaw);

/**
 * Модалка для загрузки аватара пользователя.
 * Содержит input для выбора файла и кнопку "Поменять" для отправки на сервер.
 */
export class ProfileModal {
  // Внутренний компонент Modal
  private modal: Modal | null = null;

  /**
   * Показывает модалку загрузки аватара.
   * После отображения вешает обработчики на кнопку и input файла.
   */
  show() {
    // Компилируем тело модалки с стилями
    const bodyHtml = template({ styles });

    // Создаём и показываем модальное окно
    this.modal = new Modal({
      title: "Загрузите файл",
      body: bodyHtml,
      styles,
    });

    this.modal.show();

    // Вешаем обработчики
    this.attachFileHandler();
    this.attachUploadHandler();
  }

  /**
   * Вешает обработчик на input файла — показывает выбранное имя файла.
   */
  private attachFileHandler(): void {
    const element = this.modal?.element();
    const fileInput = element?.querySelector<HTMLInputElement>('[data-role="avatar-form"] input[type="file"]');
    const fileNameSpan = element?.querySelector<HTMLSpanElement>('[data-role="file-name"]');
    const errorSpan = element?.querySelector<HTMLSpanElement>('[data-role="error"]');
    const button = element?.querySelector<HTMLButtonElement>('[data-role="modal-action-btn"]');

    if (!fileInput) return;

    fileInput.addEventListener("change", () => {
      if (fileInput.files?.[0] && fileNameSpan) {
        fileNameSpan.textContent = fileInput.files[0].name;
      }
      // Разблокируем кнопку, если файл выбран
      if (fileInput.files?.[0] && button) {
        button.disabled = false;
      }
      // Очищаем ошибку при выборе нового файла
      if (errorSpan) {
        errorSpan.textContent = "";
      }
    });
  }

  /**
   * Вешает обработчик клика на кнопку "Поменять".
   * Проверяет файл, отправляет на сервер, закрывает модалку при успехе.
   */
  private attachUploadHandler(): void {
    const element = this.modal?.element();
    // Используем data-role вместо ref — ref удаляется при компиляции
    const button = element?.querySelector<HTMLButtonElement>('[data-role="modal-action-btn"]');
    const errorSpan = element?.querySelector<HTMLSpanElement>('[data-role="error"]');

    if (!button) return;

    // Блокируем кнопку, пока файл не выбран
    button.disabled = true;

    button.addEventListener("click", async () => {
      const fileInput = element?.querySelector<HTMLInputElement>('[data-role="avatar-form"] input[type="file"]');
      const file = fileInput?.files?.[0];

      // Проверка: файл выбран
      if (!file) {
        if (errorSpan) {
          errorSpan.textContent = "Пожалуйста, выберите файл";
        }
        return;
      }

      // Проверка: расширение файла
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
        if (errorSpan) {
          errorSpan.textContent = "Разрешены только файлы: jpg, jpeg, png, gif, webp";
        }
        return;
      }

      // Проверка: размер файла
      if (file.size > MAX_FILE_SIZE) {
        if (errorSpan) {
          errorSpan.textContent = "Размер файла не должен превышать 5 МБ";
        }
        return;
      }

      try {
        // Отправляем файл на сервер
        await UserController.updateAvatar(file);
        // После успеха — очищаем ошибку и закрываем модалку
        if (errorSpan) {
          errorSpan.textContent = "";
        }
        this.close();
      } catch (error) {
        console.error("Ошибка при загрузке аватара:", error);
        if (errorSpan) {
          errorSpan.textContent = "Не удалось загрузить аватар";
        }
      }
    });
  }

  // Закрывает модалку
  close() {
    this.modal?.close();
  }
}
