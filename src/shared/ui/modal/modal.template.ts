import Handlebars from "handlebars";
import templateRaw from "./modal.hbs?raw";

export const modalTemplate = Handlebars.compile(templateRaw);
