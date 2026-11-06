import type { Block } from "../ui/block";

/**
 * Вставляет компонент Block в DOM-контейнер.
 * Очищает контейнер и добавляет DOM-элемент компонента.
 */
export function render(rootElement: Element | null, component: Block): void {
	if (!rootElement) return;

	const element = component.element();
	if (!element) return;

	rootElement.innerHTML = "";
	rootElement.appendChild(element);
}
