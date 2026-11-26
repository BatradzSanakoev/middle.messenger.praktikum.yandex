import { describe, it, expect, beforeEach } from "vitest";
import { Button } from "./button";
import buttonStyles from "./button.module.css";

const baseProps = { text: "Click", type: "button" as const, styles: buttonStyles };

describe("Button", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("рендерит <button> с текстом", () => {
    const btn = new Button({ ...baseProps });
    const el = btn.element() as HTMLButtonElement;
    expect(el.tagName).toBe("BUTTON");
    expect(el.textContent?.trim()).toBe("Click");
  });

  it("disabled=true блокирует кнопку", () => {
    const btn = new Button({ ...baseProps, disabled: true });
    expect((btn.element() as HTMLButtonElement).disabled).toBe(true);
  });

  it("data-role устанавливается в атрибут", () => {
    const btn = new Button({ ...baseProps, dataRole: "save-data" });
    expect(btn.element()?.getAttribute("data-role")).toBe("save-data");
  });
});
