/* eslint-disable no-useless-return */

import State from '@/core/ui/state';
import { Observer } from '@/core/ui/observer';

import { getRecords } from '@/core/utils/api';

export default class DateObserver implements Observer {
  private store: State;

  constructor(store: State) {
    this.store = store;
  }

  async update(prevState: StoreState, nextState: StoreState): Promise<void> {
    if (prevState.date === nextState.date) {
      return;
    }

    const records = await getRecords(this.store);
    if (!records) {
      // 뭔가 오류
    }

    this.store.update({
      records,
    });
  }
}
