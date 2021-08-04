import CashRecord from '@/models/cash-record';

export default class CashRecordDto {
  id: string;

  categoryId: string;

  paymentId: string;

  title: string;

  value: number;

  date: Date;

  constructor(record: CashRecord) {
    this.id = record.id;
    this.categoryId = record.categoryId;
    this.paymentId = record.paymentId;
    this.title = record.title;
    this.value = record.value;
    this.date = record.date;
  }
}
