import State from '@/core/ui/state';
import Router from '@/core/utils/router';

import UIComponent from '@/core/ui/ui-component';
import { deleteCategory, deletePayment, enrollRecord } from '@/core/utils/api';

import colors from '@/core/styles/color.module.scss';
import styles from './form.module.scss';

export default class From extends UIComponent {
  constructor(router: Router, store: State) {
    super(router, store);
    this.handleCategorySelectorClick = this.handleCategorySelectorClick.bind(this);
    this.handlePaymentSelectorClick = this.handlePaymentSelectorClick.bind(this);
    this.toggleCashTypeContainer = this.toggleCashTypeContainer.bind(this);
    this.handleCategoryContextClick = this.handleCategoryContextClick.bind(this);
    this.handlePaymentContextClick = this.handlePaymentContextClick.bind(this);
    this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this);
  }

  get targetElement(): HTMLElement {
    return document.getElementById('form');
  }

  get targetPathname(): string {
    return '/';
  }

  template(state: StoreState): string {
    const { main, categories, payments } = state;

    const categoriesSelector = categories
      .filter((item) => item.type === main.cashType)
      .map(
        (category) => `
          <div class="${styles['context-container']}">
            <div>
              <div class="${styles['color-box']}" style="background-color: ${category.color}"></div>
              <div class="value" data-value="${category.id}">${category.name}</div>
            </div>
            <i class="wci-close"></i>
          </div>`,
      )
      .join('');

    const paymentsSelector = payments
      .map(
        (payment) => `
        <div class="${styles['context-container']}">
          <div>
            <div class="value" data-value="${payment.id}">${payment.name}</div>
          </div>
          <i class="wci-close"></i>
        </div>`,
      )
      .join('');

    const moneyBtn = main.cashType === 'income' ? '<i class="wci-plus"></i>' : '<i class="wci-dash"></i>';

    return `
        <form class="${styles.form}">
          <div class="${styles['payment-type']}">
            <button class="income" type="button">수입</button>
            <button class="expenditure" type="button">지출</button>
          </div>
          <div class="${styles.input}">
            <label for="date">일자</label>
            <input class=${styles.date} name="date" maxlength="8" />
          </div>
          <div class="${styles.input}">
            <label for="category">분류</label>
            <div class="${styles.select} ${styles['category-selector']}">
              <input class="${styles['category-input']}" name="category" placeholder="선택하세요" disabled/>
              <i class="wci-chevron-down"></i>
            </div>
            <div class="${styles['category-context']}">
              ${categoriesSelector}
              <div class="${styles['context-container']}" value="add">
                <div>
                  <div class="value">추가하기</div>
                </div>
              </div>
            </div>
          </div>
          <div class="${styles.input}">
            <label for="content">내용</label>
            <input class="${styles['content-input']}" name="content" placeholder="입력하세요"/>
          </div>
          <div class="${styles.input}">
            <label for="payment">결제수단</label>
            <div class="${styles.select} ${styles['payment-selector']}">
              <input class="${styles['payment-input']}" name="payment" placeholder="선택하세요" disabled/>
              <i class="wci-chevron-down"></i>
            </div>
            <div class="${styles['payment-context']}">
              ${paymentsSelector}
              <div class="${styles['context-container']}" value="add">
                  <div class="value">추가하기</div>
              </div>
            </div>
          </div>
          <div class="${styles.input}">
            <label for="value">금액</label>
            <div class="${styles['value-container']}">
              ${moneyBtn}
              <div class="${styles.value}">
                <input class="${styles['value-input']}" name="value" placeholder="입력하세요"/>
                원
              </div>
            </div>
          </div>
          <button class="${styles.button}">
            <i class="wci-check"></i>
          </button>
        </form>
    `;
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    return true;
  }

  addEvent(state: StoreState, parent: HTMLElement): void {
    const { main } = state;

    parent.querySelector(`.${styles['category-selector']}`).addEventListener('click', this.handleCategorySelectorClick);
    parent.querySelector(`.${styles['payment-selector']}`).addEventListener('click', this.handlePaymentSelectorClick);
    parent.querySelector(`.${styles['category-context']}`).addEventListener('click', this.handleCategoryContextClick);
    parent.querySelector(`.${styles['payment-context']}`).addEventListener('click', this.handlePaymentContextClick);
    parent.querySelector(`.${styles.button}`).addEventListener('click', this.handleSubmitButtonClick);

    const cashTypeContainer = parent.querySelector(`.${styles['payment-type']}`);
    cashTypeContainer.addEventListener('click', this.toggleCashTypeContainer);

    if (main.cashType === 'income') {
      cashTypeContainer.querySelector('.income').classList.add(styles.active);
    } else {
      cashTypeContainer.querySelector('.expenditure').classList.add(styles.active);
    }
  }

  handleCategorySelectorClick(): void {
    const parent = this.targetElement;
    const categoryContext = parent.querySelector(`.${styles['category-context']}`);
    categoryContext.classList.toggle(styles.active);
  }

  handlePaymentSelectorClick(): void {
    const parent = this.targetElement;
    const paymentContext = parent.querySelector(`.${styles['payment-context']}`);
    paymentContext.classList.toggle(styles.active);
  }

  toggleCashTypeContainer(e: Event): void {
    const target = e.target as HTMLButtonElement;
    if (target.type !== 'button') return;
    const parent = this.targetElement;
    const cashTypeContainer = parent.querySelector(`.${styles['payment-type']}`);
    const { main } = this.store.get();
    Array.from(cashTypeContainer.children).forEach((item) => {
      if (item === target) {
        item.classList.add(styles.active);
        const cashType = item.textContent === '수입' ? 'income' : 'expenditure';
        this.store.update({
          main: {
            ...main,
            cashType,
          },
        });
      } else {
        item.classList.remove(styles.active);
      }
    });
  }

  handleCategoryContextClick(e: Event): void {
    const target = e.target as HTMLElement;
    const parent = this.targetElement;
    const categorySelector = parent.querySelector(`.${styles['category-selector']}`);
    const categoryContext = parent.querySelector(`.${styles['category-context']}`);
    const categoryContainer = target.closest(`.${styles['context-container']}`).querySelector('.value') as HTMLElement;
    const categoryInput = categorySelector.firstElementChild as HTMLInputElement;

    if (target.classList.contains('wci-close')) {
      if (!this.store.get().user) {
        e.preventDefault();
        this.store.update({
          alert: {
            error: true,
            title: '에러 발생',
            message: '로그인이 필요합니다!',
          },
        });
      } else {
        this.store.update({
          alert: {
            title: `정말 ${categoryContainer.textContent} 카테고리를 삭제하시겠습니까?`,
            okMessage: '삭제',
            okColor: colors.error,
            callback: async (ok: boolean) => {
              if (ok) {
                await deleteCategory(this.store, categoryContainer.dataset.value);
              }
            },
            cancelable: true,
          },
        });
      }
    } else if (categoryContainer.textContent === '추가하기') {
      if (!this.store.get().user) {
        e.preventDefault();
        this.store.update({
          alert: {
            error: true,
            title: '에러 발생',
            message: '로그인이 필요합니다!',
          },
        });
      } else {
        this.store.update({
          categoryModal: true,
        });
      }
    } else {
      categoryInput.value = categoryContainer.textContent;
      categoryInput.setAttribute('data-value', categoryContainer.dataset.value);
      categoryContext.classList.toggle(styles.active);
    }
  }

  handlePaymentContextClick(e: Event): void {
    const target = e.target as HTMLButtonElement;
    const parent = this.targetElement;
    const paymentSelector = parent.querySelector(`.${styles['payment-selector']}`);
    const paymentContext = parent.querySelector(`.${styles['payment-context']}`);
    const paymentContainer = target.closest(`.${styles['context-container']}`).querySelector('.value') as HTMLElement;
    const paymentInput = paymentSelector.firstElementChild as HTMLInputElement;
    if (target.classList.contains('wci-close')) {
      if (!this.store.get().user) {
        e.preventDefault();
        this.store.update({
          alert: {
            error: true,
            title: '에러 발생',
            message: '로그인이 필요합니다!',
          },
        });
      } else {
        this.store.update({
          alert: {
            title: `정말 ${paymentContainer.textContent} 결제수단을 삭제하시겠습니까?`,
            okMessage: '삭제',
            okColor: colors.error,
            callback: async (ok: boolean) => {
              if (ok) {
                await deletePayment(this.store, paymentContainer.dataset.value);
              }
            },
            cancelable: true,
          },
        });
      }
    } else if (paymentContainer.textContent === '추가하기') {
      console.log('추가하기');
      if (!this.store.get().user) {
        e.preventDefault();
        this.store.update({
          alert: {
            error: true,
            title: '에러 발생',
            message: '로그인이 필요합니다!',
          },
        });
      } else {
        this.store.update({
          paymentModal: true,
        });
      }
    } else {
      paymentInput.value = paymentContainer.textContent;
      paymentInput.setAttribute('data-value', paymentContainer.dataset.value);
      paymentContext.classList.toggle(styles.active);
    }
  }

  async handleSubmitButtonClick(e: Event): Promise<void> {
    e.preventDefault();
    const parent = this.targetElement;
    const date = (parent.querySelector('input[name="date"]') as HTMLInputElement).value;
    const categoryId = (parent.querySelector('input[name="category"]') as HTMLInputElement).dataset.value;
    const title = (parent.querySelector('input[name="content"]') as HTMLInputElement).value;
    const paymentId = (parent.querySelector('input[name="payment"]') as HTMLInputElement).dataset.value;
    const value = parseInt((parent.querySelector('input[name="value"]') as HTMLInputElement).value, 10);
    const data: NewCashRecordRequest = { date, categoryId, title, paymentId, value };

    await enrollRecord(this.store, data);
  }
}
