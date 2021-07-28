import type { Observer } from '@/core/ui/observer';

export default class Statistics implements Observer {
  template(state: StoreState): string {
    return `
      <div>통계 페이지 ${state.router.pathname}</div>
    `;
  }

  render(state: StoreState): void {
    if (state.router.pathname !== '/statistics') return;

    const markup = this.template(state);
    const parent = document.querySelector('main');

    parent.innerHTML = markup;
  }

  update(state: StoreState): void {
    this.render(state);
  }
}
