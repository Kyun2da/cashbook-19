interface NewCashRecordRequest {
  categoryId: string;
  paymentId: string;
  title: string;
  value: number;
  date: string;
}

type RequestType = NewCashRecordRequest;
