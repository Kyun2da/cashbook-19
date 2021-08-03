import Record from '@/models/record';

export default class RecordDto {
  id: number;

  categoryId: number;

  paymentId: number;

  title: string;

  value: number;

  date: Date;

  constructor(record: Record) {
    this.id = record.id;
    this.categoryId = record.categoryId;
    this.paymentId = record.paymentId;
    this.title = record.title;
    this.value = record.value;
    this.date = record.date;
  }
}
