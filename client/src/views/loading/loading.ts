import UIComponent from '@/core/ui/ui-component';
import loadingImage from '@/assets/images/loading.gif';
import styles from './loading.module.scss';

export default class Loading extends UIComponent {
  get targetElement(): HTMLElement {
    return document.querySelector('#loading');
  }

  template(state: StoreState): string {
    const { loading } = state;

    if (!loading) {
      document.body.classList.remove('loading');
      return '';
    }

    document.body.classList.add('loading');
    return `
      <div class="${styles.loading}">
        <figure>
          <img src="${loadingImage}" alt="로딩" />
        </figure>
        <div class="${styles.message}">
          로딩중입니다
          <div class="${styles['dot-pulse']}"></div>
        </div>
      </div>
    `;
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    return prevState.loading !== nextState.loading;
  }
}
