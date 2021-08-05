import State from '@/core/ui/state';
import UIComponent from '@/core/ui/ui-component';
import { enrollCategory } from '@/core/utils/api';
import Router from '@/core/utils/router';
import styles from './category-modal.module.scss';

export default class CategoryModal extends UIComponent {
  constructor(router: Router, store: State) {
    super(router, store);
    this.handleCancelBtnClick = this.handleCancelBtnClick.bind(this);
    this.handleOkBtnClick = this.handleOkBtnClick.bind(this);
  }

  get targetElement(): HTMLElement {
    return document.querySelector('#category-modal');
  }

  template(state: StoreState): string {
    if (!state.categoryModal) {
      document.body.classList.remove('category-modal');
      return '';
    }

    document.body.classList.add('category-modal');

    return `
      <div class="${styles['category-modal']}">
        <div class="${styles['category-modal-container']}">
          <div class="${styles.title}">카테고리를 등록해 주세요.</div>
          <div>
            <div class="${styles['input-container']}">
              <label for="color">색상 : </label>
              <input type="color" name="color"
              value="#f6b73c"/>
            </div>
            <div class="${styles['input-container']}">
              <label for="type">카테고리 타입 : </label>
              <input type="radio" id="income" name="type" value="income" checked>
              <label for="income">수입</label>
              <input type="radio" id="expenditure" name="type" value="expenditure">
              <label for="expenditure">지출</label>
            </div>
            <div class="${styles['input-container']}">
              <label for="name">카테고리 이름 : </label>
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
    if (!state.categoryModal) {
      return;
    }

    parent.querySelector(`.${styles.cancel}`).addEventListener('click', this.handleCancelBtnClick);
    parent.querySelector(`.${styles.ok}`).addEventListener('click', this.handleOkBtnClick);
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    return prevState.categoryModal !== nextState.categoryModal;
  }

  handleCancelBtnClick(): void {
    this.store.update({
      categoryModal: null,
    });
  }

  async handleOkBtnClick(): Promise<void> {
    const color = (this.targetElement.querySelector('input[name="color"]') as HTMLInputElement).value.substr(1);
    const type = (this.targetElement.querySelector('input[name="type"]:checked') as HTMLInputElement).value;
    const name = (this.targetElement.querySelector('input[name="name"]') as HTMLInputElement).value;

    if (name.length === 0 || name.length >= 6) {
      this.store.update({
        alert: {
          error: true,
          title: '에러 발생',
          message: '카테고리 이름은 1글자 이상 6글자 이하여야 합니다.',
        },
        categoryModal: null,
      });
    } else {
      await enrollCategory(this.store, { color, type: type as 'income' | 'expenditure', name });
    }
  }
}
