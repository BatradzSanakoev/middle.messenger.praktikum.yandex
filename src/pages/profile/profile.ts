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

    // Блоки данных
    const dataNormal = container.querySelector(
      '[data-role="profile-data-normal"]',
    );
    const dataEdit = container.querySelector('[data-role="profile-data-edit"]');
    const dataPassword = container.querySelector(
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
        dataNormal!.classList.add(styles.hidden);
        dataEdit!.classList.remove(styles.hidden);
        actionsNormal!.classList.add(styles.hidden);
        actionsSave!.classList.remove(styles.hidden);
      } else if (btnRole === "btn-edit-password") {
        dataNormal!.classList.add(styles.hidden);
        dataPassword!.classList.remove(styles.hidden);
        actionsNormal!.classList.add(styles.hidden);
        actionsSave!.classList.remove(styles.hidden);
      }
    });

    // Обработчик для кнопки сохранить
    actionsSave?.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btnRole = target.getAttribute("data-role");

      if (btnRole === "btn-save") {
        dataNormal!.classList.remove(styles.hidden);
        dataEdit!.classList.add(styles.hidden);
        dataPassword!.classList.add(styles.hidden);
        actionsNormal!.classList.remove(styles.hidden);
        actionsSave!.classList.add(styles.hidden);
      }
    });
  }
}
