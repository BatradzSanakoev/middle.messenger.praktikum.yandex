import { Block, type BlockOwnProps } from "@shared/ui/block";
import profileAvatarStyles from "./profile-avatar.module.css";
import template from "./profile-avatar.hbs?raw";

export interface ProfileAvatarData extends BlockOwnProps {
  avatarUrl: string;
  styles: typeof profileAvatarStyles;
}

export class ProfileAvatar extends Block<ProfileAvatarData> {
  static componentName = "ProfileAvatar";

  protected template = template;

  constructor(props: ProfileAvatarData) {
    super({ ...props, styles: profileAvatarStyles });
  }
}
