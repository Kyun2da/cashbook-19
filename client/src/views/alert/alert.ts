import UIComponent from '@/core/ui/ui-component';
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

    const { title, okMessage, cancelable, okColor } = state.alert;
    document.body.classList.add('alert');
    const cancelButton = cancelable ? `<button class="${styles.cancel}" type="button">취소</button>` : '';

    return `
      <div class="${styles.alert}">
        <div class="${styles['alert-container']}">
          <div class="${styles.title}">${title}</div>
          <div class="${styles['button-container']}">
            ${cancelButton}
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
    const { callback, cancelable } = state.alert;

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
