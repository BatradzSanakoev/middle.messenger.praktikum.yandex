import templateRaw from './chat-item.hbs?raw';
import Handlebars from 'handlebars';

export const chatItemTemplate = Handlebars.compile(templateRaw);
