import { describe, it, expect, beforeEach, vi } from "vitest";
import { Modal } from "./modal";
import modalStyles from "./modal.module.css";

const baseProps = { title: "Title", body: "<p>body</p>", styles: modalStyles };

describe("Modal", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("show добавляет overlay в document.body", () => {
    const modal = new Modal({ ...baseProps });
    modal.show();
    expect(document.body.children.length).toBe(1);
    modal.close();
  });

  it("close удаляет overlay из document.body", () => {
    const modal = new Modal({ ...baseProps });
    modal.show();
    modal.close();
    expect(document.body.children.length).toBe(0);
  });

  it("onClose вызывается при close()", () => {
    const onClose = vi.fn();
    const modal = new Modal({ ...baseProps, onClose });
    modal.show();
    modal.close();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("клик по фону вызывает onClose и удаляет overlay (п.19)", () => {
    const onClose = vi.fn();
    const modal = new Modal({ ...baseProps, onClose });
    modal.show();

    const overlay = document.body.firstElementChild as HTMLElement;
    overlay.click();

    expect(onClose).toHaveBeenCalledOnce();
    expect(document.body.children.length).toBe(0);
  });
});
