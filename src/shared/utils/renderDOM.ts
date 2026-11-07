import type { Block } from "../ui/block";

/**
 * Вставляет компонент Block в DOM-контейнер.
 * Заменяет активный дочерний элемент, сохраняя скрытые компоненты в DOM.
 */
export function render(rootElement: Element | null, component: Block): void {
	if (!rootElement) return;

	const element = component.element();
	if (!element) return;

	rootElement.appendChild(element);
}
