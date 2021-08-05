import UIComponent from '@/core/ui/ui-component';

import State from '@/core/ui/state';
import Router from '@/core/utils/router';

import { groupingCashRecordsByDate, filterCashRecords, cashRecordValueSum } from '@/core/utils/functions';

import CashRecordList from '@/components/cash-record-list/cash-record-list';

import classNames from 'classnames';
import styles from './main-list.module.scss';

export default class MainList extends UIComponent {
  constructor(router: Router, store: State) {
    super(router, store);

    this.handleFilterClick = this.handleFilterClick.bind(this);
  }

  get targetElement(): HTMLElement {
    return document.getElementById('main-list');
  }

  get targetPathname(): string {
    return '/';
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    switch (true) {
      case prevState.router !== nextState.router:
      case prevState.main.income !== nextState.main.income:
      case prevState.main.expenditure !== nextState.main.expenditure:
        return true;
      case prevState.records === nextState.records:
        return false;
      default:
        return true;
    }
  }

  template(state: StoreState): string {
    const { records, main } = state;

    const filteredRecords = filterCashRecords(records, main);
    const totalSum = cashRecordValueSum(records);
    const groupByDate = groupingCashRecordsByDate(filteredRecords);

    return `
      <div class="${styles.summary}">
        <div>전체 내역 ${records.length}건</div>
        <div class="${styles['summary-right']}">
          <div class="${classNames(styles.filter, { [styles.active]: state.main.income })}" data-type="income">
            <button type="button" class="${styles.checkbox}" data-filter="income">
              <i class="wci-check2"></i>
            </button>
            수입 ${totalSum.income.toLocaleString()}
          </div>
          <div class="${classNames(styles.filter, { [styles.active]: state.main.expenditure })}"
            data-type="expenditure">
            <button type="button" data-filter="expenditure" class="${styles.checkbox}">
              <i class="wci-check2"></i>
            </button>
            지출 ${totalSum.expenditure.toLocaleString()}
          </div>
        </div>
      </div>
      ${CashRecordList(groupByDate)}
    `;
  }

  addEvent(state: StoreState, parent: HTMLElement): void {
    parent.querySelector(`.${styles.summary}`).addEventListener('click', this.handleFilterClick);
  }

  handleFilterClick(e: Event): void {
    const target = e.target as HTMLElement;

    const filter = target.closest<HTMLElement>(`.${styles.filter}`);
    if (filter) {
      const { type } = filter.dataset;

      const { main } = this.store.get();
      this.store.update({
        main: {
          ...main,
          [type]: !main[type],
        },
      });
    }
  }
}
