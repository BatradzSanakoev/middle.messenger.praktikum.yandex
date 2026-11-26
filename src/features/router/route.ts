import type { Block } from "../../shared/ui/block";
import { render } from "../../shared/utils/renderDOM";

/**
 * Представляет один маршрут: URL-путь + компонент.
 * Управляет созданием, показом и скрытием компонента.
 */
export class Route {
  private pathname: string; // URL-путь (например, '/messenger')
  private blockClass: typeof Block; // Класс компонента (например, ChatPage)
  public block: Block | null; // Экземпляр компонента
  private rootElement: Element; // DOM-контейнер
  private isProtectedRoute = false; // Флаг защищённого маршрута

  /**
   * Создаёт маршрут.
   * Компонент создаётся лениво — при первом вызове render().
   * @param isProtected — если true, роутер проверит авторизацию перед показом
   */
  constructor(
    pathname: string,
    blockClass: typeof Block,
    rootElement: Element,
    isProtected = false
  ) {
    this.pathname = pathname;
    this.blockClass = blockClass;
    this.block = null;
    this.rootElement = rootElement;
    this.isProtectedRoute = isProtected;
  }

  /**
   * Проверяет, совпадает ли переданный путь с маршрутом.
   */
  match(pathname: string): boolean {
    return pathname === this.pathname;
  }

  /**
   * Возвращает, является ли маршрут защищённым.
   */
  public isProtected(): boolean {
    return this.isProtectedRoute;
  }

  /**
   * Вызывает onLeave у компонента при уходе со страницы.
   * Блок не уничтожается — остаётся живым для быстрого возврата.
   */
  leave(): void {
    (this.block as unknown as { onLeave?: () => void })?.onLeave?.();
  }

  /**
   * Устанавливает DOM-контейнер для рендера.
   */
  setRootElement(rootElement: Element): void {
    this.rootElement = rootElement;
  }

  /**
   * Показывает компонент:
   * - Если не создан → создаёт и вставляет в DOM
   * - Если уже создан → вызывает onEnter и перемещает DOM в контейнер
   */
  render(): void {
    if (!this.block) {
      // Block — абстрактный класс, но blockClass — это конкретный наследник (LoginPage, ChatPage и т.д.)
      this.block = new (this.blockClass as unknown as new () => Block)();
      if (this.block) {
        render(this.rootElement, this.block);
      }
      return;
    }

    // При повторном переходе на страницу — вызываем onEnter и перемещаем DOM в контейнер
    (this.block as unknown as { onEnter?: () => void })?.onEnter?.();
    render(this.rootElement, this.block);
  }
}
