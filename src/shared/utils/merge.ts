import type { Indexed } from './types';

/**
 * Рекурсивно объединяет два объекта.
 * Создаёт НОВЫЙ объект, не мутируя исходные (иммутабельность).
 * Вложенные объекты объединяются рекурсивно.
 */
export function merge(lhs: Indexed, rhs: Indexed): Indexed {
	// Создаём копию lhs, чтобы не мутировать исходный объект
	const result = { ...lhs };

	// Проходим по всем ключам rhs
	for (const p in rhs) {
		// Пропускаем унаследованные свойства, только собственные
		if (!Object.prototype.hasOwnProperty.call(rhs, p)) {
			continue;
		}

		const lhsValue = result[p];
		const rhsValue = rhs[p];

		// Если оба значения — объекты (не null, не массив) — рекурсивно объединяем
		if (
			rhsValue !== null &&
			rhsValue !== undefined &&
			typeof rhsValue === 'object' &&
			!Array.isArray(rhsValue) &&
			lhsValue !== null &&
			lhsValue !== undefined &&
			typeof lhsValue === 'object' &&
			!Array.isArray(lhsValue)
		) {
			result[p] = merge(lhsValue as Indexed, rhsValue as Indexed);
		} else {
			// Иначе просто заменяем значение
			result[p] = rhsValue;
		}
	}

	// Возвращаем новый объект
	return result;
}
