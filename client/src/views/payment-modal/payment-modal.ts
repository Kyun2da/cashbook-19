import State from '@/core/ui/state';
import UIComponent from '@/core/ui/ui-component';
import { enrollPayment } from '@/core/utils/api';
import Router from '@/core/utils/router';
import styles from './payment-modal.module.scss';

export default class PaymentModal extends UIComponent {
  constructor(router: Router, store: State) {
    super(router, store);
    this.handleCancelBtnClick = this.handleCancelBtnClick.bind(this);
    this.handleOkBtnClick = this.handleOkBtnClick.bind(this);
  }

  get targetElement(): HTMLElement {
    return document.querySelector('#payment-modal');
  }

  template(state: StoreState): string {
    if (!state.paymentModal) {
      return '';
    }

    return `
      <div class="${styles['payment-modal']}">
        <div class="${styles['payment-modal-container']}">
          <div class="${styles.title}">결제수단을 등록해 주세요.</div>
          <div>
            <div class="${styles['input-container']}">
              <label for="name">결제수단 이름 : </label>
              <input type="text" name="name" placeholder="5글자이하" maxlength="5"/>
            </div>
          </div>
          <div class="${styles['button-container']}">
            <button class="${styles.cancel}" type="button">취소</button>
            <button class="${styles.ok}" type="button">등록</button>
          </div>
        </div>
      </div>
    `;
  }

  addEvent(state: StoreState, parent: HTMLElement): void {
    if (!state.paymentModal) {
      return;
    }

    parent.querySelector(`.${styles.cancel}`).addEventListener('click', this.handleCancelBtnClick);
    parent.querySelector(`.${styles.ok}`).addEventListener('click', this.handleOkBtnClick);
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    return prevState.paymentModal !== nextState.paymentModal;
  }

  handleCancelBtnClick(): void {
    this.store.update({
      paymentModal: null,
    });
  }

  async handleOkBtnClick(): Promise<void> {
    const name = (this.targetElement.querySelector('input[name="name"]') as HTMLInputElement).value.trim();

    if (name.length === 0 || name.length >= 6) {
      this.store.update({
        alert: {
          error: true,
          title: '에러 발생',
          message: '결제수단 이름은 1글자 이상 6글자 이하여야 합니다.',
        },
        paymentModal: null,
      });
    } else {
      await enrollPayment(this.store, { name });
    }
  }
}
