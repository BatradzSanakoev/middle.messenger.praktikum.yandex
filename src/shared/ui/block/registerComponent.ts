import Handlebars from "handlebars";
import { Block } from "./block";

import type { HelperOptions } from "handlebars";
import type { BlockOwnProps } from "./block";

/**
 * Инкрементальный ID для уникального data-атрибута заглушки.
 * Каждый зарегистрированный компонент получает свой уникальный идентификатор.
 */
let uniqueId = 0;

/**
 * Регистрирует компонент в Handlebars как хелпер.
 * Позволяет использовать компонент в шаблонах через синтаксис:
 * {{{ ComponentName prop="value" ref="key" }}}
 *
 * @param componentName — имя хелпера (используется в шаблоне Handlebars)
 * @param Component — класс-наследник Block для создания экземпляра
 */
export function registerComponent<T extends BlockOwnProps>(
  componentName: string,
  Component: new (props: T) => Block<T>
) {
  Handlebars.registerHelper(componentName, function (this: unknown, { hash, data }: HelperOptions) {
    // Уникальный data-атрибут для поиска заглушки при embed
    const dataAttribute = `data-component-hbs-id="${++uniqueId}"`;
    // Создаём экземпляр компонента с переданными свойствами
    const component = new Component(hash as T);

    // Если передан ref — сохраняем ссылку на DOM-элемент в __refs родителя
    if ("ref" in hash) {
      (data.root.__refs = data.root.__refs || {})[hash.ref] = component.element() ?? undefined;
    }

    // Добавляем компонент в массив дочерних с функцией embed для замены заглушки
    (data.root.__children = data.root.__children || []).push({
      component,
      /**
       * Заменяет заглушку (div с data-атрибутом) на реальный DOM-элемент компонента.
       * Вызывается в методе compile() родительского компонента.
       */
      embed(node: DocumentFragment) {
        const placeholder = node.querySelector(`[${dataAttribute}]`);
        if (!placeholder) {
          throw new Error(`Can't find data-id for component ${componentName}`);
        }
        const element = component.element();
        if (element) {
          placeholder.replaceWith(element);
        }
      },
    });

    // Возвращаем заглушку — реальный компонент будет вставлен позже через embed
    return `<div ${dataAttribute}></div>`;
  });
}
