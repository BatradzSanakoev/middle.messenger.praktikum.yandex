import store from "./store";
import { isEqual } from "..";
import type { Block, BlockOwnProps } from "../../ui/block";

type MapStateFn<P> = (state: Record<string, unknown>) => Partial<P>;

/**
 * HOC: подписывает компонент на Store.
 * Компонент получает props из mapStateToProps и ре-рендерится при их изменении.
 */
function connect<P extends BlockOwnProps>(
  Component: new (props: P) => Block<P>,
  mapStateToProps: MapStateFn<P>
): new (props?: Partial<P>) => Block<P> {
  class ConnectedComponent extends Component {
    private prevState: Partial<P>;
    private unsubscribe: (() => void) | null = null;

    constructor(props: Partial<P> = {}) {
      // props — Partial<P>, но super ждёт полный P.
      // Обязательные поля придут через setProps(prevState) из mapStateToProps.
      super({ ...props } as P);
      this.prevState = mapStateToProps(store.getState());
      this.setProps(this.prevState);

      this.unsubscribe = store.subscribe(() => {
        const nextState = mapStateToProps(store.getState());
        if (!isEqual(this.prevState, nextState)) {
          this.setProps(nextState);
          this.prevState = nextState;
        }
      });
    }

    protected componentWillUnmount(): void {
      this.unsubscribe?.();
      super.componentWillUnmount?.();
    }
  }

  return ConnectedComponent;
}

export default connect;
