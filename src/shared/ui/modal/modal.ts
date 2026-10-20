import { Block, type BlockOwnProps } from "@shared/ui/block";
import modalStyles from "./modal.module.css";

export interface ModalOptions extends BlockOwnProps {
  title: string;
  body: string;
  buttonText: string;
  onClose?: () => void;
  styles: typeof modalStyles;
}

export class Modal extends Block<ModalOptions> {
  static componentName = "Modal";

  protected template = `
    <div class="{{ styles.modalOverlay }}">
      <div class="{{ styles.modalContent }}">
        <h2 class="{{ styles.modalTitle }}">{{ title }}</h2>
        <div class="{{ styles.modalBody }}">{{{ body }}}</div>
        {{{ Button text=buttonText }}}
      </div>
    </div>
  `;

  private overlay: HTMLElement | null = null;

  constructor(props: ModalOptions) {
    super({ ...props, styles: modalStyles });
  }

  show() {
    const element = this.element();
    if (element) {
      this.overlay = element as HTMLElement;
      document.body.appendChild(this.overlay);

      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
  }

  close() {
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      this.overlay = null;
      (this.props as ModalOptions).onClose?.();
    }
  }
}
