interface NewCashRecordRequest {
  categoryId: string;
  paymentId: string;
  title: string;
  value: number;
  date: string;
}

interface NewCategoryRequest {
  type: 'income' | 'expenditure';
  name: string;
  color: string;
}

type RequestType = NewCashRecordRequest | NewCategoryRequest;
