import { describe, it, expect } from "vitest";
import { Route } from "./route";
import type { Block } from "@shared/ui/block";

// Mock Block для тестов — @ts-expect-error пропускает проверку интерфейса
class MockBlock {
  private _element: Element | null = null;
  element() {
    if (!this._element) {
      this._element = document.createElement("div");
    }
    return this._element;
  }
  setProps() {}
  render() {}
  componentDidMount() {}
  componentWillUnmount() {}
  onEnter() {}
  onLeave() {}
  destroy() {}
  hide() {}
  show() {}
}

describe("Route.match", () => {
  it("должен возвращать true для точного совпадения пути", () => {
    const route = new Route("/messenger", MockBlock as unknown as typeof Block, document.body);
    expect(route.match("/messenger")).toBe(true);
  });

  it("должен возвращать false для другого пути", () => {
    const route = new Route("/messenger", MockBlock as unknown as typeof Block, document.body);
    expect(route.match("/settings")).toBe(false);
  });

  it("должен возвращать false для пустого пути", () => {
    const route = new Route("/messenger", MockBlock as unknown as typeof Block, document.body);
    expect(route.match("")).toBe(false);
  });

  it("должен корректно сопоставлять все маршруты", () => {
    const routes = [
      { path: "/", match: "/" },
      { path: "/sign-up", match: "/sign-up" },
      { path: "/messenger", match: "/messenger" },
      { path: "/settings", match: "/settings" },
      { path: "/404", match: "/404" },
      { path: "/500", match: "/500" },
    ];

    for (const { path, match } of routes) {
      const route = new Route(path, MockBlock as unknown as typeof Block, document.body);
      expect(route.match(match)).toBe(true);
    }
  });

  it("должен возвращать false для частичного совпадения", () => {
    const route = new Route("/mes", MockBlock as unknown as typeof Block, document.body);
    expect(route.match("/messenger")).toBe(false);
  });
});

describe("Route.setRootElement", () => {
  it("render после setRootElement помещает блок в новый root, удаляя из старого", () => {
    document.body.innerHTML = "";
    const oldRoot = document.createElement("div");
    const newRoot = document.createElement("div");
    document.body.append(oldRoot, newRoot);

    const route = new Route("/test", MockBlock as unknown as typeof Block, oldRoot);
    route.render();
    expect(oldRoot.children.length).toBe(1);

    route.setRootElement(newRoot);
    route.render();
    expect(newRoot.children.length).toBe(1);
    expect(oldRoot.children.length).toBe(0);
  });
});
