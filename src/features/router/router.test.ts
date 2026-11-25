import { describe, it, expect, beforeEach } from "vitest";
import { Router } from "./router";
import { Block } from "../../shared/ui/block";

class MockBlock extends Block {
  protected template = "<div data-test='block'></div>";
}

describe("Router", () => {
  beforeEach(() => {
    // Сброс Singleton для изоляции тестов
    (Router as unknown as { __instance: Router | null }).__instance = null;
    window.history.replaceState({}, "", "/");
  });

  it("use регистрирует маршрут и возвращает this (chaining)", () => {
    const router = Router.getInstance();
    expect(router.use("/a", MockBlock)).toBe(router);
    expect(router.use("/b", MockBlock)).toBe(router);
  });

  it("go меняет pathname и рендерит страницу", () => {
    const router = Router.getInstance();
    router.use("/test", MockBlock);
    router.go("/test");
    expect(window.location.pathname).toBe("/test");
  });

  it("неизвестный путь → replaceState на /404 (без pushState)", () => {
    const router = Router.getInstance();
    router.use("/404", MockBlock);
    router.go("/unknown");
    expect(window.location.pathname).toBe("/404");
  });

  it("protected-маршрут без user → редирект на /", () => {
    const router = Router.getInstance();
    router.use("/", MockBlock);
    router.use("/private", MockBlock, true);
    router.go("/private");
    expect(window.location.pathname).toBe("/");
  });
});
