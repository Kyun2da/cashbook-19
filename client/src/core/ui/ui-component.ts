import Router from '../utils/router';
import { Observer } from './observer';
import State from './state';

export default abstract class UIComponent implements Observer {
  public router: Router;

  public store: State;

  constructor(router: Router, store: State) {
    this.router = router;
    this.store = store;
  }

  abstract get targetElement(): HTMLElement;

  get targetPathname(): string {
    return null;
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    return true;
  }

  update(prevState: StoreState, nextState: StoreState): void {
    if (this.targetPathname && this.targetPathname !== nextState.router.pathname) {
      this.targetElement.style.display = 'none';
      return;
    }
    this.targetElement.style.display = 'block';

    if (this.shouldUpdate(prevState, nextState)) {
      this.render(nextState);
    }
  }

  render(state: StoreState): void {
    const markup = this.template(state);
    const parent = this.targetElement;
    parent.innerHTML = markup;
    this.addEvent(state, parent);
  }

  addEvent(state: StoreState, parent: HTMLElement): void {
    //
  }

  abstract template(state: StoreState): string;
}
