import styles from './cash-record-list.module.scss';

export default function CashRecordList(groupByDate: CashRecordGroupByDate): string {
  const recordTemplate = Object.entries(groupByDate)
    .flatMap(([date, { records: rs, sum }]) => {
      const templates = [];

      const total = [];
      if (sum.income !== 0) {
        total.push(`수입 ${sum.income.toLocaleString()}`);
      }
      if (sum.expenditure !== 0) {
        total.push(`지출 ${sum.expenditure.toLocaleString()}`);
      }

      rs.forEach((r) => {
        templates.push(`
          <div class="${styles.record}">
            <div class="${styles['record-left']}">
              <div class="${styles.category}" style="background-color: ${r.category.color}">
                ${r.category.name}
              </div>
              <div class="${styles.title}">${r.title}</div>
            </div>
            <div class="${styles.payment}">${r.payment.name}</div>
            <div class="${styles['record-value']}">${r.value.toLocaleString()}원</div>
          </div>
        `);
      });

      templates.push(`
        <div class="${styles['daily-summary']}">
          <div class="${styles.date}">${date}</div>
          <div class="${styles.total}">${total.join(', ')}</div>
        </div>
      `);

      return templates;
    })
    .reverse()
    .join('');

  return `
    <div class="${styles['cash-record-list']}">   
      ${recordTemplate}
    </div>
  `;
}
