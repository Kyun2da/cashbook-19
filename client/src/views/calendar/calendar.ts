import type { Observer } from '@/lib/observer';

export default class Calendar implements Observer {
  template(state: StoreState): string {
    return `
      <div>캘린더 페이지 ${state.router.pathname}</div>
    `;
  }

  render(state: StoreState): void {
    if (state.router.pathname !== '/calendar') return;

    const markup = this.template(state);
    const parent = document.querySelector('main');

    parent.innerHTML = markup;
  }

  update(state: StoreState): void {
    this.render(state);
  }
}
