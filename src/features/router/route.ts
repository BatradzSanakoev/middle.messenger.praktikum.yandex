import type { Block } from "../../shared/ui/block";
import { render } from "../../shared/utils/renderDOM";

type BlockConstructor = new (...args: unknown[]) => Block;

/**
 * Представляет один маршрут: URL-путь + компонент.
 * Управляет созданием, показом и скрытием компонента.
 */
export class Route {
  private pathname: string; // URL-путь (например, '/messenger')
  private blockClass: typeof Block; // Класс компонента (например, ChatPage)
  private block: Block | null; // Экземпляр компонента
  private rootElement: Element; // DOM-контейнер

  /**
   * Создаёт маршрут.
   * Компонент создаётся лениво — при первом вызове render().
   */
  constructor(pathname: string, blockClass: typeof Block, rootElement: Element) {
    this.pathname = pathname;
    this.blockClass = blockClass;
    this.block = null;
    this.rootElement = rootElement;
  }

  /**
   * Проверяет, совпадает ли переданный путь с маршрутом.
   */
  match(pathname: string): boolean {
    return pathname === this.pathname;
  }

  /**
   * Скрывает компонент (вызывается при уходе со страницы).
   */
  leave(): void {
    if (this.block) {
      this.block.hide();
    }
  }

  /**
   * Показывает компонент:
   * - Если не создан → создаёт и вставляет в DOM
   * - Если уже создан → просто показывает
   */
  render(): void {
    if (!this.block) {
      this.block = new (this.blockClass as BlockConstructor)();
      render(this.rootElement, this.block);

      return;
    }

    this.block.show();
  }
}
