import Handlebars from "handlebars";
import {
  buttonTemplate,
  buttonStyles,
  inputTemplate,
  inputStyles,
  linkTemplate,
  linkStyles,
  chatItemTemplate,
  chatItemStyles,
  profileAvatarTemplate,
  profileAvatarStyles,
  modalTemplate,
  modalStyles,
} from "@shared/ui";

Handlebars.registerHelper(
  "lessThan",
  (a: number, b: number) => Number(a) < Number(b),
);
Handlebars.registerHelper(
  "moreThan",
  (a: number, b: number) => Number(a) > Number(b),
);
Handlebars.registerHelper(
  "subtract",
  (a: number, b: number) => Number(a) - Number(b),
);

Handlebars.registerHelper("button", function (options) {
  const html = buttonTemplate({
    text: options.hash.text,
    dataRole: options.hash.dataRole,
    styles: buttonStyles,
  });
  return new Handlebars.SafeString(html);
});

Handlebars.registerHelper("input", function (options) {
  const html = inputTemplate({
    type: options.hash.type || "text",
    name: options.hash.name,
    id: options.hash.id,
    placeholder: options.hash.placeholder,
    value: options.hash.value || "",
    error: options.hash.error || "",
    disabled: options.hash.disabled || false,
    styles: inputStyles,
  });
  return new Handlebars.SafeString(html);
});

Handlebars.registerHelper("link", function (options) {
  const html = linkTemplate({
    href: options.hash.href,
    text: options.hash.text,
    styles: linkStyles,
  });
  return new Handlebars.SafeString(html);
});

Handlebars.registerHelper("chatItem", function (chat) {
  const html = chatItemTemplate({
    ...chat,
    alt: chat.alt || chat.title,
    styles: chatItemStyles,
  });
  return new Handlebars.SafeString(html);
});

Handlebars.registerHelper("chatList", function (options) {
  const chats = options.hash.chats || [];
  let html = "";
  chats.forEach((chat: any) => {
    html += chatItemTemplate({
      ...chat,
      styles: chatItemStyles,
    });
  });
  return new Handlebars.SafeString(html);
});

Handlebars.registerHelper("profileAvatar", function (options) {
  const html = profileAvatarTemplate({
    avatarUrl: options.hash.avatarUrl,
    styles: profileAvatarStyles,
  });
  return new Handlebars.SafeString(html);
});

Handlebars.registerHelper("modal", function (options) {
  const html = modalTemplate({
    title: options.hash.title,
    buttonText: options.hash.buttonText,
    body: options.hash.body || "",
    styles: modalStyles,
  });
  return new Handlebars.SafeString(html);
});
