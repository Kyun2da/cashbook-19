interface RouterState {
  pathname: string;
  search: string;
  hash: string;
}

interface User {
  name: string;
  avatarUri: string;
}

interface Category {
  id: number;
  type: 'income' | 'expenditure';
  name: string;
  color: string;
}

interface Payment {
  id: number;
  name: string;
}

interface CashRecord {
  id: number;
  categoryId: number;
  category: Category;
  paymentId: number;
  payment: Payment;
  title: string;
  value: number;
  date: Date;
}

interface DateState {
  year: number;
  month: number;
}

interface FilterState {
  income: boolean;
  expenditure: boolean;
}

type StoreStateValue = RouterState | User | Category[] | Payment[] | CashRecord[] | DateState | FilterState | boolean;

interface StoreState extends Record<string, StoreStateValue> {
  router: RouterState;
  login?: User;
  categories: Category[];
  payments: Payment[];
  records: CashRecord[];
  date: DateState;
  filter: FilterState;
  loading: boolean;
}

interface DonutRecord {
  id: number;
  name: string;
  color: string;
  value: number;
  percent: number;
}
