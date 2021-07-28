import type { Observer } from '@/core/ui/observer';

export default class Main implements Observer {
  template(state: StoreState): string {
    return `
      <div class="main-page">
        <div>
          <label for="date">
            일자
            <input name="date">20210720</input>
          </label>
        </div>
        <div></div>
      </div>
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
