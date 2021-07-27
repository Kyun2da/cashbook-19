import type { Observer } from '@/lib/observer';

export default class B implements Observer {
  template(state: Record<string, any>): string {
    return `
      <div>B ${state.router.pathname}</div>
    `;
  }

  render(state: Record<string, any>): void {
    if (state.router.pathname !== '/b') return;

    const markup = this.template(state);
    const parent = document.querySelector('main');

    parent.innerHTML = markup;
  }

  update(state: Record<string, any>): void {
    this.render(state);
  }
}
