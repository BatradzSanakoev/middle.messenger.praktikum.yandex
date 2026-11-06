import { merge } from "./merge";

import type { Indexed } from "./types";

/**
 * Устанавливает значение по вложенному пути ('user.name' = 'John').
 * Создаёт вложенную структуру и объединяет с исходным объектом.
 */
export function set(object: Indexed, path: string, value: unknown): Indexed {
  // Если объект невалиден — возвращаем как есть
  if (typeof object !== "object" || object === null) {
    return object as Indexed;
  }

  // Разбиваем путь на ключи: 'user.name.age' → ['user', 'name', 'age']
  const keys = path.split(".");

  // Создаём вложенную структуру справа налево:
  // keys = ['user', 'name'], value = 'John'
  // reduceRight:
  //   1. acc = 'John' → { name: 'John' }
  //   2. acc = { name: 'John' } → { user: { name: 'John' } }
  const result = keys.reduceRight<unknown>(
    (acc, key) => ({
      [key]: acc,
    }),
    value,
  );

  // Объединяем с исходным объектом (merge иммутабелен)
  return merge(object, result as Indexed);
}
