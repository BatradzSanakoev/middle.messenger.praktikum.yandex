import { Block } from "@shared/ui/block";
import { ProfileModal } from "./profile-modal";
import { UserController, AuthController, validateForm } from "@features";
import { Router } from "@features/router";
import { inputStyles } from "@shared/ui";

import styles from "./profile.module.css";
import template from "./profile.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";
import { store, connect } from "@/shared/utils";

// Пропсы страницы профиля
interface ProfileProps extends BlockOwnProps {
  user?: {
    first_name: string;
    second_name: string;
    display_name: string;
    login: string;
    email: string;
    phone: string;
    avatar: string;
  };
  styles: typeof styles;
}

// Карта данных из Store в props компонента
const BASE_URL = "https://ya-praktikum.tech";

const mapStateToProps = (state: Record<string, unknown>) => {
  const user = state.user as ProfileProps["user"] | undefined;
  console.log("ProfilePage mapStateToProps — user.avatar:", user?.avatar);
  return {
    user: user
      ? {
          ...user,
          avatar: user.avatar ? `${BASE_URL}${user.avatar}` : "",
        }
      : undefined,
    styles,
  };
};

// Страница профиля пользователя с двумя формами: данные и пароли
export class ProfilePage extends Block<ProfileProps> {
  static componentName = "ProfilePage";

  // Handlebars-шаблон страницы
  protected template = template;

  // Модальное окно для загрузки аватара
  private modal: ProfileModal | null = null;

