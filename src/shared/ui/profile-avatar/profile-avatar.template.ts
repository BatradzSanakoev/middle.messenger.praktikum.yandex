import Handlebars from "handlebars";
import templateRaw from "./profile-avatar.hbs?raw";

export const profileAvatarTemplate = Handlebars.compile(templateRaw);
