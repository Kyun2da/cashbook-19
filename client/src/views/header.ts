import type { Observer } from '@/lib/observer';
import type Router from '@/lib/router';

export default class Header implements Observer {
  private router: Router;

  constructor(router: Router) {
    this.router = router;

    const header = document.querySelector('header');
    header.addEventListener('click', this.handleClick.bind(this));
  }

  template(state: Record<string, any>): string {
    return `
      <div>HEADER ${state.router.pathname}</div>
      <ul>
        <li><a href="/a">/a로 이동 <i class="wci-calendar"></i></a></li>
        <li><a href="/b">/b로 이동 <i class="wci-chart"></i></a></li>
        <li><a href="/c">/c로 이동 <i class="wci-file-text"></i></a></li>
      </ul>
    `;
  }

  render(state: Record<string, any>): void {
    const markup = this.template(state);
    const parent = document.querySelector('header');

    parent.innerHTML = markup;
  }

  update(state: Record<string, any>): void {
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
