import Handlebars from "handlebars";

/**
 * Скрытые свойства, которые добавляются в props при компиляции.
 * __children — массив дочерних компонентов для вложенности.
 * __refs — ссылки на DOM-элементы вложенных компонентов.
 */
export interface BlockOwnProps {
  __children?: Array<{
    component: Block<object>;
    embed(node: DocumentFragment): void;
  }>;
  __refs?: Record<string, Element>;
}

/** Тип для хранения обработчиков DOM-событий. */
type EventListType = Partial<Record<keyof HTMLElementEventMap, (e: Event) => void>>;

/**
 * Базовый абстрактный класс для всех компонентов.
 * Реализует жизненный цикл, реактивность, вложенные компоненты и обработку событий.
 */
export abstract class Block<Props extends BlockOwnProps = BlockOwnProps> {
  /** Шаблон Handlebars для рендера — обязателен для реализации в наследнике. */
  protected abstract template: string;

  /** Свойства компонента (props), передаются из родителя. */
  protected props = {} as Props;

  /** DOM-элемент, созданный из шаблона. null до первого рендера. */
  private domElement: Element | null = null;

  /** Массив дочерних компонентов, найденных при компиляции. */
  protected children: Block<object>[] = [];

  /** Словарь ссылок на DOM-элементы, помеченные атрибутом ref. */
  protected refs: Record<string, Element> = {};

  /** Объект с обработчиками событий: { eventName: callback }. */
  protected events: EventListType = {};

  /**
   * Конструктор. Сохраняет переданные props.
   * @param props — свойства компонента
   */
  constructor(props: Props = {} as Props) {
    this.props = props;
  }

  /**
   * Ленивый рендер: если domElement ещё не создан — вызывает render().
   * @returns DOM-элемент компонента
   */
  public element(): Element | null {
    if (!this.domElement) {
      this.render();
    }
    return this.domElement;
  }

  /**
   * Обновление свойств с автоматическим ре-рендером.
   * Очищает скрытые свойства __children и __refs.
   * @param props — частичное обновление props
   */
  public setProps(props: Partial<Props>) {
    this.props = { ...this.props, ...props, __children: [], __refs: {} } as Props;
    this.render();
  }

  /** Хук: вызывается один раз после добавления компонента в DOM. Переопределяется в наследнике. */
  protected componentDidMount(): void {}

  /** Внутренний метод монтирования: подписка на события + вызов componentDidMount. */
  private mountComponent(): void {
    this.attachListeners();
    this.componentDidMount();
  }

  /** Хук: вызывается один раз перед удалением компонента из DOM. Переопределяется в наследнике. */
  protected componentWillUnmount(): void {}

  /**
   * Внутренний метод размонтирования:
   * рекурсивно размонтирует дочерние компоненты, вызывает componentWillUnmount, отключает события.
   */
  private unmountComponent(): void {
    if (this.domElement) {
      this.children.reverse().forEach((child) => child.unmountComponent());
      this.componentWillUnmount();
      this.removeListeners();
    }
  }

  /**
   * Публичный метод для полного удаления компонента из DOM.
   * Вызывает unmountComponent, который рекурсивно удаляет детей,
   * вызывает componentWillUnmount и отключает обработчики событий.
   */
  public destroy(): void {
    this.unmountComponent();
  }

  /** Подписывает все события из this.events на корневой DOM-элемент. */
  private attachListeners(): void {
    for (const eventName in this.events) {
      const eventCallback = this.events[eventName as keyof HTMLElementEventMap];
      if (typeof eventCallback === "function" && this.domElement) {
        this.domElement.addEventListener(eventName, eventCallback);
      }
    }
  }

  /** Отписывает все события из this.events от корневого DOM-элемента. */
  private removeListeners(): void {
    for (const eventName in this.events) {
      const eventCallback = this.events[eventName as keyof HTMLElementEventMap];
      if (typeof eventCallback === "function" && this.domElement) {
        this.domElement.removeEventListener(eventName, eventCallback);
      }
    }
  }

  /**
   * Основной метод рендера:
   * 1. Размонтирует текущий компонент.
   * 2. Компилирует шаблон в DocumentFragment.
   * 3. Заменяет старый DOM-элемент новым.
   * 4. Монтирует компонент (события + componentDidMount).
   */
  protected render(): void {
    this.unmountComponent();
    const fragment = this.compile();
    if (this.domElement && fragment) {
      this.domElement.replaceWith(fragment);
    }
    this.domElement = fragment;
    this.mountComponent();
  }

  /**
   * Компилирует шаблон Handlebars в DOM-элемент:
   * 1. Генерирует HTML из шаблона и props.
   * 2. Вставляет в <template>, получает DocumentFragment.
   * 3. Обрабатывает вложенные компоненты (embed заглушек).
   * 4. Собирает refs из атрибутов ref.
   * @returns первый дочерний элемент fragment или null
   */
  private compile(): Element | null {
    const html = Handlebars.compile(this.template)(this.props);
    const templateElement = document.createElement("template");
    templateElement.innerHTML = html;
    const fragment = templateElement.content;

    // Обработка вложенных компонентов: замена заглушек на реальные DOM-элементы
    if (this.props.__children) {
      this.children = this.props.__children.map((child) => child.component);
      this.props.__children.forEach((child) => {
        child.embed(fragment);
      });
    }

    // Сбор ссылок на элементы с атрибутом ref
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
