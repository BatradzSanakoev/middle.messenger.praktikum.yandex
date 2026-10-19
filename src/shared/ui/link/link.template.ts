import Handlebars from "handlebars";
import templateRaw from "./link.hbs?raw";

export const linkTemplate = Handlebars.compile(templateRaw);
