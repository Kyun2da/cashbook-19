import UIComponent from '@/core/ui/ui-component';
import dayjs from 'dayjs';

import { groupingCashRecordsByDate, cashRecordValueSum } from '@/core/utils/functions';

import styles from './calendar.module.scss';

export default class Calendar extends UIComponent {
  get targetElement(): HTMLElement {
    return document.querySelector('main');
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    if (nextState.router.pathname !== '/calendar') return false;
    if (prevState.date !== nextState.date) return false;
    return true;
  }

  cellTemplates(year: number, month: number, dayCount: number, groupByDate: CashRecordGroupByDate): string {
    return [...Array(dayCount)]
      .map((_, index) => {
        const date = index + 1;
        const key = dayjs(`${year}-${month}-${date}`, 'YYYY-M-D').format('YYYY-MM-DD ddd');
        const recordsAndSum = groupByDate[key];
        if (!recordsAndSum) {
          return `
            <div class="${styles.block}">
              <div class="${styles.dayNum}">${date}</div>
            </div>
          `;
        }

        const { sum } = recordsAndSum;
        const total = sum.income + sum.expenditure;

        return `
          <div class="${styles.block}">
            <div class="${styles.dayNum}">${date}</div>
            <div class="${styles.income}">${sum.income > 0 ? sum.income.toLocaleString() : ''}</div>
            <div class="${styles.expenditure}">${sum.expenditure > 0 ? sum.expenditure.toLocaleString() : ''}</div>
            <div class="${styles.total}">${total.toLocaleString()}</div>
          </div>
        `;
      })
      .join('');
  }

  blankTemplate(num: number): string {
    return Array(num).fill(`<div class="${styles.block}"></div>`).join('');
  }

  template(state: StoreState): string {
    const { records, date } = state;
    const totalSum = cashRecordValueSum(records);
    const groupByDate = groupingCashRecordsByDate(records);
    const dayNum = new Date(date.year, date.month, 0).getDate();
    const frontBlankNum = new Date(date.year, date.month, 1).getDay();
    const backBlankNum = 6 - new Date(date.year, date.month, dayNum).getDay();

    return `
      <div class="${styles['calendar-page']}">
        <div class="${styles.week}">
          <div>일</div>
          <div>월</div>
          <div>화</div>
          <div>수</div>
          <div>목</div>
          <div>금</div>
          <div>토</div>
        </div>
        <div class="${styles.calendar}">
          ${this.blankTemplate(frontBlankNum)}
          ${this.cellTemplates(date.year, date.month, dayNum, groupByDate)}
          ${this.blankTemplate(backBlankNum)}
        </div>
        <div class="${styles.summary}">
          <div class="${styles['summary-left']}">
            <div>총 수입 ${totalSum.income.toLocaleString()}</div>
            <div>총 지출 ${totalSum.expenditure.toLocaleString()}</div>
          </div>
          <div>총계 ${(totalSum.income + totalSum.expenditure).toLocaleString()}</div>
        </div>
      </div>
    `;
  }
}
