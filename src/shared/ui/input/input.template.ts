import Handlebars from "handlebars";
import templateRaw from "./input.hbs?raw";

export const inputTemplate = Handlebars.compile(templateRaw);
