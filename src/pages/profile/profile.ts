import templateRaw from "./profile.hbs?raw";
import Handlebars from "handlebars";
import styles from "./profile.module.css";
import { ProfileModal } from "./profile-modal";

const template = Handlebars.compile(templateRaw);

export class ProfilePage {
  private modal: ProfileModal | null = null;

  render(container: HTMLElement) {
    const html = template({ styles });

    const fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);

    // Аватар
    const avatarWrapper = container.querySelector(
      '[data-role="avatar-wrapper"]',
    );
    if (avatarWrapper) {
      avatarWrapper.addEventListener("click", () => {
        if (!this.modal) {
          this.modal = new ProfileModal();
        }
        this.modal.show();
      });
    }

    // Блок данных
    const dataBlock = container.querySelector('[data-role="profile-data"]');
    const passwordBlock = container.querySelector(
      '[data-role="profile-data-password"]',
    );

    // Блоки кнопок
    const actionsNormal = container.querySelector(
      '[data-role="profile-actions-normal"]',
    );
    const actionsSave = container.querySelector(
      '[data-role="profile-actions-save"]',
    );

    // Обработчик для обычных кнопок
    actionsNormal?.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btnRole = target.getAttribute("data-role");

      if (btnRole === "btn-edit-data") {
        // Разблокируем инпуты
        dataBlock?.querySelectorAll<HTMLInputElement>('input').forEach(input => {
          input.disabled = false;
        });
        actionsNormal!.classList.add(styles.hidden);
        actionsSave!.classList.remove(styles.hidden);
      } else if (btnRole === "btn-edit-password") {
        // Скрываем блок данных, показываем блок паролей
        dataBlock!.classList.add(styles.hidden);
        passwordBlock!.classList.remove(styles.hidden);
        actionsNormal!.classList.add(styles.hidden);
        actionsSave!.classList.remove(styles.hidden);
      }
    });

    // Обработчик для кнопки сохранить
    actionsSave?.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btnRole = target.getAttribute("data-role");

      if (btnRole === "btn-save") {
        // Блокируем инпуты обратно
        dataBlock?.querySelectorAll<HTMLInputElement>('input').forEach(input => {
          input.disabled = true;
        });
        // Скрываем блок паролей, показываем блок данных
        passwordBlock!.classList.add(styles.hidden);
        dataBlock!.classList.remove(styles.hidden);
        actionsNormal!.classList.remove(styles.hidden);
        actionsSave!.classList.add(styles.hidden);
      }
    });
  }
}
