import templateRaw from './link.hbs?raw';
import Handlebars from 'handlebars';

export const linkTemplate = Handlebars.compile(templateRaw);
