import type { Chat } from "@helpers/mocks/chats";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import { Link } from "@shared/ui/link";
import { ChatItem } from "@shared/ui/chat-item";
import { ProfileAvatar } from "@shared/ui/profile-avatar";
import { Modal } from "@shared/ui/modal";
import { registerComponent } from "@shared/ui/block";
import Handlebars from "handlebars";

Handlebars.registerHelper("lessThan", (a: number, b: number) => Number(a) < Number(b));
Handlebars.registerHelper("moreThan", (a: number, b: number) => Number(a) > Number(b));
Handlebars.registerHelper("subtract", (a: number, b: number) => Number(a) - Number(b));

// Регистрация компонентов через registerComponent
registerComponent("Input", Input);
registerComponent("Button", Button);
registerComponent("Link", Link);
registerComponent("ChatItem", ChatItem);
registerComponent("ProfileAvatar", ProfileAvatar);
registerComponent("Modal", Modal);

Handlebars.registerHelper("chatList", function (options) {
  const chats = options.hash.chats || [];
  let html = "";
  chats.forEach((_chat: Chat, index: number) => {
    html += `<div data-component-hbs-id="chatList-placeholder-${index}"></div>`;
  });
  return new Handlebars.SafeString(html);
});
