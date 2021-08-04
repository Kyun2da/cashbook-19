import dayjs from 'dayjs';

export function makePercent(arr: number[]): number[] {
  const off = 100 - arr.reduce((acc: number, x: number) => acc + Math.round(x), 0);
  return arr.map((x: number, i: number) => Math.round(x) + (off > i ? 1 : 0) - (i >= arr.length + off ? 1 : 0));
}

export const filterCashRecords = (cashRecords: CashRecord[], filter: FilterState): CashRecord[] =>
  cashRecords.filter(
    (record) =>
      (filter.income && record.category.type === 'income') ||
      (filter.expenditure && record.category.type === 'expenditure'),
  );

export const cashRecordValueSum = (cashRecords: CashRecord[]): CashRecordValueSum =>
  cashRecords.reduce<CashRecordValueSum>(
    (sum, cr) => {
      switch (cr.category.type) {
        case 'income':
          sum.income += cr.value;
          break;
        case 'expenditure':
          sum.expenditure += cr.value;
          break;
        default:
      }
      return sum;
    },
    { income: 0, expenditure: 0 },
  );

export function groupingCashRecordsByDate(cashRecords: CashRecord[]): CashRecordGroupByDate {
  const recordsByDate = cashRecords.reduce<Record<string, CashRecord[]>>((acc, r) => {
    const date = dayjs(r.date).format('YYYY-MM-DD ddd');
    if (!(date in acc)) {
      acc[date] = [];
    }
    acc[date].push(r);
    return acc;
  }, {});

  const groupByDate = Object.entries(recordsByDate).reduce<CashRecordGroupByDate>((acc, [date, rs]) => {
    const sumOfIncome = rs.filter((r) => r.category.type === 'income').reduce((sum, r) => sum + r.value, 0);
    const sumOfExpenditure = rs.filter((r) => r.category.type === 'expenditure').reduce((sum, r) => sum + r.value, 0);
    acc[date] = {
      records: rs,
      sum: {
        income: sumOfIncome,
        expenditure: sumOfExpenditure,
      },
    };
    return acc;
  }, {});

  return groupByDate;
}
