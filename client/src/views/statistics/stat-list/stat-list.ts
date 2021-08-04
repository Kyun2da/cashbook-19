import UIComponent from '@/core/ui/ui-component';

import { groupingCashRecordsByDate } from '@/core/utils/functions';

import CashRecordList from '@/components/cash-record-list/cash-record-list';

export default class StatList extends UIComponent {
  get targetElement(): HTMLElement {
    return document.getElementById('stat-list');
  }

  get targetPathname(): string {
    return '/statistics';
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    if (prevState.statPage.categoryId === nextState.statPage.categoryId) {
      return false;
    }
    return true;
  }

  template(state: StoreState): string {
    const { categoryId } = state.statPage;
    if (!state.statPage.categoryId) {
      return '';
    }

    const filteredRecords = state.records.filter((r) => r.categoryId === categoryId);
    const groupByDate = groupingCashRecordsByDate(filteredRecords);

    return CashRecordList(groupByDate);
  }
}
