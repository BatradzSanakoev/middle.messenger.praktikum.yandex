import templateRaw from './profile-avatar.hbs?raw';
import Handlebars from 'handlebars';

export const profileAvatarTemplate = Handlebars.compile(templateRaw);
