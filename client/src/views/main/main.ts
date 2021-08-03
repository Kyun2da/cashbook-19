import dayjs from 'dayjs';
import UIComponent from '@/core/ui/ui-component';
import classNames from 'classnames';
import styles from './main.module.scss';

interface Sum {
  income: number;
  expenditure: number;
}

interface GroupByDate {
  [key: string]: {
    records: CashRecord[];
    sum: Sum;
  };
}

export default class Main extends UIComponent {
  get targetElement(): HTMLElement {
    return document.querySelector('main');
  }

  refactorData(state: StoreState): [GroupByDate, Sum, number] {
    const { records, filter } = state;

    let totalIncome = 0;
    let totalExpenditure = 0;
    const filteredRecords = records.filter((record) => {
      switch (record.category.type) {
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

    const recordsByDate = filteredRecords.reduce<Record<string, CashRecord[]>>((acc, r) => {
      const date = dayjs(r.date).format('YYYY-MM-DD ddd');
      if (!(date in acc)) {
        acc[date] = [];
      }
      acc[date].push(r);
      return acc;
    }, {});

    const groupByDate = Object.entries(recordsByDate).reduce<GroupByDate>((acc, [date, rs]) => {
      const sumOfIncome = rs.filter((r) => r.category.type === 'income').reduce((sum, r) => sum + r.value, 0);
      const sumOfExpenditure = rs.filter((r) => r.category.type === 'expenditure').reduce((sum, r) => sum + r.value, 0);
      acc[date] = {
        records: rs,
        sum: {
          income: sumOfIncome,
          expenditure: sumOfExpenditure,
        },
      };
      return acc;
    }, {});

    return [groupByDate, { income: totalIncome, expenditure: totalExpenditure }, filteredRecords.length];
  }

  recordTemplate(groupByDate: GroupByDate): string {
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
    const [groupByDate, { income: totalIncome, expenditure: totalExpenditure }, totalLength] = this.refactorData(state);
    const recordsTemplate = this.recordTemplate(groupByDate);

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
          <div>전체 내역 ${totalLength}건</div>
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

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    if (nextState.router.pathname !== '/') return false;
    return true;
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
