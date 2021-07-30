import type { Observer } from '@/core/ui/observer';
import type Router from '@/core/utils/router';
import State from '@/core/ui/state';
import dayjs from 'dayjs';
import styles from './header.module.scss';

export default class Header implements Observer {
  private router: Router;

  private store: State;

  constructor(router: Router, state: State) {
    this.router = router;
    this.store = state;
  }

  template(state: StoreState): string {
    const { date } = state;
    const { year, month } = date;
    return `
      <div class="${styles.header}">
        <div class="${styles.title}">우아한 가계부</div>
        <div class="${styles.date}">
          <button class="${styles.button}"><i class="wci-chevron-left"></i></button>
          <div>
            <div class="${styles.month}">${month}월</div>
            <div class="${styles.year}">${year}</div>
          </div>
          <button class="${styles.button}"><i class="wci-chevron-right"></i></button>
        </div>
        <div class="${styles.menu}">
          <a href="/"><i class="wci-calendar"></i></a>
          <a href="/calendar"><i class="wci-chart"></i></a>
          <a href="/statistics"><i class="wci-file-text"></i></a>
        </div>
      </div>
    `;
  }

  render(state: StoreState): void {
    const { router, date } = state;
    const markup = this.template(state);
    const parent = document.querySelector('header');

    parent.innerHTML = markup;
    const menu = document.querySelector(`.${styles.menu}`);
    menu.addEventListener('click', this.handleClick.bind(this));

    const backMonthButton = document.querySelector('.wci-chevron-left').closest('button');
    const goMonthButton = document.querySelector('.wci-chevron-right').closest('button');

    backMonthButton.addEventListener('click', () => {
      const { year, month } = date;
      const beforeDate = dayjs()
        .year(year)
        .month(month - 1)
        .subtract(1, 'month');
      this.store.update({
        ...state,
        date: {
          year: beforeDate.year(),
          month: beforeDate.month() + 1,
        },
      });
    });

    goMonthButton.addEventListener('click', () => {
      const { year, month } = date;
      const nextDate = dayjs()
        .year(year)
        .month(month - 1)
        .add(1, 'month');
      this.store.update({
        ...state,
        date: {
          year: nextDate.year(),
          month: nextDate.month() + 1,
        },
      });
    });

    Array.from(menu.children).forEach((el) => {
      if (el.getAttribute('href') === router.pathname) {
        el.classList.add(styles.active);
      }
    });
  }

  update(state: StoreState): void {
    this.render(state);
  }

  handleClick(e: Event): void {
    const target = e.target as HTMLElement;

    if (target.tagName === 'I') {
      e.preventDefault();
      const a = target.parentElement as HTMLAnchorElement;
      this.router.push({
        pathname: a.href,
      });
    }
  }
}
