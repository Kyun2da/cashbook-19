import Router from '@/core/utils/router';
import State from '@/core/ui/state';

import UIComponent from '@/core/ui/ui-component';
import { makePercent } from '@/core/utils/functions';

import classNames from 'classnames';
import styles from './pie-chart.module.scss';

export default class PieChart extends UIComponent {
  constructor(router: Router, store: State) {
    super(router, store);

    this.handleCategorySummaryClick = this.handleCategorySummaryClick.bind(this);
  }

  get targetElement(): HTMLElement {
    return document.getElementById('pie-chart');
  }

  get targetPathname(): string {
    return '/statistics';
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
      const isExpenditure = record.category.type === 'expenditure';
      const category = record.category.name;
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

  private categorySummaryTemplate(state: StoreState, donutRecord: DonutRecord[]): string {
    const { categoryId } = state.statPage;

    return donutRecord
      .map(
        (item) => `
          <div class="${classNames(styles['category-summary'], { [styles.active]: item.id === categoryId })}"
            data-category-id="${item.id}"
          >
            <div class="${styles.category}" style="background-color: ${item.color}">${item.name}</div>
            <div class="${styles.share}">${item.percent}%</div>
            <div class="${styles.value}">${item.value.toLocaleString()}</div>
          </div>`,
      )
      .join('');
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

    return `
      <div class="${styles['monthly-chart']}">
        <div class="${styles['donut-chart']}">
          <svg width="500" height="500" viewBox="0 0 100 100">
            ${this.donutChartTemplate(donutRecord)}
          </svg>
        </div>
        <div class="${styles['monthly-summary']}">
          <div class="${styles.total}">이번달 지출 금액 ${total.toLocaleString()}</div>
            ${this.categorySummaryTemplate(state, donutRecord)}
        </div>
      </div>
    `;
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    switch (true) {
      case prevState.statPage.categoryId !== nextState.statPage.categoryId:
      case prevState.router !== nextState.router:
        return true;
      case prevState.records === nextState.records:
        return false;
      default:
        return true;
    }
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

    parent.querySelector(`.${styles['monthly-summary']}`).addEventListener('click', this.handleCategorySummaryClick);
  }

  handleCategorySummaryClick(e: Event): void {
    const target = e.target as HTMLElement;
    const categorySummary = target.closest<HTMLElement>(`.${styles['category-summary']}`);
    if (!categorySummary) {
      e.preventDefault();
      return;
    }

    const { categoryId } = categorySummary.dataset; // parseInt(categorySummary.dataset.categoryId, 10);
    this.store.update({
      statPage: {
        categoryId,
      },
    });
  }
}
