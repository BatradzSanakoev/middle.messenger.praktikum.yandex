import { Block } from "@shared/ui/block";
import { ProfileModal } from "./profile-modal";
import { validateForm } from "@features";

import styles from "./profile.module.css";
import template from "./profile.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы страницы профиля
interface ProfileProps extends BlockOwnProps {
  styles: typeof styles;
}

// Страница профиля пользователя с двумя формами: данные и пароли
export class ProfilePage extends Block<ProfileProps> {
  static componentName = "ProfilePage";

  // Handlebars-шаблон страницы
  protected template = template;

  // Модальное окно для загрузки аватара
  private modal: ProfileModal | null = null;

  // Конструктор: инициализирует обработчики событий
  constructor() {
    super({ styles });
    this.events = {
      // Обработчик кликов: определяет какая кнопка нажата по data-role
      click: (e: Event) => {
        const target = e.target as HTMLElement;
        const role = target.getAttribute("data-role");

        // Кнопка "Изменить данные" — разблокирует поля данных
        if (role === "btn-edit-data") this.enableEditData();
        // Кнопка "Изменить пароль" — переключает на форму паролей
        if (role === "btn-edit-password") this.showPasswordForm();
        // Кнопка "Сохранить данные" — валидирует и блокирует поля
        if (role === "save-data") {
          const form = this.element()?.querySelector('[data-role="profile-form-data"]') as HTMLFormElement;
          if (form && !validateForm(form)) return;
          this.saveData();
        }
        // Кнопка "Сохранить пароль" — валидирует и переключает обратно
        if (role === "save-password") {
          const form = this.element()?.querySelector('[data-role="profile-form-password"]') as HTMLFormElement;
          if (form && !validateForm(form)) return;
          this.savePassword();
        }
      },
      // Обработчик сабмита форм — валидация при отправке
      submit: (e: Event) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const role = target.getAttribute("data-role");

        // Валидация формы данных
        if (role === "profile-form-data") {
          validateForm(target);
        // Валидация формы паролей
        } else if (role === "profile-form-password") {
          validateForm(target);
        }
      },
    };
  }

  // componentDidMount: вешает обработчик клика на аватар для открытия модалки
  protected componentDidMount(): void {
    const avatarWrapper = this.element()?.querySelector('[data-role="avatar-wrapper"]');
    if (avatarWrapper) {
      avatarWrapper.addEventListener("click", () => {
        // Создаём модалку при первом клике
        if (!this.modal) {
          this.modal = new ProfileModal();
        }
        this.modal.show();
      });
    }
  }

  // Разблокирует поля данных и показывает кнопку "Сохранить"
  private enableEditData(): void {
    // Находим блоки по data-role
    const dataBlock = this.element()?.querySelector('[data-role="profile-data"]');
    const actionsNormal = this.element()?.querySelector('[data-role="profile-actions-normal"]');
    const actionsSaveData = this.element()?.querySelector('[data-role="profile-actions-save-data"]');

    // Разблокируем все инпуты в блоке данных
    if (dataBlock) {
      dataBlock.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
        input.disabled = false;
      });
    }
    // Скрываем обычные кнопки
    if (actionsNormal) actionsNormal.classList.add(styles.hidden);
    // Показываем кнопку "Сохранить" для данных
    if (actionsSaveData) actionsSaveData.classList.remove(styles.hidden);
  }

  // Переключает на форму паролей: скрывает данные, показывает пароли
  private showPasswordForm(): void {
    const dataForm = this.element()?.querySelector('[data-role="profile-form-data"]');
    const passwordForm = this.element()?.querySelector('[data-role="profile-form-password"]');
    const actionsSaveData = this.element()?.querySelector('[data-role="profile-actions-save-data"]');
    const actionsSavePassword = this.element()?.querySelector('[data-role="profile-actions-save-password"]');

<<<<<<< HEAD
    // Скрываем форму данных, показываем форму паролей
    if (dataForm) dataForm.classList.add(styles.hidden);
    if (passwordForm) passwordForm.classList.remove(styles.hidden);
    // Скрываем кнопку сохранения данных, показываем кнопку сохранения паролей
    if (actionsSaveData) actionsSaveData.classList.add(styles.hidden);
    if (actionsSavePassword) actionsSavePassword.classList.remove(styles.hidden);
  }
=======
      if (btnRole === "btn-edit-data") {
        // Разблокируем инпуты
        dataBlock
          ?.querySelectorAll<HTMLInputElement>("input")
          .forEach((input) => {
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
>>>>>>> 4bd676ab9adaaf0fbf1b64aa8639fb8d60224d33

  // Блокирует поля данных и возвращает кнопки управления
  private saveData(): void {
    const dataBlock = this.element()?.querySelector('[data-role="profile-data"]');
    const actionsNormal = this.element()?.querySelector('[data-role="profile-actions-normal"]');
    const actionsSaveData = this.element()?.querySelector('[data-role="profile-actions-save-data"]');

<<<<<<< HEAD
    // Блокируем все инпуты в блоке данных
    if (dataBlock) {
      dataBlock.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
        input.disabled = true;
      });
    }
    // Показываем обычные кнопки, скрываем кнопку сохранения
    if (actionsNormal) actionsNormal.classList.remove(styles.hidden);
    if (actionsSaveData) actionsSaveData.classList.add(styles.hidden);
  }

  // Скрывает форму паролей и возвращает форму данных
  private savePassword(): void {
    const passwordForm = this.element()?.querySelector('[data-role="profile-form-password"]');
    const dataForm = this.element()?.querySelector('[data-role="profile-form-data"]');
    const actionsSavePassword = this.element()?.querySelector('[data-role="profile-actions-save-password"]');
    const actionsNormal = this.element()?.querySelector('[data-role="profile-actions-normal"]');

    // Скрываем форму паролей, показываем форму данных
    if (passwordForm) passwordForm.classList.add(styles.hidden);
    if (dataForm) dataForm.classList.remove(styles.hidden);
    // Скрываем кнопку сохранения паролей, показываем обычные кнопки
    if (actionsSavePassword) actionsSavePassword.classList.add(styles.hidden);
    if (actionsNormal) actionsNormal.classList.remove(styles.hidden);
=======
      if (btnRole === "btn-save") {
        // Блокируем инпуты обратно
        dataBlock
          ?.querySelectorAll<HTMLInputElement>("input")
          .forEach((input) => {
            input.disabled = true;
          });
        // Скрываем блок паролей, показываем блок данных
        passwordBlock!.classList.add(styles.hidden);
        dataBlock!.classList.remove(styles.hidden);
        actionsNormal!.classList.remove(styles.hidden);
        actionsSave!.classList.add(styles.hidden);
      }
    });
>>>>>>> 4bd676ab9adaaf0fbf1b64aa8639fb8d60224d33
  }
}
