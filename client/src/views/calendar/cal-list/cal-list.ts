import dayjs from 'dayjs';
import UIComponent from '@/core/ui/ui-component';

import { groupingCashRecordsByDate } from '@/core/utils/functions';

import CashRecordList from '@/components/cash-record-list/cash-record-list';

export default class CalList extends UIComponent {
  get targetElement(): HTMLElement {
    return document.getElementById('cal-list');
  }

  get targetPathname(): string {
    return '/calendar';
  }

  shouldUpdate(prevState: StoreState, nextState: StoreState): boolean {
    switch (true) {
      case prevState.router !== nextState.router:
      case prevState.date !== nextState.date:
        return true;
      case prevState.calendar.selection === nextState.calendar.selection:
        return false;
      default:
        return true;
    }
  }

  template(state: StoreState): string {
    const { year, month } = state.date;
    const { selection } = state.calendar;
    if (!selection || !dayjs(`${year}-${month}`, 'YYYY-M').isSame(selection, 'month')) {
      return '';
    }

    const filteredRecords = state.records.filter((r) => dayjs(r.date).isSame(selection, 'day'));
    const groupByDate = groupingCashRecordsByDate(filteredRecords);

    return CashRecordList(groupByDate);
  }
}
