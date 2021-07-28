import type { Observer } from '@/lib/observer';

export default class Main implements Observer {
  template(state: StoreState): string {
    return `
      <div>메인페이지 ${state.router.pathname}</div>
    `;
  }

  render(state: StoreState): void {
    if (state.router.pathname !== '/') return;

    const markup = this.template(state);
    const parent = document.querySelector('main');

    parent.innerHTML = markup;
  }

  update(state: StoreState): void {
    this.render(state);
  }
}
