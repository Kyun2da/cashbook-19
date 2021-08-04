import UIComponent from '@/core/ui/ui-component';
import { makePercent } from '@/core/utils/functions';
import styles from './statistics.module.scss';

export default class Statistics extends UIComponent {
  get targetElement(): HTMLElement {
    return document.querySelector('main');
  }

  private refactorData(state: StoreState): [number, DonutRecord[]] {
    const { categories, records } = state;
    let total = 0;
    let donutRecord: DonutRecord[] = [];

    // 지출이 될 수 있는 카테고리로 데이터 초기화
    categories.forEach((item) => {
      if (item.type === 'expenditure') {
        donutRecord.push({ id: item.id, name: item.name, color: item.color, value: 0, percent: 0 });
      }
    });

    // 카테고리별 지출값 묶어주기
    records.forEach((record) => {
      const isExpenditure = categories[record.categoryId - 1].type === 'expenditure';
      const category = categories[record.categoryId - 1].name;
      if (isExpenditure) {
        total += record.value;
        const index = donutRecord.findIndex((item) => item.name === category);
        donutRecord[index].value += record.value;
      }
    });

    // 도넛 차트 지출 많은 순으로 정렬
    donutRecord = donutRecord.filter((item) => item.value !== 0).sort((a, b) => b.value - a.value);

    // 지출 금액만 따로 뺄 배열 생성
    const numberArr: number[] = [];

    // numberArr에 퍼센트 추가
    donutRecord.forEach((item) => {
      numberArr.push((item.value / total) * 100);
    });

    // 새로운 배열에 100%에 맞춘 정수 퍼센트 가져오기
    const newNumberArr = makePercent(numberArr);

    donutRecord.forEach((_, i) => {
      donutRecord[i].percent = newNumberArr[i];
    });

    return [total, donutRecord];
  }

  private categorySummaryTemplate(donutRecord: DonutRecord[]): string {
    const categorySummary = donutRecord
      .map(
        (item) => `
        <div class="${styles['category-summary']}">
          <div class="${styles.category}" style="background-color: ${item.color}">${item.name}</div>
          <div class="${styles.share}">${item.percent}%</div>
          <div class="${styles.value}">${item.value.toLocaleString()}</div>
        </div>`,
      )
      .join('');

    return categorySummary;
  }

  private donutChartTemplate(donutRecord: DonutRecord[]): string {
    let filled = 0;
    const donutChart = donutRecord
      .map((item) => {
        const [startAngle, radius, cx, cy, animationDuration, strokeWidth] = [-90, 30, 50, 50, 2000, 15];
        const dashArray = 2 * Math.PI * radius;
        const dashOffset = dashArray - (dashArray * item.percent) / 100;
        const angle = (filled * 360) / 100 + startAngle;
        const currentDuration = (animationDuration * item.percent) / 100;
        const delay = (animationDuration * filled) / 100;
        filled += item.percent;

        return `
          <circle r="${radius}" cx="${cx}" cy="${cy}" fill="transparent" stroke="${item.color}" stroke-width="${strokeWidth}" stroke-dasharray="${dashArray}" stroke-dashoffset="${dashArray}" transform="rotate(${angle} ${cx} ${cy})" style="transition: stroke-dashoffset ${currentDuration}ms linear ${delay}ms;" data-dashOffset="${dashOffset}"></circle>
        `;
      })
      .join('');

    return donutChart;
  }

  template(state: StoreState): string {
    const [total, donutRecord] = this.refactorData(state);
    const categorySummary = this.categorySummaryTemplate(donutRecord);
    const donutChart = this.donutChartTemplate(donutRecord);

    return `
      <div class="${styles['statistics-page']}">
        <div class="${styles['monthly-chart']}">
          <div class="${styles['donut-chart']}">
            <svg width="500" height="500" viewBox="0 0 100 100">
              ${donutChart}
            </svg>
          </div>
          <div class="${styles['monthly-summary']}">
            <div class="${styles.total}">이번달 지출 금액 ${total.toLocaleString()}</div>
              ${categorySummary}
          </div>
        </div>
      </div>
    `;
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    if (nextState.router.pathname !== '/statistics') return false;
    return true;
  }

  addEvent(state: StoreState, parent: HTMLElement): void {
    const svg = parent.querySelector('svg');
    Array.from(svg.children).forEach((item: HTMLElement) => {
      const circle = item;
      const data = circle.getAttribute('data-dashoffset');
      setTimeout(() => {
        circle.style['stroke-dashoffset'] = data;
      }, 100);
    });
  }
}
