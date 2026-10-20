import { Modal } from "@shared/ui/modal";
import Handlebars from "handlebars";
import templateRaw from "./profile-modal.hbs?raw";
import styles from "./profile-modal.module.css";

const template = Handlebars.compile(templateRaw);

export class ProfileModal {
  private modal: Modal | null = null;

  show() {
    const bodyHtml = template({ styles });

    this.modal = new Modal({
      title: "Загрузите файл",
      body: bodyHtml,
      buttonText: "Поменять",
      styles,
    });

    this.modal.show();
  }

  close() {
    this.modal?.close();
  }
}
