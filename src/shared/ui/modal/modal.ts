import { Block } from "@shared/ui/block";

import modalStyles from "./modal.module.css";
import template from "./modal.hbs?raw";

import type { BlockOwnProps } from "@shared/ui/block";

// Пропсы компонента Modal
export interface ModalOptions extends BlockOwnProps {
  title: string;
  body: string;
  buttonText: string;
  onClose?: () => void;
  styles: typeof modalStyles;
}

// Компонент модального окна
export class Modal extends Block<ModalOptions> {
  static componentName = "Modal";

  // Handlebars-шаблон компонента
  protected template = template;

  // DOM-элемент модального окна (overlay)
  private overlay: HTMLElement | null = null;

  // Конструктор: создаёт модалку с переданными пропсами
  constructor(props: ModalOptions) {
    super({ ...props, styles: modalStyles });
  }

  // Показывает модальное окно: добавляет overlay в body
  show() {
    const element = this.element();
    if (element) {
      this.overlay = element as HTMLElement;
      document.body.appendChild(this.overlay);

      // Закрытие по клику на overlay (не на контент)
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
  }

  // Закрывает модальное окно: удаляет overlay и вызывает onClose
  close() {
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      this.overlay = null;
      (this.props as ModalOptions).onClose?.();
    }
  }
}