  // Конструктор: инициализирует обработчики событий
  constructor(props?: ProfileProps) {
    super(props || { styles });
    this.events = {
      // Обработчик кликов: определяет какая кнопка нажата по data-role
      click: (e: Event) => {
        const target = e.target as HTMLElement;
        const role = target.getAttribute("data-role");

        // Кнопка "Изменить данные" — разблокирует поля данных
        if (role === "btn-edit-data") this.enableEditData();
        // Кнопка "Изменить пароль" — переключает на форму паролей
        if (role === "btn-edit-password") this.showPasswordForm();
        // Кнопка "Выйти" — выход из системы
        if (role === "btn-logout") this.logout();
        // Кнопка "Сохранить данные" — валидирует и отправляет на сервер
        if (role === "save-data") {
          const form = this.element()?.querySelector(
            '[data-role="profile-form-data"]',
          ) as HTMLFormElement;
          if (form && !validateForm(form)) return;
          this.saveData();
        }
        // Кнопка "Сохранить пароль" — валидирует, проверяет совпадение, отправляет на сервер
        if (role === "save-password") {
          const form = this.element()?.querySelector(
            '[data-role="profile-form-password"]',
          ) as HTMLFormElement;
          if (form && !validateForm(form)) return;

          // Проверка совпадения паролей
          const passwordForm = this.element()?.querySelector('[data-role="profile-form-password"]');
          const newPassword = passwordForm?.querySelector<HTMLInputElement>(
            'input[name="new_password"]',
          );
          const confirmPassword = passwordForm?.querySelector<HTMLInputElement>(
            'input[name="confirm_password"]',
          );

          if (newPassword?.value !== confirmPassword?.value) {
            // Показать ошибку под полем confirm_password
            const wrapper = confirmPassword?.closest("[class*='inputWrapper']");
            if (wrapper) {
              const span = document.createElement("span");
              span.className = inputStyles.error;
              span.textContent = "Пароли не совпадают";
              wrapper.appendChild(span);
            }
            return;
          }

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

  // Вызывается при каждом переходе на страницу — загружает профиль из контроллера
  protected onEnter(): void {
    const user = store.getState().user as ProfileProps["user"] | undefined;
    console.log("ProfilePage.onEnter — user from store:", user);

    UserController.getProfile().catch(() => {
      Router.getInstance().go("/500");
    });

    // Сбрасываем UI-состояние: показываем форму данных, скрываем форму паролей
    this.resetPasswordForm();
  }

  // Сбрасывает форму паролей в закрытое состояние
  private resetPasswordForm(): void {
    const passwordForm = this.element()?.querySelector('[data-role="profile-form-password"]');
    const dataForm = this.element()?.querySelector('[data-role="profile-form-data"]');
    const actionsSavePassword = this.element()?.querySelector(
      '[data-role="profile-actions-save-password"]',
    );
    const actionsNormal = this.element()?.querySelector('[data-role="profile-actions-normal"]');

    if (passwordForm) passwordForm.classList.add(styles.hidden);
    if (dataForm) dataForm.classList.remove(styles.hidden);
    if (actionsSavePassword) actionsSavePassword.classList.add(styles.hidden);
    if (actionsNormal) actionsNormal.classList.remove(styles.hidden);
  }

  // Метод жизненного цикла — вешает обработчик клика на аватар
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

  // Уничтожение компонента — закрываем модалку аватара
  protected componentWillUnmount(): void {
    this.modal?.close();
  }

  // Выход из системы
  private logout(): void {
    AuthController.logout();
  }

  // Разблокирует поля данных и показывает кнопку "Сохранить"
  private enableEditData(): void {
    // Находим блоки по data-role
    const dataBlock = this.element()?.querySelector('[data-role="profile-data"]');
    const actionsNormal = this.element()?.querySelector('[data-role="profile-actions-normal"]');
    const actionsSaveData = this.element()?.querySelector(
      '[data-role="profile-actions-save-data"]',
    );

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
    const actionsSaveData = this.element()?.querySelector(
      '[data-role="profile-actions-save-data"]',
    );
    const actionsSavePassword = this.element()?.querySelector(
      '[data-role="profile-actions-save-password"]',
    );

    // Скрываем форму данных, показываем форму паролей
    if (dataForm) dataForm.classList.add(styles.hidden);
    if (passwordForm) passwordForm.classList.remove(styles.hidden);
    // Скрываем кнопку сохранения данных, показываем кнопку сохранения паролей
    if (actionsSaveData) actionsSaveData.classList.add(styles.hidden);
    if (actionsSavePassword) actionsSavePassword.classList.remove(styles.hidden);
  }

  // Сохраняет данные профиля на сервер
  private async saveData(): Promise<void> {
    const form = this.element()?.querySelector('[data-role="profile-form-data"]') as HTMLFormElement;
    if (!form) return;

    const formData = new FormData(form);
    const data = {
      first_name: formData.get("first_name") as string,
      second_name: formData.get("second_name") as string,
      display_name: formData.get("display_name") as string,
      login: formData.get("login") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    try {
      await UserController.updateProfile(data);
      this.disableDataForm();
    } catch (error) {
      Router.getInstance().go("/500");
    }
  }

  // Сохраняет пароль на сервер
  private async savePassword(): Promise<void> {
    const form = this.element()?.querySelector('[data-role="profile-form-password"]') as HTMLFormElement;
    if (!form) return;

    const formData = new FormData(form);
    const data = {
      oldPassword: formData.get("old_password") as string,
      newPassword: formData.get("new_password") as string,
    };

    try {
      await UserController.updatePassword(data);
      // Очищаем поля формы пароля
      const inputs = form.querySelectorAll<HTMLInputElement>('input[type="password"]');
      inputs.forEach((input) => (input.value = ""));
      this.hidePasswordForm();
    } catch (error) {
      Router.getInstance().go("/500");
    }
  }

  // Блокирует поля данных и возвращает кнопки управления
  private disableDataForm(): void {
    const dataBlock = this.element()?.querySelector('[data-role="profile-data"]');
    const actionsNormal = this.element()?.querySelector('[data-role="profile-actions-normal"]');
    const actionsSaveData = this.element()?.querySelector(
      '[data-role="profile-actions-save-data"]',
    );

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
  private hidePasswordForm(): void {
    const passwordForm = this.element()?.querySelector('[data-role="profile-form-password"]');
    const dataForm = this.element()?.querySelector('[data-role="profile-form-data"]');
    const actionsSavePassword = this.element()?.querySelector(
      '[data-role="profile-actions-save-password"]',
    );
    const actionsNormal = this.element()?.querySelector('[data-role="profile-actions-normal"]');

    // Скрываем форму паролей, показываем форму данных
    if (passwordForm) passwordForm.classList.add(styles.hidden);
    if (dataForm) dataForm.classList.remove(styles.hidden);
    // Скрываем кнопку сохранения паролей, показываем обычные кнопки
    if (actionsSavePassword) actionsSavePassword.classList.add(styles.hidden);
    if (actionsNormal) actionsNormal.classList.remove(styles.hidden);
  }
}

// Подписка на Store — компонент обновляется при изменении данных пользователя
export default connect(ProfilePage, mapStateToProps);
