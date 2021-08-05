/* eslint-disable indent */
import dayjs from 'dayjs';

import UIComponent from '@/core/ui/ui-component';
import Router from '@/core/utils/router';
import State from '@/core/ui/state';

import { groupingCashRecordsByDate, cashRecordValueSum } from '@/core/utils/functions';

import classNames from 'classnames';
import styles from './table.module.scss';

export default class Table extends UIComponent {
  constructor(router: Router, store: State) {
    super(router, store);

    this.handleDayClick = this.handleDayClick.bind(this);
  }

  get targetElement(): HTMLElement {
    return document.getElementById('table');
  }

  get targetPathname(): string {
    return '/calendar';
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    if (prevState.date !== nextState.date) return false;
    return true;
  }

  cellTemplates(
    year: number,
    month: number,
    dayCount: number,
    groupByDate: CashRecordGroupByDate,
    selection: Date,
  ): string {
    const now = new Date();
    return [...Array(dayCount)]
      .map((_, index) => {
        const day = index + 1;
        const date = dayjs(`${year}-${month}-${day}`, 'YYYY-M-D');
        const isToday = date.isSame(now, 'day');
        const isSelection = selection && date.isSame(selection, 'day');
        const key = date.format('YYYY-MM-DD ddd');
        const recordsAndSum = groupByDate[key];
        if (!recordsAndSum) {
          return `
            <div class="${classNames(styles.block, { [styles.today]: isToday })}">
              <div class="${styles.dayNum}">${day}</div>
            </div>
          `;
        }

        const { sum } = recordsAndSum;
        const total = sum.income + sum.expenditure;

        return `
          <div class="${classNames(
            styles.block,
            styles.date,
            { [styles.today]: isToday },
            { [styles.selection]: isSelection },
          )}" data-date="${date.toISOString()}">
            <div class="${styles.dayNum}">${day}</div>
            <div class="${styles.income}">${sum.income > 0 ? sum.income.toLocaleString() : ''}</div>
            <div class="${styles.expenditure}">${sum.expenditure > 0 ? sum.expenditure.toLocaleString() : ''}</div>
            <div class="${styles.total}">${total.toLocaleString()}</div>
          </div>
        `;
      })
      .join('');
  }

  blankTemplate(num: number): string {
    return Array(num).fill(`<div class="${styles.block} ${styles.blank}"></div>`).join('');
  }

  template(state: StoreState): string {
    const {
      records,
      date: { year, month },
    } = state;
    const { selection } = state.calendar;
    const totalSum = cashRecordValueSum(records);
    const groupByDate = groupingCashRecordsByDate(records);
    const date = dayjs(`${year}-${month}`, 'YYYY-M');
    const dayNum = date.daysInMonth();
    const frontBlankNum = date.startOf('month').day();
    const backBlankNum = 6 - date.endOf('month').day();

    return `
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
        ${this.cellTemplates(year, month, dayNum, groupByDate, selection)}
        ${this.blankTemplate(backBlankNum)}
      </div>
      <div class="${styles.summary}">
        <div class="${styles['summary-left']}">
          <div>총 수입 ${totalSum.income.toLocaleString()}</div>
          <div>총 지출 ${totalSum.expenditure.toLocaleString()}</div>
        </div>
        <div>총계 ${(totalSum.income + totalSum.expenditure).toLocaleString()}</div>
      </div>
    `;
  }

  addEvent(state: StoreState, parent: HTMLElement): void {
    parent.querySelector(`.${styles.calendar}`).addEventListener('click', this.handleDayClick);
  }

  handleDayClick(e: Event): void {
    const target = e.target as HTMLElement;
    const cell = target.closest<HTMLElement>(`.${styles.date}`);
    if (!cell) {
      return;
    }

    const date = new Date(cell.dataset.date);
    this.store.update({
      calendar: {
        selection: date,
      },
    });
  }
}
