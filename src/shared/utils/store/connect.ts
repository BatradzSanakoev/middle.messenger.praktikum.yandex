import store from "./store";
import { isEqual } from "..";

import type { Block, BlockOwnProps } from "../../ui/block";

// HOC: обёртка компонента для автоматической подписки на Store
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function connect<Props extends object, T extends new (...args: any[]) => Block>(
  Component: T,
  // Функция, выбирающая нужные данные из Store
  mapStateToProps: (state: Record<string, unknown>) => Props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ConnectedComponent = class extends (Component as any) {
    private prevState: Props; // Кэшируем предыдущие props для проверки изменений

    constructor(...args: unknown[]) {
      // Передаём аргументы в родительский конструктор
      super(...(args as [BlockOwnProps]));
      // Получаем начальные данные и передаём в props
      this.prevState = mapStateToProps(store.getState());
      this.setProps(this.prevState);

      // Подписываемся на обновления Store
      store.subscribe(() => {
        const nextState = mapStateToProps(store.getState());
        // Обновляем props только если данные изменились
        if (!isEqual(this.prevState, nextState)) {
          this.setProps(nextState);
          this.prevState = nextState;
        }
      });
    }
  };

  return ConnectedComponent;
}

export default connect;
