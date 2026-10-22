import { Block, type BlockOwnProps } from "@shared/ui/block";
import styles from "./profile.module.css";
import template from "./profile.hbs?raw";
import { ProfileModal } from "./profile-modal";

interface ProfileProps extends BlockOwnProps {
  styles: typeof styles;
}

export class ProfilePage extends Block<ProfileProps> {
  static componentName = "ProfilePage";

  protected template = template;

  private modal: ProfileModal | null = null;

  constructor() {
    super({ styles });
    this.events = {
      click: (e: Event) => {
        const target = e.target as HTMLElement;
        const role = target.getAttribute("data-role");

        if (role === "btn-edit-data") this.enableEditData();
        if (role === "btn-edit-password") this.showPasswordForm();
        if (role === "btn-save") this.saveData();
      },
    };
  }

  protected componentDidMount(): void {
    const avatarWrapper = this.element()?.querySelector('[data-role="avatar-wrapper"]');
    if (avatarWrapper) {
      avatarWrapper.addEventListener("click", () => {
        if (!this.modal) {
          this.modal = new ProfileModal();
        }
        this.modal.show();
      });
    }
  }

  private enableEditData(): void {
    const dataBlock = this.element()?.querySelector('[data-role="profile-data"]');
    const actionsNormal = this.element()?.querySelector('[data-role="profile-actions-normal"]');
    const actionsSave = this.element()?.querySelector('[data-role="profile-actions-save"]');

    if (dataBlock) {
      dataBlock.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
        input.disabled = false;
      });
    }
    if (actionsNormal) actionsNormal.classList.add(styles.hidden);
    if (actionsSave) actionsSave.classList.remove(styles.hidden);
  }

  private showPasswordForm(): void {
    const dataBlock = this.element()?.querySelector('[data-role="profile-data"]');
    const passwordBlock = this.element()?.querySelector('[data-role="profile-data-password"]');
    const actionsNormal = this.element()?.querySelector('[data-role="profile-actions-normal"]');
    const actionsSave = this.element()?.querySelector('[data-role="profile-actions-save"]');

    if (dataBlock) dataBlock.classList.add(styles.hidden);
    if (passwordBlock) passwordBlock.classList.remove(styles.hidden);
    if (actionsNormal) actionsNormal.classList.add(styles.hidden);
    if (actionsSave) actionsSave.classList.remove(styles.hidden);
  }

  private saveData(): void {
    const dataBlock = this.element()?.querySelector('[data-role="profile-data"]');
    const passwordBlock = this.element()?.querySelector('[data-role="profile-data-password"]');
    const actionsNormal = this.element()?.querySelector('[data-role="profile-actions-normal"]');
    const actionsSave = this.element()?.querySelector('[data-role="profile-actions-save"]');

    if (dataBlock) {
      dataBlock.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
        input.disabled = true;
      });
    }
    if (passwordBlock) passwordBlock.classList.add(styles.hidden);
    if (dataBlock) dataBlock.classList.remove(styles.hidden);
    if (actionsNormal) actionsNormal.classList.remove(styles.hidden);
    if (actionsSave) actionsSave.classList.add(styles.hidden);
  }
}
