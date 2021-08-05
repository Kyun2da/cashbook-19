import UIComponent from '@/core/ui/ui-component';

import colors from '@/core/styles/color.module.scss';
import styles from './alert.module.scss';

export default class Alert extends UIComponent {
  get targetElement(): HTMLElement {
    return document.querySelector('#alert');
  }

  template(state: StoreState): string {
    if (!state.alert) {
      document.body.classList.remove('alert');
      return '';
    }

    const {
      error,
      success,
      title = '알림',
      message,
      okMessage = '확인',
      cancelable,
      okColor = colors.primary1,
    } = state.alert;
    document.body.classList.add('alert');
    const cancelButtonTemplate = cancelable ? `<button class="${styles.cancel}" type="button">취소</button>` : '';
    const herlTemplate = error ? `<div class="${styles.herl}">헐</div>` : '';
    const successTemplate = success ? `<div class="${styles.success}">성공</div>` : '';
    const messageTemplate = message ? `<p class="${styles.message}">${message}</p>` : '';

    return `
      <div class="${styles.alert}">
        <div class="${styles['alert-container']}">
          ${herlTemplate}
          ${successTemplate}
          <div class="${styles.title}">${title}</div>
          ${messageTemplate}
          <div class="${styles['button-container']}">
            ${cancelButtonTemplate}
            <button class="${styles.ok}" type="button" style="color: ${okColor}">${okMessage}</button>
          </div>
        </div>
      </div>
    `;
  }

  addEvent(state: StoreState, parent: HTMLElement): void {
    if (!state.alert) {
      return;
    }
    const {
      callback = () => {
        //
      },
      cancelable,
    } = state.alert;

    if (cancelable) {
      const cancelBtn = parent.querySelector(`.${styles.cancel}`);
      cancelBtn.addEventListener('click', () => {
        callback(false);
        this.store.update({
          alert: null,
        });
      });
    }

    const okBtn = parent.querySelector(`.${styles.ok}`);
    okBtn.addEventListener('click', () => {
      callback(true);
      this.store.update({
        alert: null,
      });
    });
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    return prevState.alert !== nextState.alert;
  }
}
