import Handlebars from "handlebars";

// Свойства, которые передаются всем компонентам через registerComponent
export interface BlockOwnProps {
  __children?: Array<{
    component: Block<object>;
    embed(node: DocumentFragment): void;
  }>;
  __refs?: Record<string, Element>;
}

// Тип для хранения обработчиков событий (название события -> функция)
type EventListType = Partial<Record<keyof HTMLElementEventMap, (e: Event) => void>>;

// Базовый абстрактный класс для всех UI-компонентов
// Реализует компонентную архитектуру: рендер, обновление пропсов, жизненный цикл
export abstract class Block<Props extends BlockOwnProps = BlockOwnProps> {
  // Шаблон компонента в формате Handlebars (переопределяется в наследниках)
  protected abstract template: string;
  // Свойства компонента (пропсы)
  protected props = {} as Props;
  // DOM-элемент, созданный на основе шаблона
  private domElement: Element | null = null;
  // Вложенные компоненты (созданные через registerComponent)
  protected children: Block<object>[] = [];
  // Ссылки на DOM-элементы с атрибутом ref
  protected refs: Record<string, Element> = {};
  // Обработчики событий, вешаемые на domElement
  protected events: EventListType = {};

  // Конструктор: сохраняет пропсы в this.props
  constructor(props: Props = {} as Props) {
    this.props = props;
  }

  // Ленивый рендер: создаёт DOM-элемент при первом вызове
  public element(): Element | null {
    if (!this.domElement) {
      this.render();
    }
    return this.domElement;
  }

  // Обновление пропсов с ре-рендером компонента
  public setProps(props: Partial<Props>) {
    this.props = { ...this.props, ...props, __children: [], __refs: {} } as Props;
    this.render();
  }

  // Хук: вызывается после монтирования компонента в DOM (переопределяется в наследниках)
  protected componentDidMount(): void {}

  // Привязка обработчиков событий и вызов componentDidMount
  private mountComponent(): void {
    this.attachListeners();
    this.componentDidMount();
  }

  // Хук: вызывается перед удалением компонента из DOM (переопределяется в наследниках)
  protected componentWillUnmount(): void {}

  // Очистка: удаляет вложенные компоненты, убирает слушатели
  private unmountComponent(): void {
    if (this.domElement) {
      this.children.reverse().forEach((child) => child.unmountComponent());
      this.componentWillUnmount();
      this.removeListeners();
    }
  }

  // Полное уничтожение компонента
  public destroy(): void {
    this.unmountComponent();
  }

  // Вешает обработчики событий из this.events на domElement
  private attachListeners(): void {
    for (const eventName in this.events) {
      const eventCallback = this.events[eventName as keyof HTMLElementEventMap];
      if (typeof eventCallback === "function" && this.domElement) {
        this.domElement.addEventListener(eventName, eventCallback);
      }
    }
  }

  // Снимает обработчики событий из this.events с domElement
  private removeListeners(): void {
    for (const eventName in this.events) {
      const eventCallback = this.events[eventName as keyof HTMLElementEventMap];
      if (typeof eventCallback === "function" && this.domElement) {
        this.domElement.removeEventListener(eventName, eventCallback);
      }
    }
  }

  // Полный цикл рендера: удаление старого DOM, компиляция, монтирование
  protected render(): void {
    this.unmountComponent();
    const fragment = this.compile();
    if (this.domElement && fragment) {
      this.domElement.replaceWith(fragment);
    }
    this.domElement = fragment;
    this.mountComponent();
  }

  // Компилирует Handlebars-шаблон, вставляет вложенные компоненты, извлекает refs
  private compile(): Element | null {
    // Компилируем шаблон с текущими пропсами
    const html = Handlebars.compile(this.template)(this.props);
    const templateElement = document.createElement("template");
    templateElement.innerHTML = html;
    const fragment = templateElement.content;

    // Вставляем вложенные компоненты (заменяем placeholder'ы на реальный DOM)
    if (this.props.__children) {
      this.children = this.props.__children.map((child) => child.component);
      this.props.__children.forEach((child) => {
        child.embed(fragment);
      });
    }

    // Извлекаем ссылки на DOM-элементы с атрибутом ref
    const defaultRefs = this.props?.__refs ?? {};
    this.refs = Array.from(fragment.querySelectorAll("[ref]")).reduce((list, element) => {
      const key = element.getAttribute("ref") as string;
      list[key] = element as HTMLElement;
      element.removeAttribute("ref");
      return list;
    }, defaultRefs);

    return templateElement.content.firstElementChild;
  }
}
