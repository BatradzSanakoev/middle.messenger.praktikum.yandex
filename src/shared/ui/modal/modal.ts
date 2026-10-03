import { modalStyles } from ".";
import { modalTemplate } from "./modal.template";

export interface ModalOptions {
  title: string;
  body: string;
  buttonText: string;
  onClose?: () => void;
}

export class Modal {
  private overlay: HTMLElement | null = null;
  private options: ModalOptions;

  constructor(options: ModalOptions) {
    this.options = options;
  }

  show() {
    const html = modalTemplate({
      title: this.options.title,
      buttonText: this.options.buttonText,
      body: this.options.body,
      styles: modalStyles,
    });

    const fragment = document.createRange().createContextualFragment(html);
    this.overlay = fragment.firstElementChild as HTMLElement;
    document.body.appendChild(this.overlay);

    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
  }

  close() {
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      this.overlay = null;
      this.options.onClose?.();
    }
  }
}
