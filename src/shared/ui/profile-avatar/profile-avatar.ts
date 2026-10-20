import { Block, type BlockOwnProps } from "@shared/ui/block";
import profileAvatarStyles from "./profile-avatar.module.css";

export interface ProfileAvatarData extends BlockOwnProps {
  avatarUrl: string;
  styles: typeof profileAvatarStyles;
}

export class ProfileAvatar extends Block<ProfileAvatarData> {
  static componentName = "ProfileAvatar";

  protected template = `
    <div class="{{ styles.avatarWrapper }}" data-role="avatar-wrapper">
      <img class="{{ styles.avatar }}" src="{{ avatarUrl }}" alt="Аватар" />
      <div class="{{ styles.avatarOverlay }}">
        <span class="{{ styles.overlayText }}">Поменять аватар</span>
      </div>
    </div>
  `;

  constructor(props: ProfileAvatarData) {
    super({ ...props, styles: profileAvatarStyles });
  }
}
