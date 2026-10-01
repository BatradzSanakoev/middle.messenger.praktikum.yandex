import templateRaw from './modal.hbs?raw';
import Handlebars from 'handlebars';

export const modalTemplate = Handlebars.compile(templateRaw);
