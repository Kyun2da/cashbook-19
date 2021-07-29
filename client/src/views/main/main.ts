import type { Observer } from '@/core/ui/observer';
import styles from './main.module.scss';

export default class Main implements Observer {
  template(state: StoreState): string {
    const { records, categories, payments } = state;

    let sum = 0;
    let income = 0;
    let expenditure = 0;

    const recordsTemplate = records.flatMap((record:CashRecord, i: number) => {
      const history = [];
      let value;
      const categoryIdx = record.categoryId - 1;
      const categoryColor = categories[categoryIdx].color;

      if (categories[categoryIdx].type === 'expenditure') {
        expenditure += record.value;
        value = record.value * -1;
      } else {
        income += record.value;
        value = record.value;
      }

      sum += value;
      history.push(`
        <div class="${styles.record}">
          <div class="${styles['record-left']}">
            <div class="${styles.category}" style="background-color: ${categoryColor}">${categories[categoryIdx].name}</div>
            <div class="${styles.title}">${record.title}</div>
          </div>
          <div class="${styles.payment}">${payments[record.paymentId - 1].name}</div>
          <div class="${styles['record-value']}">${value.toLocaleString()}원</div>
        </div>
      `);

      if (i === records.length - 1 || records[i].date !== records[i + 1].date) {
        history.push(`
          <div class="${styles['daily-summary']}">
            <div class="${styles.date}">${record.date}</div>
            <div class="${styles.total}">${sum > 0 ? '수입 ' : '지출 '} ${sum.toLocaleString()}</div>
          </div>
        `);

        sum = 0;
      }
      return history;
    }).reverse().join('\n');

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
          <div>전체 내역 ${records.length}건</div>
          <div class="${styles['summary-right']}">
            <div class="${styles.filter}">
              <button type="button" class="${styles.checkbox} ${styles.active}">
                <i class="wci-check2"></i>
              </button>
              <div>수입 ${income.toLocaleString()}</div>
            </div>
            <div class="${styles.filter}">
              <button type="button" class="${styles.checkbox}">
                <i class="wci-check2"></i>
              </button>
              <div>지출 ${expenditure.toLocaleString()}</div>
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
  }

  update(state: StoreState): void {
    this.render(state);
  }
}
