import type { Observer } from '@/core/ui/observer';
import type Router from '@/core/utils/router';
import './header.scss';

export default class Header implements Observer {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  template(state: StoreState): string {
    return `
      <div class="header">
        <div class="title">우아한 가계부</div>
        <div class="date">
          <button><i class="wci-chevron-left"></i></button>
          <div>
            <div class="month">7월</div>
            <div class="year">2021</div>
          </div>
          <button><i class="wci-chevron-right"></i></button>
        </div>
        <div class="menu">
          <a href="/"><i class="wci-calendar"></i></a>
          <a href="/calendar"><i class="wci-chart"></i></a>
          <a href="/statistics"><i class="wci-file-text"></i></a>
        </div>
      </div>
    `;
  }

  render(state: StoreState): void {
    const markup = this.template(state);
    const parent = document.querySelector('header');

    parent.innerHTML = markup;

    const menu = document.querySelector('.menu');
    menu.addEventListener('click', this.handleClick.bind(this));
  }

  update(state: StoreState): void {
    this.render(state);
  }

  handleClick(e: Event): void {
    const target = e.target as HTMLElement;

    if (target instanceof HTMLAnchorElement) {
      e.preventDefault();
      this.router.push({
        pathname: target.href,
      });
    }
  }
}
