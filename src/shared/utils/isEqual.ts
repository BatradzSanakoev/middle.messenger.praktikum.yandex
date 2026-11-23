/**
 * Рекурсивное сравнение двух значений.
 * Работает с объектами, массивами и примитивами.
 */
export function isEqual(a: unknown, b: unknown): boolean {
  // Один и тот же объект в памяти — равны
  if (a === b) return true;

  // Разные типы — не равны
  if (typeof a !== typeof b) return false;

  // Оба должны быть объектами и не null
  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  // Разное количество ключей — не равны
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    // Ключ должен быть в обоих объектах
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;

    // Рекурсивное сравнение значений (включая вложенные объекты)
    if (!isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]))
      return false;
  }

  return true;
}
