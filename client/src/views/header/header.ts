import dayjs from 'dayjs';
import UIComponent from '@/core/ui/ui-component';

import config from '@/core/config';

import Router from '@/core/utils/router';
import State from '@/core/ui/state';
import { logoutExecute } from '@/core/utils/api';

import classNames from 'classnames';
import colors from '@/core/styles/color.module.scss';
import styles from './header.module.scss';

export default class Header extends UIComponent {
  constructor(router: Router, store: State) {
    super(router, store);
    this.handleClickLogin = this.handleClickLogin.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleDateClick = this.handleDateClick.bind(this);
    this.handleToggleContext = this.handleToggleContext.bind(this);
  }

  get targetElement(): HTMLElement {
    return document.querySelector('header');
  }

  menuTemplate(pathname: string): string {
    return [
      `<a href="/" class="${classNames({ [styles.active]: pathname === '/' })}">
        <i class="wci-calendar"></i>
      </a>`,
      `<a href="/calendar" class="${classNames({ [styles.active]: pathname === '/calendar' })}">
        <i class="wci-chart"></i>
      </a>`,
      `<a href="/statistics" class="${classNames({ [styles.active]: pathname === '/statistics' })}">
        <i class="wci-file-text"></i>
      </a>`,
    ].join('');
  }

  loginTemplate(state: StoreState): string {
    if (!state.user) {
      return `<a class="${styles.user}" href="${config.baseUrl}/auth/github/login">로그인</a>`;
    }
    return `
      <button class="${styles.user}">
        <img class="${styles.avatar}" src="${state.user.avatarUri} alt="${state.user.name}" />
      </button>
      <div class="${styles.context}">
        <button type="button" data-role="logout">로그아웃</button>
      </div>
    `;
  }

  template(state: StoreState): string {
    const {
      date: { year, month },
      router: { pathname },
    } = state;

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
          ${this.menuTemplate(pathname)}
          ${this.loginTemplate(state)}
        </div>
      </div>
    `;
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    switch (true) {
      case prevState.router !== nextState.router:
      case prevState.date !== nextState.date:
      case prevState.user !== nextState.user:
        return true;
      default:
        return false;
    }
  }

  addEvent(state: StoreState, parent: HTMLElement): void {
    parent.querySelector(`.${styles.menu}`).addEventListener('click', this.handleMenuClick);
    parent.querySelector(`.${styles.date}`).addEventListener('click', this.handleDateClick);

    if (state.user) {
      parent.querySelector(`.${styles.context}`).addEventListener('click', this.handleContextClick);
      window.removeEventListener('click', this.handleToggleContext);
      window.addEventListener('click', this.handleToggleContext);
    } else {
      parent.querySelector(`a.${styles.user}`).addEventListener('click', this.handleClickLogin);
    }
  }

  handleClickLogin(): void {
    this.store.update({
      loading: true,
    });
  }

  handleToggleContext(e: Event): void {
    const parent = this.targetElement;
    const contextMenu = parent.querySelector(`.${styles.context}`) as HTMLElement;
    const avatarUri = parent.querySelector(`.${styles.avatar}`);
    if (e.target === avatarUri) {
      contextMenu.classList.toggle(styles.active);
    } else {
      contextMenu.classList.remove(styles.active);
    }
  }

  handleContextClick(e: Event): void {
    const target = e.target as HTMLElement;

    if (target.dataset.role === 'logout') {
      this.store.update({
        alert: {
          title: '정말 로그아웃 하시겠습니까?',
          okMessage: '로그아웃',
          okColor: colors.error,
          callback: async (ok: boolean) => {
            if (ok) {
              await logoutExecute(this.store);
            }
          },
          cancelable: true,
        },
      });
    }
  }

  handleDateClick(e: Event): void {
    const target = e.target as HTMLElement;
    let moveMonth = 0;
    if (target.tagName === 'I') {
      if (target.classList.contains('wci-chevron-left')) {
        moveMonth = -1;
      } else if (target.classList.contains('wci-chevron-right')) {
        moveMonth = 1;
      }
    }

    if (moveMonth === 0) {
      e.preventDefault();
      return;
    }

    const { year, month } = this.store.get().date;
    const beforeDate = dayjs()
      .year(year)
      .month(month - 1)
      .add(moveMonth, 'month');
    this.store.update({
      date: {
        year: beforeDate.year(),
        month: beforeDate.month() + 1,
      },
    });
  }

  handleMenuClick(e: Event): void {
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
