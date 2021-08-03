import dayjs from 'dayjs';
import UIComponent from '@/core/ui/ui-component';
import styles from './header.module.scss';

export default class Header extends UIComponent {
  get targetElement(): HTMLElement {
    return document.querySelector('header');
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

  addEvent(state: StoreState, parent: HTMLElement): void {
    const { router, date } = state;
    const menu = parent.querySelector(`.${styles.menu}`);
    menu.addEventListener('click', this.handleClick.bind(this));

    const backMonthButton = parent.querySelector('.wci-chevron-left').closest('button');
    const goMonthButton = parent.querySelector('.wci-chevron-right').closest('button');

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

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    if (prevState.router !== nextState.router || prevState.date !== nextState.date) {
      return true;
    }

    return false;
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
