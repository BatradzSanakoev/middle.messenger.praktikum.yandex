import templateRaw from './input.hbs?raw';
import Handlebars from 'handlebars';

export const inputTemplate = Handlebars.compile(templateRaw);
