import { profileAvatarStyles } from ".";
import { profileAvatarTemplate } from "./profile-avatar.template";

export interface ProfileAvatarData {
  avatarUrl: string;
}

export class ProfileAvatar {
  constructor(container: HTMLElement, data: ProfileAvatarData) {
    const html = profileAvatarTemplate({
      ...data,
      styles: profileAvatarStyles,
    });

    const fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}
