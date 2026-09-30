import Handlebars from 'handlebars';

Handlebars.registerHelper('lessThan', (a: number, b: number) => Number(a) < Number(b));
Handlebars.registerHelper('moreThan', (a: number, b: number) => Number(a) > Number(b));
Handlebars.registerHelper('subtract', (a: number, b: number) => Number(a) - Number(b));
