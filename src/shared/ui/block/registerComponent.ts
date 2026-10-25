import Handlebars from "handlebars";
import { Block } from "./block";

import type { HelperOptions } from "handlebars";
import type { BlockOwnProps } from "./block";

// Уникальный ID для генерации data-component-hbs-id (инкрементируется при каждой регистрации)
let uniqueId = 0;

// Регистрирует UI-компонент как Handlebars-хелпер для использования в HBS-шаблонах
// После регистрации компонент можно использовать в шаблоне: {{{ComponentName prop1=value1 prop2=value2}}}
export function registerComponent<T extends BlockOwnProps>(
  componentName: string,
  Component: new (props: T) => Block<T>
) {
  Handlebars.registerHelper(componentName, function (this: unknown, { hash, data }: HelperOptions) {
    // Создаём экземпляр компонента с переданными атрибутами как пропсами
    const component = new Component(hash as T);

    // Уникальный атрибут для поиска placeholder'а при вставке компонента в DOM
    const dataAttribute = `data-component-hbs-id="${++uniqueId}"`;

    // Заполняем __refs: если в шаблоне указан ref, сохраняем ссылку на DOM-элемент
    if ("ref" in hash) {
      (data.root.__refs = data.root.__refs || {})[hash.ref] = component.element() ?? undefined;
    }

    // Добавляем компонент в список дочерних с функцией embed для вставки в DOM
    (data.root.__children = data.root.__children || []).push({
      component,
      // Заменяет placeholder на реальный DOM-элемент компонента
      embed(node: DocumentFragment) {
        // Ищем placeholder по уникальному data-component-hbs-id
        const placeholder = node.querySelector(`[${dataAttribute}]`);
        if (!placeholder) {
          throw new Error(`Can't find data-id for component ${componentName}`);
        }
        // Рендерим компонент и получаем его DOM-элемент
        const element = component.element();
        if (element) {
          // Заменяем placeholder на реальный DOM
          placeholder.replaceWith(element);
        }
      },
    });

    // Возвращаем placeholder — он будет заменён на реальный DOM при compile()
    return `<div ${dataAttribute}></div>`;
  });
}
