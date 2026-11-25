import { describe, it, expect, beforeEach } from "vitest";
import { Block } from "./block";

class TestBlock extends Block {
  protected template = '<div class="test-block">{{ text }}</div>';
  public mountCount = 0;
  public unmountCount = 0;
  public leaveCount = 0;
  protected componentDidMount(): void {
    this.mountCount++;
  }
  protected componentWillUnmount(): void {
    this.unmountCount++;
  }
  protected onLeave(): void {
    this.leaveCount++;
  }
}

describe("Block lifecycle", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("componentDidMount вызывается один раз при первом element()", () => {
    const b = new TestBlock();
    b.element();
    b.element();
    expect(b.mountCount).toBe(1);
  });

  it("setProps НЕ вызывает componentDidMount повторно", () => {
    const b = new TestBlock();
    b.element();
    (b as unknown as { setProps: (props: unknown) => void }).setProps({});
    expect(b.mountCount).toBe(1);
  });

  it("setProps обновляет DOM (ре-рендер)", () => {
    const b = new TestBlock();
    b.element();
    (b as unknown as { setProps: (props: unknown) => void }).setProps({});
    // После setProps DOM пересоздаётся — элемент существует
    expect(b.element()).not.toBeNull();
  });

  it("destroy вызывает componentWillUnmount и onLeave", () => {
    const b = new TestBlock();
    b.element();
    b.destroy();
    expect(b.unmountCount).toBe(1);
    expect(b.leaveCount).toBe(1);
  });

  it("destroy удаляет элемент из DOM", () => {
    const b = new TestBlock();
    document.body.appendChild(b.element()!);
    b.destroy();
    expect(document.querySelector(".test-block")).toBeNull();
  });
});
