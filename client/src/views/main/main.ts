import type { Observer } from '@/core/ui/observer';
import State from '@/core/ui/state';

import classNames from 'classnames';
import styles from './main.module.scss';

export default class Main implements Observer {
  private store: State;

  constructor(store: State) {
    this.store = store;
  }

  template(state: StoreState): string {
    const { records, categories, payments, filter } = state;

    let totalIncome = 0;
    let totalExpenditure = 0;
    const filteredRecords = records.filter((record) => {
      const category = categories[record.categoryId - 1];
      switch (category.type) {
        case 'income':
          totalIncome += record.value;
          return filter.income;
        case 'expenditure':
          totalExpenditure += record.value;
          return filter.expenditure;
        default:
          return false;
      }
    });

    let income = 0;
    let expenditure = 0;
    const recordsTemplate = filteredRecords
      .flatMap((record: CashRecord, i: number, arr: CashRecord[]) => {
        const history = [];
        let value;
        const categoryIdx = record.categoryId - 1;
        const categoryColor = categories[categoryIdx].color;

        if (categories[categoryIdx].type === 'expenditure') {
          value = record.value * -1;
          expenditure += value;
        } else {
          value = record.value;
          income += value;
        }

        history.push(`
        <div class="${styles.record}">
          <div class="${styles['record-left']}">
            <div class="${styles.category}" style="background-color: ${categoryColor}">
              ${categories[categoryIdx].name}
            </div>
            <div class="${styles.title}">${record.title}</div>
          </div>
          <div class="${styles.payment}">${payments[record.paymentId - 1].name}</div>
          <div class="${styles['record-value']}">${value.toLocaleString()}원</div>
        </div>
      `);

        if (i === arr.length - 1 || arr[i].date !== arr[i + 1].date) {
          const total = [];
          if (income !== 0) {
            total.push(`수입 ${income.toLocaleString()}`);
          }
          if (expenditure !== 0) {
            total.push(`지출 ${expenditure.toLocaleString()}`);
          }
          history.push(`
          <div class="${styles['daily-summary']}">
            <div class="${styles.date}">${record.date}</div>
            <div class="${styles.total}">${total.join(', ')}</div>
          </div>
        `);

          income = 0;
          expenditure = 0;
        }
        return history;
      })
      .reverse()
      .join('\n');

    return `
      <div class="${styles.main}">
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
              <div>수입 ${totalIncome.toLocaleString()}</div>
            </div>
            <div class="${classNames(styles.filter, { [styles.active]: state.filter.expenditure })}">
              <button type="button" data-filter="expenditure" class="${styles.checkbox}">
                <i class="wci-check2"></i>
              </button>
              <div>지출 ${totalExpenditure.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div class="${styles['cash-record-list']}">   
          ${recordsTemplate}
        </div>
      </div>
    `;
  }

  render(state: StoreState): void {
    if (state.router.pathname !== '/') return;

    const markup = this.template(state);
    const parent = document.querySelector('main');

    parent.innerHTML = markup;

    this.addEventHandler(state, parent);
  }

  update(state: StoreState): void {
    this.render(state);
  }

  addEventHandler(state: StoreState, parent: HTMLElement): void {
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
