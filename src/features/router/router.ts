import type { Block } from "../../shared/ui/block";
import { Route } from "./route";
import { store } from "../../shared/utils";

/**
 * Роутер приложения — Singleton.
 * Управляет маршрутами и переходами между страницами.
 */
export class Router {
  private static __instance: Router | null = null;
  private routes: Route[] = []; // Зарегистрированные маршруты
  private history: History = window.history; // History API
  private currentRoute: Route | null = null; // Текущий маршрут
  private rootElement: Element = document.body as Element; // Контейнер для рендера страниц

  // Singleton — один экземпляр на всё приложение
  private constructor() {
    if (Router.__instance) {
      return Router.__instance;
    }
    Router.__instance = this;
    this.rootElement = document.body;
  }

  /**
   * Получить экземпляр Router.
   * Гарантирует создание только одного экземпляра.
   */
  static getInstance(): Router {
    if (!Router.__instance) {
      Router.__instance = new Router();
    }
    return Router.__instance;
  }

  /**
   * Зарегистрировать маршрут.
   * Позволяет chaining: router.use(...).use(...).
   * @param isProtected — если true, роутер проверит авторизацию перед показом
   */
  use<Props extends object>(
    pathname: string,
    blockClass: new (props?: Props) => Block,
    isProtected = false
  ): Router {
    const route = new Route(pathname, blockClass as typeof Block, this.rootElement, isProtected);
    this.routes.push(route);
    return this;
  }

  /**
   * Запустить роутер:
   * - Подписаться на изменения URL (кнопки «Назад»/«Вперёд»)
   * - Показать страницу по текущему URL
   * - Если передан контейнер — рендерить в него, иначе в document.body
   */
  start(rootElement?: Element): void {
    // Если передан контейнер — используем его и обновляем у всех маршрутов
    if (rootElement) {
      this.rootElement = rootElement;
      for (const route of this.routes) {
        route.setRootElement(rootElement);
      }
    }

    // При изменении URL — обрабатываем переход
    window.onpopstate = () => {
      this._onRoute(window.location.pathname);
    };

    // Показать страницу по текущему URL
    this._onRoute(window.location.pathname);
  }

  /**
   * Обработать переход на маршрут:
   * - Проверить guard для защищённых маршрутов
   * - Вызвать onLeave у уходящей страницы
   * - Показать новую
   * - Если маршрут не найден — заменить URL на 404 (replaceState)
   */
  private _onRoute(pathname: string): void {
    const route = this.getRoute(pathname);
    if (!route) {
      // Маршрут не найден — заменить URL на 404 (не pushState, чтобы не ломать «Назад»)
      this.history.replaceState({}, "", "/404");
      this._onRoute("/404");
      return;
    }

    // Guard для защищённых маршрутов
    if (route.isProtected() && !store.getState().user) {
      this.go("/");
      return;
    }

    // onLeave на уходящей странице + убираем DOM
    if (this.currentRoute && this.currentRoute !== route) {
      this.currentRoute.leave();
      this.currentRoute.block?.element()?.remove();
    }

    route.render();
    this.currentRoute = route;
  }

  /**
   * Программный переход на страницу.
   * Обновляет URL и вызывает _onRoute.
   */
  go(pathname: string): void {
    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  /**
   * Найти маршрут по пути.
   */
  private getRoute(pathname: string): Route | undefined {
    return this.routes.find((route) => route.match(pathname));
  }
}
