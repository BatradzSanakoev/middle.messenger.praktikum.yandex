import { Block } from "@shared/ui/block";

import profileAvatarStyles from "./profile-avatar.module.css";
import template from "./profile-avatar.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы компонента ProfileAvatar
export interface ProfileAvatarData extends BlockOwnProps {
  avatarUrl: string;
  styles: typeof profileAvatarStyles;
}

// Компонент аватара пользователя
export class ProfileAvatar extends Block<ProfileAvatarData> {
  static componentName = "ProfileAvatar";

  // Handlebars-шаблон компонента
  protected template = template;

  // Конструктор: создаёт аватар с переданным URL
  constructor(props: ProfileAvatarData) {
    super({ ...props, styles: profileAvatarStyles });
  }
}
