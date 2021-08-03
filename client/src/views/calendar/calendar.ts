import UIComponent from '@/core/ui/ui-component';
import styles from './calendar.module.scss';

export default class Calendar extends UIComponent {
  get targetElement(): HTMLElement {
    return document.querySelector('main');
  }

  refactorData(state: StoreState): [number[][], number, number] {
    const { records, categories } = state;
    const recordArr = Array.from(Array(32), () => [0, 0, 0]);
    let incomeTotal = 0;
    let expenditureTotal = 0;

    records.forEach((item) => {
      const date = Number(String(item.date).split('-')[2]);
      if (categories[item.categoryId - 1].type === 'income') {
        recordArr[date][0] += item.value;
        recordArr[date][2] += item.value;
        incomeTotal += item.value;
      } else {
        recordArr[date][1] -= item.value;
        recordArr[date][2] -= item.value;
        expenditureTotal -= item.value;
      }
    });

    return [recordArr, incomeTotal, expenditureTotal];
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    if (nextState.router.pathname !== '/calendar') return false;
    return true;
  }

  template(state: StoreState): string {
    const [recordArr, incomeTotal, expenditureTotal] = this.refactorData(state);

    const yearNum = new Date().getFullYear();
    const monthNum = new Date().getMonth();
    const dayNum = new Date(yearNum, monthNum + 1, 0).getDate();
    const frontBlankNum = new Date(yearNum, monthNum, 1).getDay();
    const backBlankNum = 6 - new Date(yearNum, monthNum, dayNum).getDay();
    const BlankArr = (num: number) => Array(num).fill(`<div class="${styles.block}"></div>`);
    const dayArr = (num: number) =>
      Array.from(Array(num), (_, index) => {
        const idx = index + 1;
        const income = recordArr[idx][0] === 0 ? '' : recordArr[idx][0];
        const expenditure = recordArr[idx][1] === 0 ? '' : recordArr[idx][1];
        let total: number | string = '';
        if (income !== '' || expenditure !== '') [, , total] = recordArr[idx];
        return `<div class="${styles.block}">
             <div class="${styles.dayNum}">${idx}</div>
            <div class="${styles.income}">${income.toLocaleString()}</div>
            <div class="${styles.expenditure}">${expenditure.toLocaleString()}</div>
            <div class="${styles.total}">${total.toLocaleString()}</div>
           </div>`;
      });

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
          ${BlankArr(frontBlankNum).join('')}
          ${dayArr(dayNum).join('')}
          ${BlankArr(backBlankNum).join('')}
        </div>
        <div class="${styles.summary}">
          <div class="${styles['summary-left']}">
            <div>총 수입 ${incomeTotal.toLocaleString()}</div>
            <div>총 지출 ${expenditureTotal.toLocaleString()}</div>
          </div>
          <div>총계 ${(incomeTotal + expenditureTotal).toLocaleString()}</div>
        </div>
      </div>
    `;
  }

  addEvent(): void {}
}
