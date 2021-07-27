import type { Observer } from '@/lib/observer';

export default class A implements Observer {
  template(state: Record<string, any>): string {
    return `
      <div>A ${state.router.pathname}</div>
    `;
  }

  render(state: Record<string, any>): void {
    if (state.router.pathname !== '/a') return;

    const markup = this.template(state);
    const parent = document.querySelector('main');

    parent.innerHTML = markup;
  }

  update(state: Record<string, any>): void {
    this.render(state);
  }
}
