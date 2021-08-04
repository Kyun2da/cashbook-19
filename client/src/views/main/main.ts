import UIComponent from '@/core/ui/ui-component';

import { groupingCashRecordsByDate, filterCashRecords, cashRecordValueSum } from '@/core/utils/functions';

import classNames from 'classnames';
import styles from './main.module.scss';

export default class Main extends UIComponent {
  get targetElement(): HTMLElement {
    return document.getElementById('main');
  }

  get targetPathname(): string {
    return '/';
  }

  recordTemplate(groupByDate: CashRecordGroupByDate): string {
    return Object.entries(groupByDate)
      .flatMap(([date, { records: rs, sum }]) => {
        const templates = [];

        const total = [];
        if (sum.income !== 0) {
          total.push(`수입 ${sum.income.toLocaleString()}`);
        }
        if (sum.expenditure !== 0) {
          total.push(`지출 ${sum.expenditure.toLocaleString()}`);
        }

        rs.forEach((r) => {
          templates.push(`
          <div class="${styles.record}">
            <div class="${styles['record-left']}">
              <div class="${styles.category}" style="background-color: ${r.category.color}">
                ${r.category.name}
              </div>
              <div class="${styles.title}">${r.title}</div>
            </div>
            <div class="${styles.payment}">${r.payment.name}</div>
            <div class="${styles['record-value']}">${r.value.toLocaleString()}원</div>
          </div>
        `);
        });

        templates.push(`
        <div class="${styles['daily-summary']}">
          <div class="${styles.date}">${date}</div>
          <div class="${styles.total}">${total.join(', ')}</div>
        </div>
      `);

        return templates;
      })
      .reverse()
      .join('');
  }

  template(state: StoreState): string {
    const { records, filter } = state;

    const filteredRecords = filterCashRecords(records, filter);
    const totalSum = cashRecordValueSum(filteredRecords);
    const groupByDate = groupingCashRecordsByDate(filteredRecords);

    return `
      <form class="${styles.form}">
        <div class="${styles.input}">
          <label for="date">일자</label>
          <input class=${styles.date} name="date" maxlength="8" />
        </div>
        <div class="${styles.input}">
          <label for="category">분류</label>
          <div class="${styles.select}">
            선택하세요
            <i class="wci-chevron-down"></i>
          </div>
        </div>
        <div class="${styles.input}">
          <label for="content">내용</label>
          <input class="${styles['content-input']}" name="content" placeholder="입력하세요"/>
        </div>
        <div class="${styles.input}">
          <label for="payment">결제수단</label>
          <div class="${styles.select}">
            선택하세요
            <i class="wci-chevron-down"></i>
          </div>
        </div>
        <div class="${styles.input}">
          <label for="value">금액</label>
          <div class="${styles['value-container']}">
            <i class="wci-dash"></i>
            <div class="${styles.value}">
              <input class="${styles['value-input']}" name="value" placeholder="입력하세요"/>
              원
            </div>
          </div>
        </div>
        <button type="button" class="${styles.button}">
          <i class="wci-check"></i>
        </button>
      </form>
      <div class="${styles.summary}">
        <div>전체 내역 ${filteredRecords.length}건</div>
        <div class="${styles['summary-right']}">
          <div class="${classNames(styles.filter, { [styles.active]: state.filter.income })}">
            <button type="button" class="${styles.checkbox}" data-filter="income">
              <i class="wci-check2"></i>
            </button>
            <div>수입 ${totalSum.income.toLocaleString()}</div>
          </div>
          <div class="${classNames(styles.filter, { [styles.active]: state.filter.expenditure })}">
            <button type="button" data-filter="expenditure" class="${styles.checkbox}">
              <i class="wci-check2"></i>
            </button>
            <div>지출 ${totalSum.expenditure.toLocaleString()}</div>
          </div>
        </div>
      </div>
      <div class="${styles['cash-record-list']}">   
        ${this.recordTemplate(groupByDate)}
      </div>
    `;
  }

  addEvent(state: StoreState, parent: HTMLElement): void {
    const incomeFilterButton = parent.querySelector('button[data-filter="income"]');
    const exFilterButton = parent.querySelector('button[data-filter="expenditure"]');

    incomeFilterButton.addEventListener('click', () => {
      this.store.update({
        filter: {
          ...state.filter,
          income: !state.filter.income,
        },
      });
    });

    exFilterButton.addEventListener('click', () => {
      this.store.update({
        filter: {
          ...state.filter,
          expenditure: !state.filter.expenditure,
        },
      });
    });
  }
}
