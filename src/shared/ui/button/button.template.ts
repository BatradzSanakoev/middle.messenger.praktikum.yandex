import Handlebars from "handlebars";
import templateRaw from "./button.hbs?raw";

export const buttonTemplate = Handlebars.compile(templateRaw);
