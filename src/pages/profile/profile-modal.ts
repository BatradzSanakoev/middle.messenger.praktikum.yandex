import templateRaw from './profile-modal.hbs?raw';
import Handlebars from 'handlebars';
import styles from './profile-modal.module.css';
import { Modal } from '@shared/ui/modal';

const template = Handlebars.compile(templateRaw);

export class ProfileModal {
  private modal: Modal | null = null;

  show() {
    const bodyHtml = template({ styles });

    this.modal = new Modal({
      title: 'Загрузите файл',
      body: bodyHtml,
      buttonText: 'Поменять',
    });

    this.modal.show();
  }

  close() {
    this.modal?.close();
  }
}
