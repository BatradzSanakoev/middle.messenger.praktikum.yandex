import Handlebars from "handlebars";
import templateRaw from "./chat-item.hbs?raw";

export const chatItemTemplate = Handlebars.compile(templateRaw);
